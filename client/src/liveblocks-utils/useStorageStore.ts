import { useState, useEffect } from "react";
import { useRoom } from "@liveblocks/react/suspense";
import {
  computed,
  createPresenceStateDerivation,
  createTLStore,
  defaultShapeUtils,
  DocumentRecordType,
  InstancePresenceRecordType,
  PageRecordType,
  react,
  type IndexKey,
  type TLAnyShapeUtilConstructor,
  type TLDocument,
  type TLInstancePresence,
  type TLPageId,
  type TLRecord,
  type TLStoreEventInfo,
  type TLStoreWithStatus,
} from "tldraw";

export const useStorageStore = ({
  shapeUtils = [],
  user,
}: Partial<{
  hostUrl: string;
  version: number;
  shapeUtils: TLAnyShapeUtilConstructor[];
  user: {
    id: string;
    color: string;
    name: string;
  };
}>) => {
  const room = useRoom();

  const [store] = useState(() => {
    const store = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
    });
    return store;
  });

  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: "loading",
  });

  useEffect(() => {
    const unsubs: (() => void)[] = [];
    setStoreWithStatus({ status: "loading" });

    const setup = async () => {
      const { root } = await room.getStorage();
      const liveRecords = root.get("records");

      // Initialize tldraw with records from Liveblocks Storage
      store.clear();
      store.put(
        [
          DocumentRecordType.create({
            id: "document:document" as TLDocument["id"],
          }),
          PageRecordType.create({
            id: "page:page" as TLPageId,
            name: "Page 1",
            index: "a1" as IndexKey,
          }),
          ...[...liveRecords.values()],
        ],
        "initialize"
      );

      // Sync tldraw changes with Liveblocks Storage
      unsubs.push(
        store.listen(
          ({ changes }: TLStoreEventInfo) => {
            room.batch(() => {
              Object.values(changes.added).forEach((record) => {
                liveRecords.set(record.id, record);
              });

              Object.values(changes.updated).forEach(([_, record]) => {
                liveRecords.set(record.id, record);
              });

              Object.values(changes.removed).forEach((record) => {
                liveRecords.delete(record.id);
              });
            });
          },
          { source: "user", scope: "document" }
        )
      );

      // Sync tldraw changes with Liveblocks Presence
      const syncStoreWithPresence = ({ changes }: TLStoreEventInfo) => {
        room.batch(() => {
          Object.values(changes.added).forEach((record) => {
            room.updatePresence({ [record.id]: record });
          });

          Object.values(changes.updated).forEach(([_, record]) => {
            room.updatePresence({ [record.id]: record });
          });

          Object.values(changes.removed).forEach((record) => {
            room.updatePresence({ [record.id]: null });
          });
        });
      };

      unsubs.push(
        store.listen(syncStoreWithPresence, {
          source: "user",
          scope: "session",
        })
      );

      unsubs.push(
        store.listen(syncStoreWithPresence, {
          source: "user",
          scope: "presence",
        })
      );

      // Update tldraw when Storage changes
      unsubs.push(
        room.subscribe(
          liveRecords,
          (storageChanges) => {
            const toRemove: TLRecord["id"][] = [];
            const toPut: TLRecord[] = [];

            for (const update of storageChanges) {
              if (update.type !== "LiveMap") {
                return;
              }

              for (const [id, { type }] of Object.entries(update.updates)) {
                switch (type) {
                  // Object deleted from Liveblocks, remove from tldraw
                  case "delete": {
                    toRemove.push(id as TLRecord["id"]);
                    break;
                  }
                  // Object updated on Liveblocks, update tldraw
                  case "update": {
                    const curr = update.node.get(id);
                    if (curr) {
                      toPut.push(curr as any as TLRecord);
                    }
                    break;
                  }
                }
              }
            }

            // Update tldraw with changes
            store.mergeRemoteChanges(() => {
              if (toRemove.length) {
                store.remove(toRemove);
              }
              if (toPut.length) {
                store.put(toPut);
              }
            });
          },
          { isDeep: true }
        )
      );

      // Set user's info
      const userPreferences = computed<{
        id: string;
        color: string;
        name: string;
      }>("userPreferences", () => {
        if (!user) {
          throw new Error("Failed to get user");
        }
        return {
          id: user.id,
          color: user.color,
          name: user.name,
        };
      });

      // Unique ID for this session is their connectionId
      const connectionIdString = "" + (room.getSelf()?.connectionId || 0);

      const presenceDerivation = createPresenceStateDerivation(
        userPreferences,
        InstancePresenceRecordType.createId(connectionIdString)
      )(store);

      // Update presence with tldraw values
      room.updatePresence({
        presence: presenceDerivation.get() ?? null,
      });

      // Update Liveblocks when tldraw presence changes
      unsubs.push(
        react("when presence changes", () => {
          const presence = presenceDerivation.get() ?? null;
          requestAnimationFrame(() => {
            room.updatePresence({ presence });
          });
        })
      );

      // Sync Liveblocks presence with tldraw
      unsubs.push(
        room.subscribe("others", (others, event) => {
          const toRemove: TLInstancePresence["id"][] = [];
          const toPut: TLInstancePresence[] = [];

          switch (event.type) {
            // A user disconnected from Liveblocks
            case "leave": {
              if (event.user.connectionId) {
                toRemove.push(
                  InstancePresenceRecordType.createId(
                    `${event.user.connectionId}`
                  )
                );
              }
              break;
            }

            // Others was reset, e.g. after losing connection and returning
            case "reset": {
              others.forEach((other) => {
                toRemove.push(
                  InstancePresenceRecordType.createId(`${other.connectionId}`)
                );
              });
              break;
            }

            // A user entered or their presence updated
            case "enter":
            case "update": {
              const presence = event?.user?.presence;
              if (presence?.presence) {
                toPut.push(event.user.presence.presence);
              }
            }
          }

          // Update tldraw with changes
          store.mergeRemoteChanges(() => {
            if (toRemove.length) {
              store.remove(toRemove);
            }
            if (toPut.length) {
              store.put(toPut);
            }
          });
        })
      );

      setStoreWithStatus({
        store,
        status: "synced-remote",
        connectionStatus: "online",
      });
    };

    setup();

    return () => {
      unsubs.forEach((fn) => fn());
      unsubs.length = 0;
    };
  }, [room, store]);

  return storeWithStatus;
};

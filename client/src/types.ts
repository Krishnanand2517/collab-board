export type WorkspaceScope = "personal" | "team";

export type WorkspaceType = {
  id: string;
  name?: string;
  scope: WorkspaceScope;
  snapshot: string;
  previewImg: string;
  createdAt?: string;
  updatedAt: string;
};

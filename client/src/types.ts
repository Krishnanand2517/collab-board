export type WorkspaceScope = "personal" | "team";

export type WorkspaceType = {
  id: string;
  name: string;
  scope: WorkspaceScope;
  snapshot: string;
  previewImg: string;
  createdAt?: string;
  updatedAt: string;
  ownerId: string;
  role?: string;
};

export type WorkspaceDbResponse = Omit<
  WorkspaceType,
  "previewImg" | "createdAt" | "updatedAt" | "ownerId"
> & {
  preview_img: string;
  created_at?: string;
  updated_at: string;
  owner_id: string;
  role: string;
};

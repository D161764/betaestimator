export interface DraftWorkPackage {
  id: string;
  timestamp: number;
  data: string; // JSON stringified WorkPackage
}

export interface DraftStore {
  drafts: DraftWorkPackage[];
}
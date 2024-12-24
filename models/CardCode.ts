export interface CardGroupI {
  canAdd: boolean;
  canDelete: boolean;
  canUpdate: boolean;
  expireAt: string;
  groupCode: string;
  notUsedCount: number;
  numberOfDays: number;
  totalCount: number;
  usedCount: number;
}

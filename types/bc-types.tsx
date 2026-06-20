export type SessionUser = {
  user: {
    Email: string | null
    UserId: string | null
    Role: string | null
  }
}
export type LocationType = {
    Location: string;
}
export interface RequisitionType {
  Code: string;
  Description: string;
  ForSubRequest: boolean;
  ProductPostingDimension: string;
  ProductPostingDimensionNo: number;
}
export interface DimensionValueType {
  Code: string;
  Name: string;
}
export type RequestType = {
    RequestType: string,
    RequestNo: string,
    Description: string,
    RequestStatus: string,
    SectionCode: string,
    WarehouseLocation: string,
    ShortcutDimension1Code: string,
    ShortcutDimension2Code: string,
    ShortcutDimension3Code: string,
    ShortcutDimension4Code: string,
    ShortcutDimension5Code: string,
    ShortcutDimension6Code: string,
    ShortcutDimension7Code: string,
    ShortcutDimension8Code: string,
    RequestedBy: string,
    Lines: RequestLineType[];
}
export type DimensionType = {
  ShortcutDimensionNo: number;
  DimensionCode: string;
  Visible: boolean;
}
export interface RequestLineType {
  LineNo: number;
  Type: string;
  No: string;
  Description: string;
  WarehouseLocation: string;
  Quantity: number;
  UnitOfMeasure: string;
  UnitCost: number;
  GenProdPostingGroup: string;
  ApprovedQuantity: number;
  IssuedQuantity: number;
  Approved: boolean;
  Issued: boolean;
  Include: boolean;
  RequestExclude: boolean;
  LineShortcutDimension1Code: string;
  LineShortcutDimension2Code: string;
  LineShortcutDimension3Code: string;
  LineShortcutDimension4Code: string;
  LineShortcutDimension5Code: string;
  LineShortcutDimension6Code: string;
  LineShortcutDimension7Code: string;
  LineShortcutDimension8Code: string;
}
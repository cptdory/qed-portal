import { bcClient } from "./client";

class PurchaseRequisitionService {
  async LoginAuth(
    EmailAddress: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_LoginAuth",
      {
        _EmailAddress: EmailAddress,
      }
    );
  }
  async VerifyOTP(
    EmailAddress: string,
    OTP: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_VerifyOTP",
      {
        _EmailAddress: EmailAddress,
        _OTP: OTP,
      }
    );
  }

  async CreateRequestHeader(
    RequestType: string,
    Description: string,
    CreatedBy: string,
    Dim1: string,
    Dim2: string,
    Dim3: string,
    Dim4: string,
    Dim5: string,
    Dim6: string,
    Dim7: string,
    Dim8: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_CreateRequestHeader",
      {
        _RequestType: RequestType,
        _Description: Description,
        _CreatedBy: CreatedBy,
        _Dim1: Dim1 ?? '',
        _Dim2: Dim2 ?? '',
        _Dim3: Dim3 ?? '',
        _Dim4: Dim4 ?? '',
        _Dim5: Dim5 ?? '',
        _Dim6: Dim6 ?? '',
        _Dim7: Dim7 ?? '',
        _Dim8: Dim8 ?? '',
      }
    );
  }

  async CreateRequestLine(
    RequestNo: string,
    Type: string,
    No: string,
    Quantity: string,
    WarehouseLocation: string,
    Dim1: string,
    Dim2: string,
    Dim3: string,
    Dim4: string,
    Dim5: string,
    Dim6: string,
    Dim7: string,
    Dim8: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_CreateRequestLine",
      {
        _RequestNo: RequestNo,
        _Type: Type,
        _No: No,
        _Quantity: Quantity,
        _WarehouseLocation: WarehouseLocation,
        _Dim1: Dim1 ?? '',
        _Dim2: Dim2 ?? '',
        _Dim3: Dim3 ?? '',
        _Dim4: Dim4 ?? '',
        _Dim5: Dim5 ?? '',
        _Dim6: Dim6 ?? '',
        _Dim7: Dim7 ?? '',
        _Dim8: Dim8 ?? '',
      }
    );
  }
  async UpdateRequestLine(
    RequestType: string,
    RequestNo: string,
    LineNo: string,
    No: string,
    Quantity: string,
    WarehouseLocation: string,
    Dim1: string,
    Dim2: string,
    Dim3: string,
    Dim4: string,
    Dim5: string,
    Dim6: string,
    Dim7: string,
    Dim8: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_UpdateRequestLine",
      {
        _RequestType: RequestType,
        _RequestNo: RequestNo,
        _LineNo: LineNo,
        _No: No,
        _Quantity: Quantity,
        _WarehouseLocation: WarehouseLocation,
        _Dim1: Dim1 ?? '',
        _Dim2: Dim2 ?? '',
        _Dim3: Dim3 ?? '',
        _Dim4: Dim4 ?? '',
        _Dim5: Dim5 ?? '',
        _Dim6: Dim6 ?? '',
        _Dim7: Dim7 ?? '',
        _Dim8: Dim8 ?? '',
      }
    );
  }

  async DeleteRequestLine(
    RequestType: string,
    RequestNo: string,
    LineNo: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_DeleteRequestLine",
      {
        _RequestType: RequestType,
        _RequestNo: RequestNo,
        _LineNo: LineNo,
      }
    );
  }

  async GetItems(
    RequestType: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetItems",
      {
        _RequestType: RequestType,
      }
    );
  }
  async UpdateRequestHeader(
    RequestNo: string,
    RequestType: string,
    Description: string,
    Dim1: string,
    Dim2: string,
    Dim3: string,
    Dim4: string,
    Dim5: string,
    Dim6: string,
    Dim7: string,
    Dim8: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_UpdateRequestHeader",
      {
        _RequestNo: RequestNo,
        _RequestType: RequestType,
        _Description: Description,
        _Dim1: Dim1 ?? '',
        _Dim2: Dim2 ?? '',
        _Dim3: Dim3 ?? '',
        _Dim4: Dim4 ?? '',
        _Dim5: Dim5 ?? '',
        _Dim6: Dim6 ?? '',
        _Dim7: Dim7 ?? '',
        _Dim8: Dim8 ?? '',
      }
    );
  }

  async GetRequestList(
    UserName: string,
     LocationCode: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetRequestList",
      {
        _UserName: UserName,
        _LocationCode: LocationCode
      }
    );
  }
  async GetRequest(
    RequestNo: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetRequest",
      {
        _RequestNo: RequestNo
      }
    );
  }
  async GetIssuance(
    IssuanceNo: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetIssuance",
      {
        _IssuanceNo: IssuanceNo
      }
    );
  }
  async UpdateIssuanceReceive(
    IssuanceNo: string,
    IssuanceLineNo: string,
    Quantity: string,
    RequestType: string,
    RequestNo: string,
    RequestLineNo: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_UpdateIssuanceReceive",
      {
        _IssuanceNo: IssuanceNo,
        _IssuanceLineNo: IssuanceLineNo,
        _Quantity: Quantity,
        _RequestType: RequestType,
        _RequestNo: RequestNo,
        _RequestLineNo: RequestLineNo,
      }
    );
  }

  async GetVisibleDimensions(
    VisibleIn: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetVisibleDimensions",
      {
        _VisibleIn: VisibleIn
      }
    );
  }
  async GetDimensionValues(
    DimensionCode: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetDimensionValues",
      {
        _DimensionCode: DimensionCode
      }
    );
  }
  async GetRequisitionTypes(
    IsSubRequest: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetRequisitionTypes",
      { _IsSubRequest: IsSubRequest }
    );
  }
  //item req

  async GetNewItemRequestList(
    CreatedBy: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetNewItemRequestList",
      { _CreatedBy: CreatedBy }
    );
  }
  async GetNewItemRequest(
    NewItemRequestNo: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetNewItemRequest",
      {
        _NewItemRequestNo: NewItemRequestNo
      }
    );
  }

    async SubmitNewItemRequest(
    No: string,
    NewItemRequestNo: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_SubmitNewItemRequest",
      {
        _No: No,
        _NewItemRequestNo: NewItemRequestNo
      }
    );
  }
  async CreateNewItemRequest(
    No: string,
    CreatedBy: string,
    Description: string,
    BaseUnitOfMeasure: string,
    ItemCategoryCode: string,
    PartNo: string,
    PictureBase64: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_CreateNewItemRequest",
      {
        _No: No,
        _CreatedBy: CreatedBy,
        _Description: Description,
        _BaseUnitOfMeasure: BaseUnitOfMeasure,
        _ItemCategoryCode: ItemCategoryCode,
        _PartNo: PartNo,
        _PictureBase64: PictureBase64,
      }
    );
  }
  async UpdateNewItemRequest(
    No: string,
    NewItemRequestNo: string,
    Description: string,
    BaseUnitOfMeasure: string,
    ItemCategoryCode: string,
    PartNo: string,
    PictureBase64: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_UpdateNewItemRequest",
      {
        _No: No,
        _NewItemRequestNo: NewItemRequestNo,
        _Description: Description,
        _BaseUnitOfMeasure: BaseUnitOfMeasure,
        _ItemCategoryCode: ItemCategoryCode,
        _PartNo: PartNo,
        _PictureBase64: PictureBase64,
      }
    );
  }

  async GetBaseUnitOfMeasure() {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetBaseUnitOfMeasure",
      {}
    );
  }
  async GetItemCategories() {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetItemCategories",
      {}
    );
  }

  async GetCommandList(
    RequestNo: string,
    SectionCode: string,
    CurrentUserName: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetCommandList",
      {
        _RequestNo: RequestNo,
        _SectionCode: SectionCode,
        _CurrentUserName: CurrentUserName
      }
    );
  }
  async ExecuteCommand(
    CodeunitId: string,
    RequestNo: string
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_ExecuteCommand",
      {
        _CodeunitId: CodeunitId,
        _RequestNo: RequestNo
      }
    );
  }
  async GetCurrentUserSectionCode(
    RequestType: string,
    CurrentUserName: string,
    StartingPoint: string,
  ) {
    return bcClient.post<{ value: string }>(
      "RequisitionAPI_GetCurrentUserSectionCode",
      {
        _RequestType: RequestType,
        _CurrentUserName: CurrentUserName,
        _StartingPoint: StartingPoint,
      }
    );
  }
}

export const purchaseRequisitionService = new PurchaseRequisitionService();
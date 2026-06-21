"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RequestItemsTable } from "./request-items-table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HandHelping } from "lucide-react";
import { DimensionType, DimensionValueType, RequestLineType, RequestType, RequisitionType } from "@/types/bc-types";
import { sileo } from "sileo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EDITABLE_STATUSES = ["Draft", "For Correction"];

function DimensionEditSelect({
  dim,
  value,
  editable,
  onChange,
}: {
  dim: DimensionType;
  value: string;
  editable: boolean;
  onChange: (key: string, value: string) => void;
}) {
  const key = `ShortcutDimension${dim.ShortcutDimensionNo}Code`;
  const [values, setValues] = useState<DimensionValueType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!editable) {
      setLoading(false);
      return;
    }
    const fetchValues = async () => {
      try {
        const res = await fetch("/api/get-dimension-values", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ DimensionCode: dim.DimensionCode }),
        });
        if (!res.ok) throw new Error("Failed to fetch dimension values");
        const data = await res.json();
        setValues(data.DimensionValues ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchValues();
  }, [dim.DimensionCode, editable]);

  if (!editable) {
    return (
      <div className="col-span-3 space-y-1">
        <Label className="text-xs font-medium text-slate-600">{dim.DimensionCode}</Label>
        <Input value={value} readOnly className="h-8 bg-slate-100 text-xs" />
      </div>
    );
  }

  return (
    <div className="col-span-3 space-y-1">
      <Label className="text-xs font-medium text-slate-600">{dim.DimensionCode}</Label>
      <select
        value={value}
        onChange={(e) => onChange(key, e.target.value)}
        disabled={loading}
        className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">{loading ? "Loading..." : `Select ${dim.DimensionCode}...`}</option>
        {values.map((v) => (
          <option key={v.Code} value={v.Code}>
            {v.Name}
          </option>
        ))}
      </select>
    </div>
  );
}

function DimensionsSection({
  values,
  editable,
  onChange,
}: {
  values: Record<string, string>;
  editable: boolean;
  onChange: (key: string, value: string) => void;
}) {
  const [dimensions, setDimensions] = useState<DimensionType[]>([]);

  useEffect(() => {
    const fetch$ = async () => {
      try {
        const res = await fetch("/api/get-visible-dimensions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _VisibleIn: "Header" }),
        });
        if (!res.ok) throw new Error("Failed to fetch visible dimensions");
        const data = await res.json();
        setDimensions(data.VisibleDimensions ?? []);
      } catch (error) {
        sileo.error({ title: "Failed to Load Dimensions — Could not load visible dimensions.", fill: "#171717" });
      }
    };
    fetch$();
  }, []);

  if (!dimensions.length) return null;

  return (
    <>
      {dimensions.map((dim) => {
        const key = `ShortcutDimension${dim.ShortcutDimensionNo}Code`;
        return (
          <DimensionEditSelect
            key={dim.ShortcutDimensionNo}
            dim={dim}
            value={values[key] ?? ""}
            editable={editable}
            onChange={onChange}
          />
        );
      })}
    </>
  );
}

export default function Page() {
  const { requestNo } = useParams<{ requestNo: string }>();
  const [request, setRequest] = useState<RequestType | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestTypeValue, setRequestTypeValue] = useState("");
  const [originalRequestType, setOriginalRequestType] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [dimensionValues, setDimensionValues] = useState<Record<string, string>>({
    ShortcutDimension1Code: "",
    ShortcutDimension2Code: "",
    ShortcutDimension3Code: "",
    ShortcutDimension4Code: "",
    ShortcutDimension5Code: "",
    ShortcutDimension6Code: "",
    ShortcutDimension7Code: "",
    ShortcutDimension8Code: "",
  });

  const [requisitionTypes, setRequisitionTypes] = useState<RequisitionType[]>([]);
  const [saving, setSaving] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [confirmReceiveOpen, setConfirmReceiveOpen] = useState(false);
  const [issuanceNo, setIssuanceNo] = useState("");
  const [issuanceData, setIssuanceData] = useState<any>(null);
  const [receivedQuantities, setReceivedQuantities] = useState<Record<string, string>>({});
  const [checkedLines, setCheckedLines] = useState<Set<string>>(new Set());
  const [loadingIssuance, setLoadingIssuance] = useState(false);
  const [confirmingReceive, setConfirmingReceive] = useState(false);

  const isEditable = !!request && EDITABLE_STATUSES.includes(request.RequestStatus ?? "");

  const fetchRequest = async () => {
    try {
      const res = await fetch("/api/get-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ RequestNo: decodeURIComponent(requestNo) }),
      });
      if (!res.ok) throw new Error("Failed to fetch request");
      const data = await res.json();
      const req: RequestType | null = data.Request ?? null;
      setRequest(req);

      if (req) {
        setRequestTypeValue(req.RequestType ?? "");
        setOriginalRequestType(req.RequestType ?? "");
        setDescriptionValue(req.Description ?? "");
        setDimensionValues({
          ShortcutDimension1Code: req.ShortcutDimension1Code ?? "",
          ShortcutDimension2Code: req.ShortcutDimension2Code ?? "",
          ShortcutDimension3Code: req.ShortcutDimension3Code ?? "",
          ShortcutDimension4Code: req.ShortcutDimension4Code ?? "",
          ShortcutDimension5Code: req.ShortcutDimension5Code ?? "",
          ShortcutDimension6Code: req.ShortcutDimension6Code ?? "",
          ShortcutDimension7Code: req.ShortcutDimension7Code ?? "",
          ShortcutDimension8Code: req.ShortcutDimension8Code ?? "",
        });
      }
    } catch (error) {
      sileo.error({ title: "Failed to Fetch Request — An error occurred while fetching the request.", fill: "#171717" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!requestNo) return;
    fetchRequest();
  }, [requestNo]);

  useEffect(() => {
    if (!isEditable) return;

    const fetchRequisitionTypes = async () => {
      try {
        const res = await fetch("/api/get-requisition-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ IsSubRequest: "false" }),
        });
        if (!res.ok) throw new Error("Failed to fetch requisition types");
        const data = await res.json();
        setRequisitionTypes(data.RequisitionTypes ?? []);
      } catch (err) {
        sileo.error({ title: "Failed to Load Requisition Types — Could not load available requisition types.", fill: "#171717" });
      }
    };

    fetchRequisitionTypes();
  }, [isEditable]);

  const handleDimensionChange = (key: string, value: string) => {
    setDimensionValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!request || !isEditable) return;

    const typeChanged = requestTypeValue !== originalRequestType;
    const existingLines = request.RequestLines ?? [];

    if (typeChanged && existingLines.length > 0) {
      const confirmed = window.confirm(
        "Changing the Request Type will delete all existing request lines for this request. Do you want to continue?"
      );
      if (!confirmed) return;
    }

    try {
      setSaving(true);
      setError(null);

      const res = await fetch("/api/update-request-header", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RequestNo: request.RequestNo,
          RequestType: requestTypeValue,
          Description: descriptionValue,
          Dim1: dimensionValues.ShortcutDimension1Code,
          Dim2: dimensionValues.ShortcutDimension2Code,
          Dim3: dimensionValues.ShortcutDimension3Code,
          Dim4: dimensionValues.ShortcutDimension4Code,
          Dim5: dimensionValues.ShortcutDimension5Code,
          Dim6: dimensionValues.ShortcutDimension6Code,
          Dim7: dimensionValues.ShortcutDimension7Code,
          Dim8: dimensionValues.ShortcutDimension8Code,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.error || "Failed to update request.";
        setError(message);
        sileo.error({ title: `Failed to Update Header — ${message}`, fill: "#171717" });
        return;
      }

      if (data?.Status !== "Successful") {
        const message = data?.Message ?? "Failed to update request.";
        setError(message);
        sileo.error({ title: `Failed to Update Header — ${message}`, fill: "#171717" });
        return;
      }

      if (typeChanged) {
        for (const line of existingLines) {
          try {
            await fetch("/api/delete-request-line", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                RequestType: originalRequestType,
                RequestNo: request.RequestNo,
                LineNo: line.LineNo,
              }),
            });
          } catch (lineErr) {
            sileo.error({ title: "Failed to Delete Line — Could not delete line during type change.", fill: "#171717" });
          }
        }
        sileo.success({
          title: existingLines.length > 0 ? "Request Header updated. All existing lines were removed due to the Request Type change." : "Request Header updated.",
          fill: "#171717",
        });
      } else {
        for (const line of existingLines) {
          try {
            await fetch("/api/update-request-line", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                RequestType: requestTypeValue,
                RequestNo: request.RequestNo,
                LineNo: line.LineNo,
                No: line.No,
                Quantity: line.Quantity,
                WarehouseLocation: request.WarehouseLocation,
                Dim1: dimensionValues.ShortcutDimension1Code,
                Dim2: dimensionValues.ShortcutDimension2Code,
                Dim3: dimensionValues.ShortcutDimension3Code,
                Dim4: dimensionValues.ShortcutDimension4Code,
                Dim5: dimensionValues.ShortcutDimension5Code,
                Dim6: dimensionValues.ShortcutDimension6Code,
                Dim7: dimensionValues.ShortcutDimension7Code,
                Dim8: dimensionValues.ShortcutDimension8Code,
              }),
            });
          } catch (lineErr) {
            sileo.error({ title: "Failed to Update Line — Could not sync dimensions to line.", fill: "#171717" });
          }
        }
        sileo.success({ title: "Request Header updated successfully.", fill: "#171717" });
      }

      await fetchRequest();
    } catch (err) {
      const message = "An unexpected error occurred.";
      setError(message);
      sileo.error({ title: `Failed to Update Header — ${message}`, fill: "#171717" });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!request || !isEditable) return;

    const confirmed = window.confirm(
      "Once submitted, this request can no longer be updated. Are you sure you want to submit it?"
    );
    if (!confirmed) return;

    try {
      setSubmittingRequest(true);
      setError(null);

      const res = await fetch("/api/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RequestNo: request.RequestNo,
          CreatedBy: request.RequestedBy,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.error || "Failed to submit request.";
        setError(message);
        sileo.error({ title: `Submit Failed — ${message}`, fill: "#171717" });
        return;
      }

      if (data?.Status !== "Successful") {
        const message = data?.Message ?? "Failed to submit request.";
        setError(message);
        sileo.error({ title: `Submit Failed — ${message}`, fill: "#171717" });
        return;
      }

      sileo.success({ title: "Request submitted successfully.", fill: "#171717" });
      await fetchRequest();
    } catch (err) {
      const message = "An unexpected error occurred.";
      setError(message);
      sileo.error({ title: `Submit Failed — ${message}`, fill: "#171717" });
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleReceiveRequestedItems = () => {
    setIssuanceNo("");
    setIssuanceData(null);
    setReceivedQuantities({});
    setCheckedLines(new Set());
    setReceiveOpen(true);
  };

  const handleLoadIssuance = async () => {
    
    if (!issuanceNo.trim()) {
      sileo.error({ title: "Please enter an issuance number.", fill: "#171717" });
      return;
    }

    try {
      setLoadingIssuance(true);

      const res = await fetch("/api/get-issuance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IssuanceNo: issuanceNo }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.Status !== "Successful") {
        const message = data?.Message || "Failed to load issuance.";
        sileo.error({ title: message, fill: "#171717" });
        return;
      }

      const issuance = data.Issuance;
      setIssuanceData(issuance);

      // Fetch fresh request data to ensure we have the latest lines
      const requestRes = await fetch("/api/get-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ RequestNo: request?.RequestNo }),
      });

      const requestData = await requestRes.json().catch(() => null);
      const requestLines = requestData?.Request?.RequestLines ?? [];

      // Compare issuance lines with request lines
      const newReceivedQuantities: Record<string, string> = {};
      const currentRequestType = issuance?.RequestType;
      const currentRequestNo = issuance?.RequestNo;

      if (issuance?.IssuanceLines) {
        for (const issuanceLine of issuance.IssuanceLines) {
          const matchingLine = requestLines.find(
            (l: any) =>
              l.LineNo === issuanceLine.RequestLineNo &&
              currentRequestType === issuanceLine.RequestType &&
              currentRequestNo === issuanceLine.RequestNo
          );

          if (matchingLine) {
            newReceivedQuantities[issuanceLine.RequestLineNo.toString()] = issuanceLine.Quantity?.toString() || "";
          }
        }
      }
      setReceivedQuantities(newReceivedQuantities);
      sileo.success({
        title: `Issuance loaded successfully. Found ${Object.keys(newReceivedQuantities).length} matching items.`,
        fill: "#171717",
      });
    } catch (err) {
      sileo.error({ title: "An unexpected error occurred while loading issuance.", fill: "#171717" });
    } finally {
      setLoadingIssuance(false);
    }
  };

  const handleConfirmReceive = async () => {
    if (checkedLines.size === 0) {
      sileo.error({ title: "Please select at least one item to receive.", fill: "#171717" });
      return;
    }

    // Validate that at least one checked line has qty > 0
    let hasValidQty = false;
    for (const key of checkedLines) {
      const receivedQty = receivedQuantities[key];
      if (receivedQty && parseFloat(receivedQty) > 0) {
        hasValidQty = true;
        break;
      }
    }

    if (!hasValidQty) {
      sileo.error({ title: "Please enter a received quantity greater than 0 for at least one item.", fill: "#171717" });
      return;
    }

    try {
      setConfirmingReceive(true);

      let successCount = 0;
      let failureCount = 0;

      for (const lineNo of checkedLines) {
        const receivedQty = receivedQuantities[lineNo];
        if (!receivedQty || parseFloat(receivedQty) === 0) continue;

        const requestLine = lines.find((l: any) => l.LineNo.toString() === lineNo);
        if (!requestLine) continue;

        // Find matching issuance line if issuance was loaded
        const issuanceLine = issuanceData?.IssuanceLines?.find(
          (il: any) => il.RequestLineNo === requestLine.LineNo
        );

        try {
          const res = await fetch("/api/update-issuance-receive", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              IssuanceNo: issuanceData?.IssuanceNo || "",
              IssuanceLineNo: issuanceLine?.IssuanceLineNo || "",
              Quantity: receivedQty,
              RequestType: request?.RequestType,
              RequestNo: request?.RequestNo,
              RequestLineNo: requestLine.LineNo,
            }),
          });

          const data = await res.json().catch(() => null);

          if (res.ok && data?.Status === "Successful") {
            successCount++;
          } else {
            failureCount++;
            sileo.error({ title: `Line Update Failed — ${data?.Message || "Could not update line."}`, fill: "#171717" });
          }
        } catch (err) {
          failureCount++;
          sileo.error({ title: "Line Update Error — An error occurred while updating the line.", fill: "#171717" });
        }
      }

      if (successCount > 0) {
        sileo.success({
          title: `Receipt confirmed. ${successCount} item(s) received${failureCount > 0 ? `, ${failureCount} failed` : ""}.`,
          fill: "#171717",
        });
        setConfirmReceiveOpen(false);
        setReceiveOpen(false);
      } else {
        sileo.error({ title: "Failed to confirm receipt. Please try again.", fill: "#171717" });
      }
    } catch (err) {
      sileo.error({ title: "An unexpected error occurred.", fill: "#171717" });
    } finally {
      setConfirmingReceive(false);
    }
  };

  const lines = request?.RequestLines ?? [];

  return (  
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader headerTitle="Request Detail" />
        <div className="flex flex-1 flex-col bg-slate-50">
          <div className="@container/main flex flex-1 flex-col">
            <div className="space-y-3 p-3 md:p-4 lg:p-5">

              <section className="rounded-md border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b px-4 py-2">
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900">General</h2>
                  {isEditable && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={handleSave} disabled={saving || submittingRequest}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSubmitRequest}
                        disabled={saving || submittingRequest}
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        {submittingRequest ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  )}
                  {request?.RequestStatus === "Approved" && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleReceiveRequestedItems}
                    >
                      <HandHelping className="h-3.5 w-3.5 mr-1.5" />
                      Receive Requested Items
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-12 gap-4 p-4">
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Request Type</Label>
                    {isEditable ? (
                      <select
                        value={requestTypeValue}
                        onChange={(e) => setRequestTypeValue(e.target.value)}
                        className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      >
                        <option value="">Select type...</option>
                        {requisitionTypes.map((rt) => (
                          <option key={rt.Code} value={rt.Code}>
                            {rt.Code}{rt.Description ? ` — ${rt.Description}` : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input value={loading ? "" : (request?.RequestType ?? "")} readOnly className="h-8 bg-slate-100 text-xs" />
                    )}
                  </div>

                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Request No.</Label>
                    <Input value={loading ? "" : (request?.RequestNo ?? "")} readOnly className="h-8 bg-slate-100 text-xs font-medium tracking-wide" />
                  </div>

                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Warehouse Location</Label>
                    <Input value={loading ? "" : (request?.WarehouseLocation ?? "")} readOnly className="h-8 bg-slate-100 text-xs" />
                  </div>

                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Created By</Label>
                    <Input value={loading ? "" : (request?.RequestedBy ?? "")} readOnly className="h-8 bg-slate-100 text-xs" />
                  </div>

                  <div className="col-span-12 space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Remarks</Label>
                    {isEditable ? (
                      <textarea
                        value={descriptionValue}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                        className="min-h-[72px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      />
                    ) : (
                      <textarea
                        value={loading ? "" : (request?.Description ?? "")}
                        readOnly
                        className="min-h-[72px] w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs text-slate-700"
                      />
                    )}
                  </div>

                  <DimensionsSection
                    values={dimensionValues}
                    editable={isEditable}
                    onChange={handleDimensionChange}
                  />
                </div>

                {error && (
                  <p className="px-4 pb-3 text-xs text-red-500">{error}</p>
                )}
              </section>

              <section className="rounded-md border bg-white shadow-sm">
                <div className="border-b px-4 py-2">
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900">Statuses</h2>
                </div>
                <div className="grid grid-cols-3 gap-3 p-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Request Status</Label>
                    <Input value={loading ? "" : (request?.RequestStatus ?? "")} readOnly className="h-8 text-xs bg-slate-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Warehouse Status</Label>
                    <Input value="" readOnly className="h-8 text-xs bg-slate-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-600">Purchase Status</Label>
                    <Input value="" readOnly className="h-8 text-xs bg-slate-50" />
                  </div>
                </div>
              </section>

              <section className="rounded-md border bg-white p-3 shadow-sm">
                <RequestItemsTable
                  lines={lines}
                  requestType={request?.RequestType ?? ""}
                  requestNo={request?.RequestNo ?? ""}
                  warehouseLocation={request?.WarehouseLocation ?? ""}
                  headerDimensionValues={dimensionValues}
                  editable={isEditable}
                  onLineCreated={fetchRequest}
                  onLineUpdated={fetchRequest}
                  onLineDeleted={fetchRequest}
                />
              </section>

              {/* RECEIVE ITEMS DIALOG */}
              <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
                <DialogContent className="!w-[98vw] !max-w-[1000px] p-5">
                  <DialogHeader>
                    <DialogTitle className="text-sm font-semibold">
                      Receive Requested Items
                    </DialogTitle>
                  </DialogHeader>

                  {/* TOP CONTROLS */}
                  <div className="flex items-end gap-2">
                    <div className="w-full space-y-1">
                      <Label className="text-xs font-medium text-slate-600">
                        Document Issuance No.
                      </Label>
                      <Input
                        placeholder="Enter document issuance no."
                        value={issuanceNo}
                        onChange={(e) => setIssuanceNo(e.target.value)}
                        disabled={loadingIssuance}
                        className="h-8 text-xs"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleLoadIssuance}
                      disabled={loadingIssuance}
                      className="h-8 px-4 text-xs"
                    >
                      {loadingIssuance ? "Loading..." : "Enter"}
                    </Button>
                  </div>

                  {/* INSTRUCTIONS */}
                  <div className="rounded-md border bg-slate-50 p-3 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      <p>
                        <span className="font-semibold">(Optional)</span> Enter the <span className="font-semibold">Document Issuance No.</span> to auto-load issued items and quantities. Or manually check items and enter received quantities.
                      </p>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                      <p>
                        Check items you want to receive and enter <span className="font-semibold">Received Quantity</span> for each. Green rows indicate matched issuance items.
                      </p>
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="overflow-hidden rounded-md border bg-white">
                    <table className="w-full border-collapse text-xs">
                      <thead className="bg-slate-50">
                        <tr className="border-b">
                          <th className="w-10 px-3 py-2 text-center" />
                          <th className="px-3 py-2 text-left font-medium text-slate-600">Line No</th>
                          <th className="px-3 py-2 text-left font-medium text-slate-600">No.</th>
                          <th className="px-3 py-2 text-left font-medium text-slate-600">Description</th>
                          <th className="px-3 py-2 text-center font-medium text-slate-600">UOM</th>
                          <th className="px-3 py-2 text-right font-medium text-slate-600">Requested Qty</th>
                          <th className="px-3 py-2 text-right font-medium text-slate-600">Received Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lines.length > 0 ? (
                          lines.map((line) => {
                            const issuanceLine = issuanceData?.IssuanceLines?.find(
                              (il: any) =>
                                il.RequestLineNo === line.LineNo &&
                                il.RequestType === request?.RequestType &&
                                il.RequestNo === request?.RequestNo
                            );
                            const key = line.LineNo.toString();
                            return (
                              <tr
                                key={line.LineNo}
                                className={`border-b last:border-0 hover:bg-slate-50 ${
                                  issuanceLine ? "bg-green-50" : ""
                                }`}
                              >
                                <td className="px-3 py-3 text-center">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={checkedLines.has(key)}
                                      onCheckedChange={(checked) => {
                                        setCheckedLines((prev) => {
                                          const newSet = new Set(prev);
                                          if (checked) {
                                            newSet.add(key);
                                          } else {
                                            newSet.delete(key);
                                          }
                                          return newSet;
                                        });
                                      }}
                                      className="h-5 w-5 border-2 border-slate-500 shadow-sm hover:border-blue-500 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                    />
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-slate-700">{line.LineNo}</td>
                                <td className="px-3 py-3 font-medium text-blue-600">{line.No}</td>
                                <td className="px-3 py-3 text-slate-600">{line.Description}</td>
                                <td className="px-3 py-3 text-center">{line.UnitOfMeasure}</td>
                                <td className="px-3 py-3 text-right font-medium">{line.Quantity}</td>
                                <td className="px-3 py-3 text-right">
                                  <Input
                                    value={receivedQuantities[key] || ""}
                                    onChange={(e) => {
                                      if (key) {
                                        setReceivedQuantities((prev) => ({
                                          ...prev,
                                          [key]: e.target.value,
                                        }));
                                      }
                                    }}
                                    className="h-8 w-24 text-right text-xs ml-auto"
                                    placeholder="0"
                                  />
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                              No items found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setReceiveOpen(false)}
                      disabled={loadingIssuance || confirmingReceive}
                      className="h-8 text-xs"
                    >
                      Cancel
                    </Button>
                    <div className="flex items-center gap-2">
                      {checkedLines.size > 0 && (
                        <span className="text-xs text-slate-600">
                          {checkedLines.size} item(s) selected
                        </span>
                      )}
                      <Button
                        className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => setConfirmReceiveOpen(true)}
                        disabled={loadingIssuance || confirmingReceive || checkedLines.size === 0}
                      >
                        Confirm Receive
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* CONFIRM RECEIVE DIALOG */}
              <Dialog open={confirmReceiveOpen} onOpenChange={setConfirmReceiveOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Receipt</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-slate-600 space-y-2">
                    <p>Are you sure you want to confirm receiving these items?</p>
                    <p className="text-xs text-amber-600">
                      You can still go back if you need to adjust quantities.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => setConfirmReceiveOpen(false)}
                    >
                      Go Back
                    </Button>
                    <Button
                      className="h-8 text-xs"
                      onClick={handleConfirmReceive}
                      disabled={confirmingReceive}
                    >
                      {confirmingReceive ? "Confirming..." : "Yes, Confirm"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
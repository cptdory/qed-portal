"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RequestItemsTable } from "./request-items-table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DimensionType, DimensionValueType, RequestType, RequisitionType } from "@/types/bc-types";
import { sileo } from "sileo";
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
        console.error("Error fetching visible dimensions:", error);
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
      console.error("Error fetching request:", error);
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
        console.error(err);
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
    const existingLines = request.Lines ?? [];

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
        sileo.error({ title: "Failed to Update Header", description: message, fill: "#171717" });
        return;
      }

      if (data?.Status !== "Successful") {
        const message = data?.Message ?? "Failed to update request.";
        setError(message);
        sileo.error({ title: "Failed to Update Header", description: message, fill: "#171717" });
        return;
      }

      if (typeChanged) {
        // Request Type changed — delete all existing lines (no longer valid against new type)
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
            console.error("Failed to delete line during type change:", lineErr);
          }
        }
        sileo.success({
          title: "Request Header updated.",
          description: existingLines.length > 0 ? "All existing lines were removed due to the Request Type change." : undefined,
          fill: "#171717",
        });
      } else {
        // Request Type unchanged — propagate updated dimensions / warehouse location to existing lines
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
            console.error("Failed to sync dimensions to line:", lineErr);
          }
        }
        sileo.success({ title: "Request Header updated successfully.", fill: "#171717" });
      }

      await fetchRequest();
    } catch (err) {
      console.error(err);
      const message = "An unexpected error occurred.";
      setError(message);
      sileo.error({ title: "Failed to Update Header", description: message, fill: "#171717" });
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
        sileo.error({ title: "Submit Failed", description: message, fill: "#171717" });
        return;
      }

      if (data?.Status !== "Successful") {
        const message = data?.Message ?? "Failed to submit request.";
        setError(message);
        sileo.error({ title: "Submit Failed", description: message, fill: "#171717" });
        return;
      }

      sileo.success({ title: "Request submitted successfully.", fill: "#171717" });
      await fetchRequest();
    } catch (err) {
      console.error(err);
      const message = "An unexpected error occurred.";
      setError(message);
      sileo.error({ title: "Submit Failed", description: message, fill: "#171717" });
    } finally {
      setSubmittingRequest(false);
    }
  };

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
                  lines={request?.Lines ?? []}
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

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
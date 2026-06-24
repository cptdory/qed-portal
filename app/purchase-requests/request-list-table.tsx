"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  BadgeCheck,
  Clock3,
  Eye,
  FileEdit,
  XCircle,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RequestType, DimensionType, SessionUser} from "@/types/bc-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface RequestList {
  requestType: string;
  requestNo: string;
  description: string;
  status: string;
  sectionCode: string;
  requestedBy: string;
  dateRequested: string;
  ShortcutDimension1Code: string;
  ShortcutDimension2Code: string;
  ShortcutDimension3Code: string;
  ShortcutDimension4Code: string;
  ShortcutDimension5Code: string;
  ShortcutDimension6Code: string;
  ShortcutDimension7Code: string;
  ShortcutDimension8Code: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          <BadgeCheck className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      );
    case "Entered":
      return (
        <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
          <BadgeCheck className="mr-1 h-3 w-3" />
          Entered
        </Badge>
      );
    case "Pending Approval":
      return (
        <Badge className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50">
          <Clock3 className="mr-1 h-3 w-3" />
          Pending Approval
        </Badge>
      );
    case "Rejected":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50"
        >
          <FileEdit className="mr-1 h-3 w-3" />
          Draft
        </Badge>
      );
  }
};

const baseColumns: ColumnDef<RequestList>[] = [
  {
    accessorKey: "requestNo",
    header: "Request No.",
    cell: ({ row }) => (
      <div>
        <p className="text-xs font-semibold text-blue-600">{row.getValue("requestNo")}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{row.original.dateRequested}</p>
      </div>
    ),
  },
  {
    accessorKey: "requestType",
    header: "Request Type",
    cell: ({ row }) => (
      <div>
        <p className="text-xs font-medium text-slate-800">{row.getValue("requestType")}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{row.original.sectionCode}</p>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[320px]">
        <p className="truncate text-xs text-slate-700">{row.getValue("description")}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Requested by {row.original.requestedBy || "-"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status") as string),
  },
];

function ActionsCell({ row, onView }: { row: Row<RequestList>; onView: (requestNo: string) => void }) {
  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 hover:text-slate-900"
        onClick={() => onView(row.original.requestNo)}
      >
        <Eye className="mr-1 h-4 w-4" />
        View
      </Button>
    </div>
  );
}

export function RequestListTable() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null)
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [visibleDimensions, setVisibleDimensions] = useState<DimensionType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleView = (requestNo: string) => {
    router.push(`/purchase-requests/${encodeURIComponent(requestNo)}`);
  };
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) return
        const data = await res.json()
        setUser(data?.user ?? null)
      } catch (err) {
        console.error("Failed to fetch current user:", err)
      }
    }
    fetchMe()
  }, [])


  const fetchVisibleDimensions = async () => {
    try {
      const res = await fetch("/api/get-visible-dimensions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _VisibleIn: "Header" }),
      });
      if (!res.ok) throw new Error("Failed to fetch visible dimensions");
      const data = await res.json();
      setVisibleDimensions(data.VisibleDimensions ?? []);
    } catch (error) {
      console.error("Error fetching visible dimensions:", error);
    }
  };

  const fetchRequestList = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/get-request-list-by-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserName: user?.UserId }),
      });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data.Requests ?? []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchVisibleDimensions();
    fetchRequestList();
  }, [user]);

  const dynamicDimensionColumns = useMemo((): ColumnDef<RequestList>[] => {
    return visibleDimensions.map((dim) => ({
      accessorKey: `ShortcutDimension${dim.ShortcutDimensionNo}Code` as keyof RequestList,
      header: dim.DimensionCode,
      cell: ({ row }: { row: Row<RequestList> }) => (
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
          {(row.getValue(`ShortcutDimension${dim.ShortcutDimensionNo}Code`) as string) || "-"}
        </Badge>
      ),
    }));
  }, [visibleDimensions]);

  const actionsColumn: ColumnDef<RequestList> = useMemo(() => ({
    id: "actions",
    header: () => <div className="text-right" />,
    cell: ({ row }) => <ActionsCell row={row} onView={handleView} />,
  }), []);

  const allColumns = useMemo((): ColumnDef<RequestList>[] => {
    return [...baseColumns, ...dynamicDimensionColumns, actionsColumn];
  }, [dynamicDimensionColumns, actionsColumn]);

  const tableData: RequestList[] = useMemo(
    () =>
      requests.map((item) => ({
        requestType: item.RequestType,
        requestNo: item.RequestNo,
        description: item.Description,
        status: item.RequestStatus,
        sectionCode: item.SectionCode,
        requestedBy: item.RequestedBy,
        dateRequested: "",
        ShortcutDimension1Code: item.ShortcutDimension1Code ?? "",
        ShortcutDimension2Code: item.ShortcutDimension2Code ?? "",
        ShortcutDimension3Code: item.ShortcutDimension3Code ?? "",
        ShortcutDimension4Code: item.ShortcutDimension4Code ?? "",
        ShortcutDimension5Code: item.ShortcutDimension5Code ?? "",
        ShortcutDimension6Code: item.ShortcutDimension6Code ?? "",
        ShortcutDimension7Code: item.ShortcutDimension7Code ?? "",
        ShortcutDimension8Code: item.ShortcutDimension8Code ?? "",
      })),
    [requests]
  );

  const table = useReactTable({
    data: tableData,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-xs text-slate-500">View purchase requests</p>

        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-slate-50 hover:bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`h-11 px-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500 ${
                      header.column.id === "actions" ? "text-right" : "text-left"
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-24 text-center text-sm text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={allColumns.length} className="h-24 text-center text-sm text-slate-500">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
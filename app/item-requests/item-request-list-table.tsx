"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  BadgeCheck,
  Clock3,
  Eye,
  FileEdit,
  ImageIcon,
  PackageSearch,
  XCircle,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
export interface ItemRequestList {
  requestNo: string
  newItemRequestNo: string
  description: string
  itemCategory: string
  picture?: string
  status: string
  requestedBy: string
  partNo: string
  baseUnitOfMeasure: string
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
          <BadgeCheck className="mr-1 h-3 w-3" /> Approved
        </Badge>
      )
    case "Pending Approval":
      return (
        <Badge className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50">
          <Clock3 className="mr-1 h-3 w-3" /> Pending Approval
        </Badge>
      )
    case "Rejected":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
          <XCircle className="mr-1 h-3 w-3" /> Rejected
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50">
          <FileEdit className="mr-1 h-3 w-3" /> Draft
        </Badge>
      )
  }
}

const columns: ColumnDef<ItemRequestList>[] = [
  {
    accessorKey: "requestNo",
    header: "Item Request No.",
    cell: ({ row }) => (
      <div>
        <p className="text-xs font-semibold text-blue-600">
          {row.getValue("requestNo")}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {row.original.newItemRequestNo}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "picture",
    header: "Image",
    cell: ({ row }) => {
      const picture = row.original.picture
      return (
        <div className="flex items-center justify-center">
          {picture ? (
            <Image
              src={picture}
              alt="Item"
              width={44}
              height={44}
              className="h-11 w-11 rounded-md border object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50">
              <ImageIcon className="h-4 w-4 text-slate-400" />
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[360px]">
        <p className="line-clamp-2 text-xs text-slate-700">
          {row.getValue("description")}
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          Requested by {row.original.requestedBy}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "itemCategory",
    header: "Item Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
        <PackageSearch className="mr-1 h-3 w-3" />
        {row.getValue("itemCategory") || "-"}
      </Badge>
    ),
  },
  {
    accessorKey: "partNo",
    header: "Part No.",
    cell: ({ row }) => (
      <p className="text-xs text-slate-700">{row.getValue("partNo") || "-"}</p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status") as string),
  },
{
  id: "actions",
  header: "",
  cell: ({ row }) => {
    const router = useRouter()
    return (
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => router.push(`/item-requests/${encodeURIComponent(row.original.newItemRequestNo)}`)}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      </div>
    )
  },
},
]

export function ItemRequestListTable() {
  const [userId, setUserId] = useState<string | null>(null)
  const [data, setData] = useState<ItemRequestList[]>([])
  const [loading, setLoading] = useState(false)

  // Step 1: Fetch user
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me")
        if (!res.ok) return
        const json = await res.json()
        const id = json?.user?.UserId ?? null
        setUserId(id)
      } catch (err) {
        console.error("Failed to fetch current user:", err)
      }
    }
    fetchMe()
  }, [])

  // Step 2: Fetch item requests after userId is set
  useEffect(() => {
    if (!userId) return

    const fetchItemRequests = async () => {
      try {
        setLoading(true)

        const res = await fetch("/api/get-new-item-request-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ CreatedBy: userId }),
        })

        const result = await res.json()

        if (result?.Status !== "Successful") return

        const mapped: ItemRequestList[] = (result.Items ?? []).map((item: any) => ({
          requestNo: item.No,
          newItemRequestNo: item.NewItemRequestNo,
          description: item.Description,
          itemCategory: item.ItemCategoryCode,
          partNo: item.PartNo,
          baseUnitOfMeasure: item.BaseUnitOfMeasure,
          status: item.ItemRequestStatus,
          requestedBy: item.CreatedBy,
          picture: item.Picture
            ? `data:image/png;base64,${item.Picture}`
            : undefined,
        }))

        setData(mapped)
      } catch (error) {
        console.error("Error fetching item requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItemRequests()
  }, [userId])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
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
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 text-center align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-slate-500">
                  No item requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
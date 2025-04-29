import React, { useState } from "react";

import { CustomTooltip } from "@/app/_components/CustomTooltip";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Skeleton } from "../skeleton";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  rowCount: number;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  isPending: boolean;
  meta?: { [key: string]: number };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  rowCount,
  sorting,
  setSorting,
  isPending,
  ...props
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    rowCount,
    manualPagination: true,
  });

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <div className="scrollbar-hide relative h-[750px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="z-1 sticky top-0 bg-gray-100">
              <tr>
                {table.getHeaderGroups().map((headerGroup) => (
                  <React.Fragment key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={cn(
                          "h-12 bg-[hsl(191,8%,95%)] px-4 py-3 text-sm font-semibold text-text",
                          header.column.columnDef.meta?.classNameHeader
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="text-text">
              {isPending ? (
                Array.from({
                  length: table.getState().pagination.pageSize,
                }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn(
                          "px-2 py-3 text-sm",
                          cell.meta?.className
                        )}
                      >
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={index % 2 !== 0 ? "bg-background" : ""}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isStageColumn = cell.column.id === "stage";

                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            "px-4 py-3 text-sm",
                            isStageColumn ? "max-w-[175px] truncate" : "",
                            cell.column.columnDef.meta?.className
                          )}
                        >
                          {isStageColumn ? (
                            <CustomTooltip
                              dark
                              cursor="cursor-text"
                              align="start"
                              alignOffset={-30}
                              trigger={flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                              content={flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            />
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-text"
                  >
                    Sem resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </>
  );
}

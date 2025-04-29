"use client";

import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/app/_components/ui/skeleton";
import { CustomDataTablePagination } from "./components/CustomDataTablePagination";

interface CustomDataTableProps {
  columns: any;
  data: any;
  hasPagination?: boolean;
  pagination?: any;
  setPagination?: (pagination: any) => void;
  rowCount?: number;
  selectedRows?: string[];
  selectAll?: boolean;
  setSelectAll?: (value: boolean) => void;
  totalRows?: number;
  setSelectRows?: (rows: any) => void;
  className: any;
  isLoading?: boolean;
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
}

export function CustomDataTable({
  columns,
  data,
  hasPagination,
  pagination,
  setPagination,
  rowCount,
  selectedRows,
  setSelectRows,
  selectAll,
  setSelectAll,
  totalRows,
  className,
  isLoading,
  sorting,
  setSorting,
}: CustomDataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    initialState: { sorting: [] },
    manualSorting: true,
    getRowId: (row: any) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    rowCount,
  });

  useEffect(() => {
    if (setSelectRows) {
      const selectedIds = Object.keys(rowSelection);
      setSelectRows(selectedIds);
    }
    if (sorting && setSelectAll) {
      setSelectAll(false);
    }
  }, [rowSelection, sorting, setSelectRows, setSelectAll]);

  const handleSelectAll = () => {
    if (setSelectAll) {
      setSelectAll(!selectAll);
    }
  };

  return (
    <div className="w-full rounded-lg">
      <div className={cn("rounded-lg", className)}>
        {selectedRows && selectedRows.length > 0 && (
          <div className="flex h-12 items-center gap-4 bg-primary/25 px-5">
            <p className="text-sm font-medium text-gray-800">
              {selectAll ? totalRows : selectedRows.length} itens selecionados
            </p>
            <span
              onClick={handleSelectAll}
              className="cursor-pointer rounded-sm px-2 py-1 text-sm font-medium text-primary-400 hover:bg-primary-500/5"
            >
              {selectAll
                ? "Selecionar apenas essa página"
                : "Selecionar todos os itens"}
            </span>
          </div>
        )}
        <Table>
          <TableHeader>
            {isLoading || !columns ? (
              <TableRow>
                {Array(table.getHeaderGroups()[0].headers.length || 5)
                  .fill(0)
                  .map((header, index) => (
                    <TableHead
                      key={index}
                      className="h-3 bg-[hsl(191,8%,95%)] px-4 py-[13.5px] first:rounded-ss-lg last:rounded-se-lg"
                    >
                      <Skeleton className="h-6 w-full bg-gray-200" />
                    </TableHead>
                  ))}
              </TableRow>
            ) : (
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "h-3 bg-[hsl(191,8%,95%)] px-4 py-[13.5px] text-sm font-semibold text-text first:rounded-ss-lg last:rounded-se-lg",
                          header.column.columnDef.meta?.classNameHeader
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableHeader>
          <TableBody className="text-text">
            {isLoading || !data ? (
              Array(5)
                .fill(0)
                .map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array(table.getHeaderGroups()[0].headers.length || 5)
                      .fill(0)
                      .map((cell, index) => (
                        <TableCell key={index} className="px-4 py-3">
                          <Skeleton className="h-6 w-full bg-gray-200" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(index % 2 !== 0 ? "bg-background" : "")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-4 py-3 text-sm",
                          cell.column.columnDef.meta?.className
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-text"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hasPagination &&
        CustomDataTablePagination(
          <CustomDataTablePagination table={table} isLoading={isLoading} />
        )}
    </div>
  );
}

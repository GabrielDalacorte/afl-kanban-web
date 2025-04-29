import { Skeleton } from "@/app/_components/ui/skeleton";
import {
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "@phosphor-icons/react";

import { Button } from "@/app/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

export function CustomDataTablePagination({ table, isLoading }: any) {
  const pagination = table?.options?.state?.pagination;
  const pageIndex = pagination?.pageIndex ?? 0;
  const pageSize = pagination?.pageSize ?? 0;
  const firstItemOnPage = pageIndex * pageSize + 1;
  const lastItemOnPage = Math.min(
    (pageIndex + 1) * pageSize,
    table?.options?.rowCount ?? 0
  );

  return (
    <div className="flex items-center justify-end p-4">
      {isLoading || !table ? (
        <Skeleton className="h-6 w-64 bg-slate-200" />
      ) : (
        <div className="flex items-center space-x-4 text-text">
          <div className="flex items-center space-x-0.5">
            <p className="text-sm font-medium">Itens por página</p>
            <Select
              value={`${table.getState().pagination?.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] border-0 bg-transparent">
                <SelectValue
                  placeholder={table.getState().pagination?.pageSize}
                />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center text-sm font-medium">
            {firstItemOnPage} - {lastItemOnPage} de{" "}
            {table.options.rowCount ?? 0}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="text-brand-tertiary flex h-5 w-5 bg-transparent p-0 hover:bg-white disabled:bg-transparent disabled:text-text"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <CaretDoubleLeft className="h-5 w-5" />
            </Button>
            <Button
              className="text-brand-tertiary flex h-5 w-5 bg-transparent p-0 hover:bg-white disabled:bg-transparent disabled:text-text"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <CaretLeft className="h-5 w-5" />
            </Button>
            <Button
              className="text-brand-tertiary flex h-5 w-5 bg-transparent p-0 hover:bg-white disabled:bg-transparent disabled:text-text"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <CaretRight className="h-5 w-5" />
            </Button>
            <Button
              className="text-brand-tertiary flex h-5 w-5 bg-transparent p-0 hover:bg-white disabled:bg-transparent disabled:text-text"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <CaretDoubleRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

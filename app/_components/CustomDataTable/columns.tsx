/* eslint-disable camelcase */

import { DataTableColumnHeader } from "@/app/_components/ui/data-table";
import { Eye } from "@phosphor-icons/react";
import type { Row } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";

type DataType = {
  id: string;
  razao_social: string;
  createdat: string;
  cnpj: string;
  group_name: string;
  name: string;
};

type ColumnsProps = {
  handleOpenKanBan: (company: DataType) => void;
};

export const columns = ({
  handleOpenKanBan,
}: ColumnsProps): ColumnDef<DataType>[] => {
  const basicColumns: ColumnDef<DataType>[] = [
    {
      id: "razao_social",
      accessorKey: "razao_social",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Empresa" />
      ),
      cell: ({ row }: { row: Row<DataType> }) => {
        const { razao_social } = row.original;

        return (
          <p className="w-56 truncate" title={razao_social}>
            {razao_social}
          </p>
        );
      },
    },
    {
      id: "group_name",
      accessorKey: "group_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Grupo" />
      ),
      cell: ({ row }: { row: Row<DataType> }) => {
        const { group_name: groupName } = row.original;
        if (!groupName) {
          return <p className="w-32 truncate">-</p>;
        }
        return (
          <p className="w-32 truncate" title={groupName}>
            {groupName}
          </p>
        );
      },
    },
    {
      id: "cnpj",
      accessorKey: "cnpj",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CNPJ" />
      ),
    },
    {
      accessorKey: "createdat",
      id: "createdat",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de criação" />
      ),
      cell: ({ row }: { row: Row<DataType> }) => {
        const { createdat } = row.original;
        if (!createdat) {
          return "-";
        }
        return format(parseISO(createdat), "dd/MM/yyyy");
      },
    },
  ];

  basicColumns.push({
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const company = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <button
            className="border-none bg-transparent"
            title="Ver detalhes"
            onClick={() => handleOpenKanBan(company)}
          >
            <Eye className="h-6 w-6 text-text" />
          </button>
        </div>
      );
    },
  });

  return basicColumns;
};

"use client";

import StaffModal from "@/components/staffs/staffModal";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

type Email = {
  id: string;
  email: string;
};
export const columnsStaff: ColumnDef<Email[]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email nhân viên",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      //@ts-ignore
      return <StaffModal staff={row.original} />;
    },
  },
];

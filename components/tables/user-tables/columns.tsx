"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Task } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, AlertTriangle, ArrowUpDown, ChevronUp, ChevronUpCircle, Circle, Minus, MinusCircle, MoreHorizontal, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "taskId",
    header: "TaskID",
    cell: ({ row }) => {
      const taskId = row.original.taskId;
      const status = row.original.status;

      return (
        <>
          <div>
            <Badge
              variant="outline"
              className="mt-0.5 w-full font-mono font-normal"
            >
              {taskId}
            </Badge>{" "}
          </div>
          <div>
            {" "}
            <Badge variant="outline" className="mt-0.5 w-full">
              {status.toLowerCase()}
            </Badge>{" "}
          </div>
        </>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description;
      const category = row.original.category;
      const tags = row.original.tags;

      return (
        <HoverCard>
          <HoverCardTrigger>
            <div className="text-left">
              <Badge variant="outline" className="m-0.5">
                {category}
              </Badge>{" "}
              {description}
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="text-left font-medium p-0">
              {tags &&
                tags.map((tag) => (
                  <>
                    <Badge  className="m-0.5">
                      {tag}
                    </Badge>
                  </>
                ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  cell: ({ row }) => {
    const priority = row.original.priority?.toLowerCase();

    const category = row.original.category;
    const tags = row.original.tags;

    let icon;
    if (priority === "high" || priority === "urgent") {
      icon = <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />;
    } else if (priority === "low") {
      icon = <Minus className="h-4 w-4 mr-2 mt-0.5" />;
    } else {
      icon = <Circle className="h-4 w-4 mr-2 mt-0.5" />;
    }

    return (
      <div className="flex font-light">
        {icon}
        {priority}
      </div>
    );
  },
},
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

"use client";

import {
  ColumnDef,
  SortingState,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { useEffect, useState } from "react";
import { ArrowUpDown, Expand, Minimize, MoreHorizontal, Shrink } from "lucide-react";
import { Badge } from "./badge";
import { Task } from "@/constants/data";
import { Card, CardContent } from "./card";

interface DataTableProps<TValue> {
  columns: ColumnDef<Task, TValue>[];
  data: Task[];
  searchKey: string;
}

export function DataTable<TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  // Assuming `data` is your original data array
  const [filteredData, setFilteredData] = useState(data);
  const [tagSelected, setTagSelected] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [toggleTags, setToggleTags] = useState(false);

  const filterByTag = (tag: any) => {
    if (tag === selectedTag) {
      // If the selected tag is already being filtered, remove the filter
      setSelectedTag(null);
      setTagSelected(false);
    } else {
      // Otherwise, apply the filter
      const newData = data.filter(
        (item) => item.tags && item.tags.includes(tag),
      );
      setFilteredData(newData);
      setSelectedTag(tag);
      setTagSelected(true);
    }
  };

  const table = useReactTable({
    data: tagSelected ? filteredData : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="flex">
        <Input
          placeholder={`Search ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />
        <div className="ml-4">
          <Card className="flex rounded-sm">
            <CardContent
              className={`flex p-0 h-9 pl-2 ${
                tagSelected || toggleTags ? "h-auto" : ""
              }`}
              style={{ overflow: "hidden" }}
            >
              <div
                className={` ${
                    tagSelected || toggleTags ? "py-1 pb-2 transition-all duration-100" : ""
                  }`}
              >
                {data &&
                  data
                    .flatMap((item) => (item as any).tags || [])
                    .filter(
                      (tag, index, self) =>
                        tag && tag.trim() !== "" && self.indexOf(tag) === index,
                    ) // remove duplicates and empty tags
                    .map((tag, index) => (
                      <Badge
                        variant={tag === selectedTag ? "default" : "outline"}
                        className={`m-0 mx-0.5 p-0 px-1 ${
                          tag === selectedTag ? "active" : ""
                        }`}
                        key={index}
                        onClick={() => filterByTag(tag)}
                      >
                        <span className="text-blue-400">#</span>
                        {tag.toLowerCase()}
                      </Badge>
                    ))}
              </div>
                <Button
                  variant="outline"
                  className="ml-2 px-2 rounded-sm"
                  onClick={() => setToggleTags(!toggleTags)}
                >
                  {toggleTags || tagSelected ? (
                    <Minimize className="h-5" />
                  ) : (
                    <Expand className="h-5" />
                  )}
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <ScrollArea className="rounded-md border h-[50vh]">
        <Table className="relative text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

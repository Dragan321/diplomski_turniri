"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import { useState } from "react"
import { Button } from "./ui/button"
import { siteConfig } from "@/config/site"
import { useRouter } from "next/navigation"
import { useToast } from "./ui/use-toast"
import { useQueryClient } from '@tanstack/react-query'


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    token: string,
    idTurnira: number
}

export function DataTable<TData, TValue>({
    columns,
    data,
    token,
    idTurnira
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,

        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })
    const { toast } = useToast()
    const router = useRouter()
    const queryClient = useQueryClient()



    async function dodajTimove() {
        const idTimova: number[] = table.getSelectedRowModel().flatRows.map(row => row.original.idTima)
        const brSelektovanihRedova: number = table.getSelectedRowModel().rows.length

        if (brSelektovanihRedova > 2 && isPowerOfTwo(brSelektovanihRedova)) {
            await putTurnir(idTurnira, idTimova, token, "U toku")
            toast({
                title: "Uspjesno ste dodali timove u turnir!!!",
                description: "",
            })
            queryClient.invalidateQueries(["turnir"])//TODO: moze ovo use ueMutation i ovde i na

        }
        else
            toast({
                variant: "destructive",
                title: "Greska",
                description: "Turnir mora sadrzavati 2,4,8 ili 16 timova",
            })


    }



    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Unesite naziv tima..."
                    value={(table.getColumn("nazivTima")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("nazivTima")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Button onClick={dodajTimove} className="ml-auto">Dodajte timove</Button>
            </div>
            <div className="rounded-md border">
                <Table>
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
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                    onClick={() => row.toggleSelected()}
                                    className="hover:cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>


            </div>
        </div>
    )
}



async function putTurnir(id: number, listaTimova: number[], token: string, status: string | null | undefined) {
    let url_ = siteConfig.apiUrl + "/api/Turniri/{id}?";
    if (id === undefined || id === null)
        throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    if (status !== undefined && status !== null)
        url_ += "status=" + encodeURIComponent("" + status) + "&";
    url_ = url_.replace(/[?&]$/, "");
    const content_ = JSON.stringify(listaTimova);
    console.log(content_)
    let options_: RequestInit = {
        body: content_,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/octet-stream",
            "Authorization": `bearer ${token}`

        }
    };

    const response = await fetch(url_, options_)
    if (!response.ok)
        throw new Error("Doslo je do grreske molimo va pokusajte posle!!!")
}

function isPowerOfTwo(n: number): boolean {
    if (n == 0)
        return false;

    return parseInt((Math.ceil((Math.log(n) / Math.log(2))))) == parseInt((Math.floor(((Math.log(n) / Math.log(2))))));
}
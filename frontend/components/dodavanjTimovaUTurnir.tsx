"use client"

import { TimoviResponse } from '@/app/timovi/page'
import { siteConfig } from '@/config/site'
import { useQuery } from '@tanstack/react-query'

import {
    ColumnDef
} from "@tanstack/react-table"


import { DataTable } from './data-table'
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from './ui/button'
import { Checkbox } from "@/components/ui/checkbox"

interface Props {
    token: string,
    idTurnira: number
}

export function DodavanjTimovaUTurnir(props: Props) {
    const { data } = useQuery({ queryKey: ['svitimovi'], queryFn: getTimove })

    if (data)
        return (

            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} token={props.token} idTurnira={props.idTurnira} />
            </div>

        )
}


const columns: ColumnDef<TimoviResponse>[] = [

    {
        id: "select",
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
        accessorKey: "nazivTima",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Naziv tima
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    }
]


async function getTimove(): Promise<TimoviResponse[]> {

    let url_ = siteConfig.apiUrl + "/api/Timovi?";
    let options_: RequestInit = {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    };
    url_ += "searchTerm=" + encodeURIComponent("") + "&";
    url_ += "pageSize=" + encodeURIComponent("" + 99999999) + "&";
    url_ += "cursor=" + encodeURIComponent("" + 0) + "&";

    //TODO: da konstantno ne refresha
    const response = await fetch(url_, options_)
    return await response.json() as TimoviResponse[];
}
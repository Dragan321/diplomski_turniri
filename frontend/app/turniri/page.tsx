"use client"

import { useSearchStore } from "@/Store/store";
import { buttonVariants } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { siteConfig } from "@/config/site";
import { useInfiniteQuery } from '@tanstack/react-query'
import { Calendar, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Turniri() {

    const [pageSize, searchParams] = useSearchStore((state) => [state.pageSize, state.searchParam])
    const router = useRouter()
    const { data: session, status } = useSession()


    async function getTurnire({ cursor = 0 }): Promise<TurniriResponseDto[]> {
        let url_ = siteConfig.apiUrl + "/api/Turniri?";
        if (searchParams !== undefined && searchParams !== null)
            url_ += "searchTerm=" + encodeURIComponent("" + searchParams) + "&";
        if (pageSize === null)
            throw new Error("The parameter 'pageSize' cannot be null.");
        else if (pageSize !== undefined)
            url_ += "pageSize=" + encodeURIComponent("" + pageSize) + "&";
        if (cursor === null)
            throw new Error("The parameter 'cursor' cannot be null.");
        else if (cursor !== undefined)
            url_ += "cursor=" + encodeURIComponent("" + cursor) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        const response = await fetch(url_, options_)
        return await response.json()

    }

    const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<TurniriResponseDto[]>(
        {
            queryKey: ["getTurnire", searchParams],
            queryFn: getTurnire,
            getNextPageParam: (lastPage, pages) => lastPage[lastPage.length - 1] ? lastPage[lastPage.length - 1].idTurnira + 1 : null
            //TODO: stavi +1 umseto ++ na sve next page params
            //TODO server side fetch
        }
    )
    //TODO: dodaj scrolling i u search ovu stranicu
    //TODO:dodaj za kreiranje novog turnira

    if (data) {
        const turniri: TurniriResponseDto[] = data?.pages.flatMap((page) => page)
        return (
            <div className="justify-center container">
                <div className="flex flex-col items-center">
                    <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight mt-6 text-muted-foreground">
                        Prelged turnira
                        {/* TODO: sredi stajling naslova i na ostalim stranicama da bude ko na ovoj */}
                    </h2>
                    {
                        status === "authenticated" ?
                            <Link className={buttonVariants({ variant: "default" }) + " ml-auto"} href={"/turniri/addTurnir"}>Dodaj turnir</Link>

                            : <></>
                    }
                </div>
                <Table className="mt-10">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Naziv turnira</TableHead>
                            <TableHead><div className="flex gap-3">Datum odrzavanja<Calendar /></div></TableHead>
                            <TableHead><div className="flex gap-3">Lokacija <MapPin /> </div></TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {turniri.map((turnir) => (

                            <TableRow key={turnir.idTurnira} className="hover:cursor-pointer" onClick={() => router.push(`/turniri/${turnir.idTurnira}`)}>
                                <TableCell className="font-medium hover:cursor-pointer">{turnir.nazivTurnira}</TableCell>
                                <TableCell>{new Date(turnir.datumOdrzavanja).toDateString()}</TableCell>
                                <TableCell>{turnir.lokacijaOdrzavanja}</TableCell>
                                <TableCell className="text-right">{turnir.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>


            </div >
        )
    }
}

export interface TurniriResponseDto {
    idTurnira?: number;
    email?: string | undefined;
    nazivTurnira?: string;
    datumOdrzavanja?: string;
    lokacijaOdrzavanja?: string;
    status?: string | undefined;
}

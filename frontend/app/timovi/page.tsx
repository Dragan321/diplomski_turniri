"use client"
import { useSearchStore } from "@/Store/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useInfiniteQuery } from '@tanstack/react-query'
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useIntersection } from '@mantine/hooks';
import { Loading } from "@/components/loading";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { IoFootball } from "react-icons/io5";
import { Delete, Trash, Trophy } from "lucide-react";

export default function Timovi() {

    const [pageSize, searchParams] = useSearchStore((state) => [state.pageSize, state.searchParam])
    const { data: session, status } = useSession()

    async function getTimove({ pageParam = 0 }): Promise<TimoviResponse[]> {

        let url_ = siteConfig.apiUrl + "/api/Timovi?";
        const cursor = pageParam
        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
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

        //TODO: da konstantno ne refresha
        const response = await fetch(url_, options_)
        return await response.json() as TimoviResponse[];
    }

    const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<TimoviResponse[]>(
        {
            queryKey: ["getTimovi", searchParams],
            queryFn: getTimove,
            getNextPageParam: (lastPage, pages) => lastPage[lastPage.length - 1] ? lastPage[lastPage.length - 1].idTima + 1 : null
        }
    )

    const lastTimRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastTimRef.current,
        threshold: 1,
    })

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage) fetchNextPage()
    }, [entry])


    if (data) {
        const timovi: TimoviResponse[] = data?.pages.flatMap((page) => page)
        return (
            <div className="justify-center container p-0">
                <div className="flex flex-col items-center">
                    <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight mt-6 text-muted-foreground">
                        Prelged timova
                        {/* TODO: sredi stajling naslova i na ostalim stranicama da bude ko na ovoj */}
                    </h2>
                    {
                        status === "authenticated" ?
                            <Link className={buttonVariants({ variant: "default" }) + " ml-auto mr-3"} href={"/timovi/addTim"}>Dodaj tim</Link>

                            : <></>
                    }
                </div>
                <div className="grid md:grid-cols-4 justify-center">
                    {
                        timovi.map((tim, i) =>

                            <Link href={"timovi/" + tim.idTima} key={tim.idTima?.toString() + "3" ?? Math.random()}>
                                <Card ref={i === timovi.length - 1 ? ref : null} className="m-3 flex flex-col">
                                    <CardContent className="relative">
                                        <Image src={siteConfig.TeamLogosUrl + tim.logo} alt="Image failed to load" width={350} height={350} />
                                        <div className="flex items-center absolute top-3 right-3 text-2xl">
                                            {/* <Trash size={32} className="hover:bg-gray-100 p-1 rounded-3xl" />
                                            TODO: dodaj funkcionalnost i samo vlasnik da vidi */}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-1 items-center justify-center ">
                                        {tim.nazivTima}
                                        <div className="flex gap-1"><Trophy /> {tim.brPobjeda}</div>
                                        <div className="flex gap-1"><IoFootball className="text-2xl" /> {tim.brGolova}</div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        )

                    }



                </div>
                {//TODO: stilizuj ovo cudo i dodaj skeleton loading
                }
                {
                    isFetchingNextPage && hasNextPage ?
                        <Loading />
                        :
                        <></>
                }
            </div >
        )
    }

}




export interface TimoviResponse {
    idTima?: number;
    nazivTima?: string;
    logo?: string | undefined;
    brGolova: number;
    brPobjeda: number;
}
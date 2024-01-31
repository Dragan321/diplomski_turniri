"use client"
import { useSearchStore } from "@/Store/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useInfiniteQuery } from '@tanstack/react-query'
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useIntersection } from '@mantine/hooks';
import { Loading } from "@/components/loading";
import { linkovi } from "@/components/navbar/mainNav";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Timovi() {

    const [pageSize, searchParams] = useSearchStore((state) => [state.pageSize, state.searchParam])
    const { data: session, status } = useSession()
    async function getIgrace({ pageParam = 0 }): Promise<IgraciResponseDto[]> {

        let url_ = siteConfig.apiUrl + "/api/Igraci";
        const cursor = pageParam

        if (searchParams !== undefined && searchParams !== null)
            url_ += "?searchTerm=" + encodeURIComponent("" + searchParams) + "&";
        if (pageSize === null)
            throw new Error("The parameter 'pageSize' cannot be null.");
        else if (pageSize !== undefined)
            url_ += "pageSize=" + encodeURIComponent("" + pageSize) + "&";
        if (cursor === null)
            throw new Error("The parameter 'cursor' cannot be null.");
        else if (cursor !== undefined)
            url_ += "cursor=" + encodeURIComponent("" + cursor) + "&";

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        //TODO: da konstantno ne refresha
        const response = await fetch(url_, options_)
        return await response.json() as IgraciResponseDto[];
    }

    const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<IgraciResponseDto[]>(
        {
            queryKey: ["getIgraci", searchParams],
            queryFn: getIgrace,
            getNextPageParam: (lastPage, pages) => lastPage[lastPage.length - 1] ? lastPage[lastPage.length - 1].idIgraca + 1 : null
            //TODO server side fetch i promjeni cursor da vraca sa zadnjeg tima
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
        console.log(session)
        const igraci: IgraciResponseDto[] = data?.pages.flatMap((page) => page)
        return (
            <div className="justify-center container p-0">
                <div className="flex flex-col items-center">
                    <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight mt-6 text-muted-foreground">
                        Pregled igraca
                        {/* TODO: sredi stajling naslova i na ostalim stranicama da bude ko na ovoj */}
                    </h2>
                    {
                        status === "authenticated" ?
                            <Link className={buttonVariants({ variant: "default" }) + " ml-auto mr-3"} href={"/igraci/addIgrac"}>Dodaj igraca</Link>

                            : <></>
                    }
                </div>
                <div className="grid md:grid-cols-4 justify-center">
                    {
                        igraci.map((igrac, i) =>

                            <Link href={`igraci/${igrac.idIgraca}`} key={igrac.idIgraca?.toString() + "2" ?? Math.random()} >
                                <Card ref={i === igraci.length - 1 ? ref : null} className="m-3 flex flex-col">
                                    <CardContent className="relative" >
                                        <Image src={
                                            "/playerPlaceholder.jpg"
                                            //siteConfig.TeamLogosUrl + igrac.slika TODO:stavi ovo
                                        } alt="Image failed to load" width={350} height={350} />
                                        {//TODO: stavi provjeru  da li uopste ima tim
                                        }
                                        <Link href={linkovi[2].url + "/" + igrac.idTima
                                        } className={"absolute bottom-6 left-6 rounded-3xl " + buttonVariants({ variant: "default" })}>
                                            <Image className="mr-2" src={
                                                siteConfig.TeamLogosUrl + igrac.logo} alt="Image failed to load" width={20} height={20} />
                                            {igrac.nazivTima}
                                        </Link>
                                    </CardContent>
                                    <CardFooter className="flex justify-center">
                                        {igrac.imeIgraca
                                            //dodaj jos ovih sto fale za prikaz
                                        }
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


export interface IgraciResponseDto {
    idIgraca?: number;
    imeIgraca?: string;
    slika?: string | undefined;
    idTima?: number | undefined;
    nazivTima?: string | undefined;
    logo?: string | undefined;
    brGolova: string;

}
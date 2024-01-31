"use client"

import { Graf } from "@/components/graf";
import TabelaIgraci from "@/components/tabelaIgraci";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useQuery } from "@tanstack/react-query"
import { Award, Calendar, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Igrac({ params }: { params: { id: number } }) {

    const { data, isLoading } = useQuery(
        {
            queryKey: ['tim'],
            queryFn: () => getTim(params.id)
            //TODO: dodaj da izbaci gresku i ovde i na turnir ako nije nadjen ili u fetchu
        }
    )



    if (data) {

        return (
            <div className="justify-center  container gap-5 flex flex-col pt-5 ">
                <h2 className="text-3xl font-bold tracking-tight">{data.nazivTima}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Odigranih meceva
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.brMeceva} </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pobjeda
                            </CardTitle>
                            <Trophy />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.brPobjeda}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Broj postignutih golova</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.brGolova}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Broj osvojenih turnira
                            </CardTitle>
                            <Award />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.brojOsvojenihTurnira}</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Pregled broja golova po utakmicama</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2 flex justify-center min-h-[350px] items-center">
                            <Graf data={data.brGolovaUZadnjihNMeceva} />
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent className="felx flex-col items-center justify-center p-5 relative h-full ">
                            <Image src={siteConfig.TeamLogosUrl + data.logo} alt="Greska pri ucitavanju slike igraca" className="m-auto p-8" sizes="100%" layout='fill'
                                objectFit='contain' />
                        </CardContent>
                    </Card>
                </div>
                <TabelaIgraci igraci={data.igracs} />
            </div>
        )

    }

}



async function getTim(id: number): Promise<SingleTimResponseDto> {
    let url_ = siteConfig.apiUrl + "/api/Timovi/{id}"
    if (id === undefined || id === null)
        throw new Error("The parameter 'id' must be defined.")
    url_ = url_.replace("{id}", encodeURIComponent("" + id))
    url_ = url_.replace(/[?&]$/, "")

    let options_: RequestInit = {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    }

    const response = await fetch(url_, options_)
    return await response.json()
}





export interface SingleTimResponseDto {
    idTima?: number;
    email?: string | undefined;
    nazivTima?: string;
    logo?: string | undefined;
    igracs?: OIgracu[];
    brGolova?: number | undefined;
    brMeceva?: number | undefined;
    brPobjeda?: number | undefined;
    brGolovaUZadnjihNMeceva?: BrGolovaTimaPoMecu[];
    brojOsvojenihTurnira?: number;
}

export interface OIgracu {
    idIgraca?: number;
    imeIgraca?: string;
    slika?: string | undefined;
}

export interface BrGolovaTimaPoMecu {
    idMeca?: number | undefined;
    idTima?: number | undefined;
    brGolova?: number | undefined;
}
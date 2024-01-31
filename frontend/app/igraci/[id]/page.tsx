"use client"

import { Graf } from "@/components/graf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useQuery } from "@tanstack/react-query"
import { Award, Calendar, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Igrac({ params }: { params: { id: number } }) {

    const { data, isLoading } = useQuery(
        {
            queryKey: ['igrac'],
            queryFn: () => getIgrac(params.id)
            //TODO: dodaj da izbaci gresku i ovde i na turnir
        }
    )


    if (data) {

        return (
            <div className="justify-center  container gap-5 flex flex-col pt-5 ">
                <Link href={"/timovi/" + data.idTima} className="flex items-center gap-5">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{data.imeIgraca}</h2>
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            {data.nazivTima}
                        </h4>
                    </div>
                    <Image src={siteConfig.TeamLogosUrl + data.logo} alt="problem pri ucitavanju slike" height={150} width={150} />
                </Link>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Datum rodjenja
                            </CardTitle>
                            <Calendar />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{new Date(data.datumRodjenja).toDateString()} </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Odigranih Meceva
                            </CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.brMeceva}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Broj pobjeda</CardTitle>
                            <Trophy />

                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.brPobjeda}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Broj postignutih golova
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.brGolova}</div>

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
                            <Image src={"https://images.mlssoccer.com/image/private/w_175,h_175,c_pad/f_png/prd-league/tszhyf7itk3cicqennw9"} alt="Greska pri ucitavanju slike igraca" className="m-auto p-8" sizes="100%" layout='fill'
                                objectFit='contain' />
                            {/* TODO: promjeni sa placeholdera na pravu sliku {siteConfig.playerPicsUrl + data.slika} i dodaj ikonice sto fale */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )

    }

}
async function getIgrac(id: number): Promise<SingleIgracResponseDto> {
    let url_ = siteConfig.apiUrl + "/api/Igraci/{id}";
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

export interface SingleIgracResponseDto {
    idIgraca?: number;
    imeIgraca?: string;
    slika?: string | undefined;
    idTima?: number | undefined;
    nazivTima?: string | undefined;
    logo?: string | undefined;
    brGolova?: number | undefined;
    brMeceva?: number | undefined;
    brPobjeda?: number | undefined;
    brGolovaUZadnjihNMeceva?: BrGolovaPoMecu[];
    datumRodjenja: string
}


export interface BrGolovaPoMecu {
    idMeca?: number | undefined;
    idIgraca?: number | undefined;
    brGolova?: number | undefined;
}

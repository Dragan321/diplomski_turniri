"use client"

import { DodavanjTimovaUTurnir } from "@/components/dodavanjTimovaUTurnir";
import { Scoreboard } from "@/components/scoreboard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Turnir({ params }: { params: { id: number } }) {

    const { data, isLoading } = useQuery(
        {
            queryKey: ['turnir'],
            queryFn: () => getTurnir(params.id)
        }
    )

    const user = useSession().data


    if (data) {

        const timovi = new Map<number, { logo: string, nazivTima: string }>(
            data.timovi?.map(tim => {
                return [tim.idTima, { logo: tim.logo, nazivTima: tim.nazivTima }];
            }))
        return (
            <div className="justify-center  items-center flex p-5 ">
                {
                    data.status == "Prijave u toku" ?
                        <DodavanjTimovaUTurnir token={user?.access_token} idTurnira={params.id} />
                        :
                        <div className="justify-center items-center flex" >
                            {
                                data.rundes?.map(runda =>
                                    <div className="flex flex-col m-5 " key={runda.idRunde}>
                                        {
                                            runda.mecs?.map(mec =>
                                                <Dialog key={mec.idMeca?.toString() + "4" ?? Math.random()}>
                                                    <DialogTrigger asChild>
                                                        <div className=" rounded-xl border-2 p-1 border-secondary flex-col m-2 hover:cursor-pointer" key={mec.idMeca}>
                                                            {/* dodaj na hover */}
                                                            <div className="flex p-1 flex-wrap gap-5">
                                                                <Image src={siteConfig.TeamLogosUrl + timovi.get(mec.idTima1)?.logo} alt="" width={20} height={20} />
                                                                {timovi.get(mec.idTima1)?.nazivTima}
                                                                <div className="ml-auto mr-1">{mec.brGolovaTim1}</div>
                                                            </div>
                                                            <Separator />
                                                            <div className="flex p-1 flex-wrap gap-5">
                                                                <Image src={siteConfig.TeamLogosUrl + timovi?.get(mec.idTima2)?.logo} alt="" width={20} height={20} />
                                                                {timovi?.get(mec.idTima2)?.nazivTima}
                                                                <div className="ml-auto mr-1">{mec.brGolovaTim2}</div>
                                                            </div>
                                                        </div>
                                                    </DialogTrigger>
                                                    <Scoreboard timovi={timovi} mec={mec} token={user?.access_token} />
                                                </Dialog>


                                            )

                                        }

                                    </div>




                                )
                            }
                        </div>
                }


            </div>
        )
    }
}

async function getTurnir(id: number): Promise<SingleTurnirResponseDto> {
    if (id === undefined || id === null)
        throw new Error("The parameter 'id' must be defined.");
    let url_ = siteConfig.apiUrl + `/api/Turniri/${id}`;

    let options_: RequestInit = {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    };

    const response = await fetch(url_, options_)
    return await response.json() as SingleTurnirResponseDto
}


export interface SingleTurnirResponseDto {
    idTurnira?: number;
    email?: string | undefined;
    nazivTurnira?: string;
    datumOdrzavanja?: Date;
    lokacijaOdrzavanja?: string;
    status?: string | undefined;
    rundes?: RundeResponseDto[];
    timovi?: TimoviResponseDto[];
}

export interface RundeResponseDto {
    idRunde?: number;
    idTurnira?: number | undefined;
    runda?: number;
    mecs?: MecResponseDTO[];
}

export interface TimoviResponseDto {
    idTima?: number;
    nazivTima?: string;
    logo?: string | undefined;
}

export interface MecResponseDTO {
    idMeca?: number;
    idRunde?: number | undefined;
    idPobjednika?: number | undefined;
    idTima1?: number | undefined;
    idTima2?: number | undefined;
    brGolovaTim1?: number;
    brGolovaTim2?: number;
    gos?: GoloviResponseDTO[];
    mecZavrsen?: boolean;

}


export interface GoloviResponseDTO {
    idGola?: number;
    idIgraca?: number | undefined;
    idTima?: number | undefined;
    idMeca?: number | undefined;
    minut?: number;
    imeIgraca?: string;
}
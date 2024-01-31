import { MecResponseDTO } from "@/app/turniri/[id]/page"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { siteConfig } from "@/config/site"
import Image from "next/image"
import { Separator } from "./ui/separator"
import { IgraciResponseDto } from "@/app/igraci/page"
import { useQuery } from '@tanstack/react-query'
import { AddGoal } from "./addGoal"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { useQueryClient } from '@tanstack/react-query'




interface Props {
    mec: MecResponseDTO
    timovi: Map<number, { logo: string, nazivTima: string }>,
    token: string
}



export function Scoreboard(props: Props) {
    const tim1 = props.timovi.get(props.mec.idTima1)
    if (tim1)
        tim1.id = props.mec.idTima1
    const tim2 = props.timovi?.get(props.mec.idTima2)

    async function getIgrace(): Promise<IgraciResponseDto[]> {
        let url_ = siteConfig.apiUrl + "/api/Igraci?"
        const timids: number[] = [props.mec.idTima1, props.mec.idTima2]

        url_ += "pageSize=" + encodeURIComponent("" + 99999) + "&"
        url_ += "cursor=" + encodeURIComponent("" + 0) + "&"
        url_ += "timids=" + encodeURIComponent("" + `${timids[0]}`) + "&"
        url_ += "timids=" + encodeURIComponent("" + `${timids[1]}`) + "&"


        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }
        const response = await fetch(url_, options_)
        return await response.json()
    }

    const { data } = useQuery({ queryKey: ['igracitimova'], queryFn: getIgrace })
    const user = useSession().data
    const queryClient = useQueryClient()


    if (data && data[0].idTima != props.timovi.get(props.mec.idTima1))
        queryClient.invalidateQueries(["igracitimova"])
    return (

        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-center">Rezultat</DialogTitle>
            </DialogHeader>
            <div className="flex items-center flex-col justify-center space-x-2">
                <div className="flex items-center gap-5">
                    <div className="flex flex-col justify-center text-center">
                        <Image src={siteConfig.TeamLogosUrl + tim1?.logo} alt="" width={150} height={150} />
                        {tim1?.nazivTima}
                    </div>
                    <div className="text-7xl tracking-widest">{props.mec.brGolovaTim1}:{props.mec.brGolovaTim2}</div>
                    <div className="flex flex-col justify-center text-center">
                        <Image src={siteConfig.TeamLogosUrl + tim2?.logo} alt="" width={150} height={150} />
                        {tim2?.nazivTima}
                    </div>
                </div>
                <Separator className="mt-7 mb-7" />
                {
                    props.mec.gos?.map(go =>
                        <div className="flex flex-col w-full" key={go.idGola?.toString() + "6" ?? Math.random()}>
                            {tim1?.id == go.idTima ?
                                <div className="mr-auto flex gap-5" >
                                    <div>{go.minut + "'"}</div>
                                    <div>{go.imeIgraca}</div>
                                </div>
                                :
                                <div className="ml-auto flex gap-5" >
                                    <div>{go.imeIgraca}</div>
                                    <div>{go.minut + "'"}</div>
                                </div>
                            }
                        </div>

                    )
                }
                {/* todo:dodaj provjeru je li vlasnik i combobox se ne zatvara na izbor */}
                {data && props.mec.mecZavrsen !== true ?
                    <div>
                        <Separator className="mt-7" />
                        <AddGoal igraci={data} email={user?.email} idmeca={props.mec.idMeca} />
                        <Separator className="mt-7 mb-7" />

                        <DialogFooter>
                            <Button onClick={() => {
                                zavrsiMec(props.mec.idMeca, props.token)
                                queryClient.invalidateQueries(["turnir"])//TODO: moze ovo use ueMutation i ovde i na


                            }}>Zavrsite mec</Button>
                        </DialogFooter>
                    </div>
                    :
                    <></>
                }




            </div>


        </DialogContent >
    )
}

async function zavrsiMec(id: number, token: string) {
    let url_ = siteConfig.apiUrl + "/api/Mecevi/{id}";
    if (id === undefined || id === null)
        throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));

    let options_: RequestInit = {
        method: "PUT",
        headers: {
            "Accept": "application/octet-stream",
            "Authorization": `bearer ${token}`

        }
    };

    const response = await fetch(url_, options_)
    if (!response.ok)
        throw new Error(response.json())
}

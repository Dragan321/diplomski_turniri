
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { linkovi } from "@/components/navbar/mainNav";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { IgraciResponseDto } from "@/app/page";
import { IoFootball, IoTrophy } from "react-icons/io5";
import { json } from "node:stream/consumers";
import { ArrowBigLeft, ArrowRight, Trophy } from "lucide-react";
import { TimoviResponse } from "@/app/timovi/page";

interface Props {
    igraci: IgraciResponseDto[]
    timovi: TimoviResponse[]
}

export default function Stats(props: Props) {
    const color = [
        "text-[rgb(255,215,0)]",
        "text-[rgb(192,192,192)]",
        "text-[rgb(205,127,50)]",
        "text-[rgb(0,0,0)]"
    ]
    const slike = [
        "https://images.mlssoccer.com/image/private/w_175,h_175,c_pad/f_png/prd-league/ragerrmhi9u9nw4qulef",
        "https://images.mlssoccer.com/image/private/w_175,h_175,c_pad/f_png/prd-league/fccg8dfytf399voaeewr",
        "https://images.mlssoccer.com/image/private/w_175,h_175,c_pad/f_png/prd-league/tszhyf7itk3cicqennw9",
        "https://images.mlssoccer.com/image/private/w_175,h_175,c_pad/f_png/prd-league/blbtrbnyzsue4ar4sgs8"

    ]

    return (
        <div className="justify-center container ">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-6 text-muted-foreground">
                Najbolji strjelci
                {/* TODO: sredi stajling naslova i na ostalim stranicama da bude ko na ovoj */}
            </h2>
            <div className="grid md:grid-cols-5 justify-center items-center">
                {
                    props.igraci.map((igrac, i) =>

                        <Link href={`igraci/${igrac.idIgraca}`} key={igrac.idIgraca.toString() + "7" ?? Math.random()} >
                            <Card className="m-3 flex flex-col">
                                <CardContent>
                                    <Image src={
                                        slike[i]
                                    } alt="Image failed to load" width={350} height={350} />

                                    {/* //TODO zamejeni sa pravim slikama */}
                                </CardContent>
                                <CardFooter className="flex justify-center">
                                    <CardFooter className="flex flex-col gap-1 items-center justify-center ">
                                        {igrac.imeIgraca}
                                        <div className="flex gap-1"><IoFootball className={`${color[i]} text-2xl`} /> {igrac.brGolova}</div>
                                    </CardFooter>
                                </CardFooter>
                            </Card>
                        </Link>
                    )

                }
                <Link href="/igraci">
                    <ArrowRight size={64} className="ml-16 rounded-full bg-gray-100" />
                </Link>
            </div>

            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-6 text-muted-foreground">
                Najbolji timovi
                {/* TODO: sredi stajling naslova i na ostalim stranicama da bude ko na ovoj */}
            </h2>
            <div className="grid md:grid-cols-5 justify-center items-center">
                {
                    props.timovi.map((tim, i) =>
                        <Link href={"timovi/" + tim.idTima} key={tim.idTima?.toString() + "8" ?? Math.random()}>
                            <Card className="m-3 flex flex-col">
                                <CardContent>
                                    <Image src={siteConfig.TeamLogosUrl + tim.logo} alt="Image failed to load" width={350} height={350} />

                                </CardContent>
                                <CardFooter className="flex flex-col gap-1 items-center justify-center ">
                                    {tim.nazivTima}
                                    <div className="flex gap-1"><IoTrophy className={`${color[i]} text-2xl`} /> {tim.brPobjeda}</div>
                                </CardFooter>
                            </Card>
                        </Link>
                    )

                }
                <Link href="/igraci">
                    <ArrowRight size={64} className="ml-16 rounded-full bg-gray-100" />
                </Link>
            </div>



        </div >
    )


}



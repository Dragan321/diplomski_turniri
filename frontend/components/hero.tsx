"use client"
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { Player } from "@lottiefiles/react-lottie-player";

export default function Hero() {
    return (
        <section className="container flex flex-col gap-4  pt-4 text-center lg:items-center lg:gap-8 lg:py-20 mb-0 ">
            <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold lg:text-6xl">
                        Sajt za organizaciju i pracenje statistike turnira
                    </h1>
                    <h2 className="text-lg font-light text-muted-foreground lg:text-3xl">
                        Kreirajte turnir u par klikova
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                    <Link
                        href="/igraci/addIgrac"
                        className={`w-[10rem] ${cn(buttonVariants({ size: "lg" }))}`}
                    >
                        Dodajte igrace
                    </Link>
                    <Link
                        href="/timovi/addTim"
                        className={`w-[10rem] ${cn(buttonVariants({ size: "lg" }))}`}
                    >
                        Dodajte timove
                    </Link>
                    <Link
                        href="/turniri/addTurnir"
                        className={`w-[10rem] ${cn(buttonVariants({ size: "lg" }))}`}
                    >
                        Kreirajte turnir
                    </Link>
                </div>
            </div>
            <div className="flex flex-col justify-center">
                <Player autoplay loop src={"/logo.json"} style={{ height: "36rem" }} />
            </div>

        </section>
    )
}
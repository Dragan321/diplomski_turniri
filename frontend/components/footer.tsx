import { AtSign, Github } from "lucide-react";
import { Separator } from "./ui/separator";
import Link from "next/link";

export default function Footer() {

    return (
        <section className="w-full container mb-16">
            <Separator />
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-5">
                Kontakt
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6 flex gap-5 items-center pl-5 mb-5">
                <AtSign /> dragan.milovanovic444@gmail.com
            </p>
            <Link href={"https://github.com/Dragan321"}>
                <p className="leading-7 [&:not(:first-child)]:mt-6 flex gap-5 items-center pl-5">
                    <Github />
                    Dragan
                </p>
            </Link>
        </section>
    )


}
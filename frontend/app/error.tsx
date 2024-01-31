"use client"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link"

//TODO: sto ne radi sa fetchom
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="container flex flex-col gap-7 items-center justify-center">
            <Card>
                <CardHeader className="text-red-700">Greska</CardHeader>
                <CardContent className="flex p-4 text-red-700">
                    <XCircle className="w-64" />
                    {error.message}
                </CardContent>
                <CardFooter className="flex flex-col">

                    <Link className={buttonVariants({ variant: "default" })} href={"/"}>Nazad na pocetnu</Link>

                </CardFooter>
            </Card>


        </div>

    )

}
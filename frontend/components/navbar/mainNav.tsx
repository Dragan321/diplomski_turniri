import * as React from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

interface link {
    displayName: string,
    url: string

}
export const linkovi: Array<link> = [
    { displayName: "Pocetna", url: "/" },
    { displayName: "Turniri", url: "/turniri" },
    { displayName: "Timovi", url: "/timovi" },
    { displayName: "Igraci", url: "/igraci" },


]


export function MainNav() {

    return (
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <Trophy />
                <span className="hidden font-bold sm:inline-block">
                    {siteConfig.name}
                </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
                {linkovi.map((link) =>
                    <Link
                        key={link.url}
                        href={link.url}
                        className={cn(
                            "transition-colors hover:text-foreground/80"
                        )}
                    >
                        {link.displayName}
                    </Link>
                )}
            </nav>
        </div>
    )
}
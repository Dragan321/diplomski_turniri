"use client"

import { useSearchStore } from "@/Store/store";
import { OIgracu } from "@/app/timovi/[id]/page";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    igraci?: OIgracu[];
}

export default function TabelaIgraci(props: Props) {

    const router = useRouter()

    return (
        <div className="justify-center container mt-10 mb-10">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Pregled igraca
            </h3>
            <Table className="">
                <TableHeader>
                    <TableRow>
                        <TableHead>Ime i prezime</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {props.igraci?.map((igrac) => (
                        // TODO: dodaj jos informacija o igracu
                        <TableRow className="hover:cursor-pointer" key={igrac.idIgraca} onClick={() => router.push(`/igraci/${igrac.idIgraca}`)}>
                            <TableCell className="font-medium">{igrac.imeIgraca}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


        </div >
    )
}


export interface TurniriResponseDto {
    idTurnira?: number;
    email?: string | undefined;
    nazivTurnira?: string;
    datumOdrzavanja?: string;
    lokacijaOdrzavanja?: string;
    status?: string | undefined;
}

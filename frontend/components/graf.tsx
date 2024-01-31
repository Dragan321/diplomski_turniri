"use client"

import { BrGolovaPoMecu } from "@/app/igraci/[id]/page"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface Props {
    data: BrGolovaPoMecu[]
}


export function Graf(props: Props) {
    if (props.data.length > 0)
        return (
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={props.data}>
                    <XAxis
                        dataKey="Mec"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                        allowDecimals={false}
                    />
                    <Bar dataKey="brGolova" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        )
    else
        return (
            <div className="text-lg font-semibold">Igrac jos nije postigao go!!!</div>

        )
}

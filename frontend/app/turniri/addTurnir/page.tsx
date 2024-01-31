"use client"

import { siteConfig } from "@/config/site";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function AddTurnir() {

    const user = useSession().data
    const queryClient = useQueryClient()
    const router = useRouter()

    const formSchema = z.object({
        nazivTurnira: z.string().min(2, {
            message: "Ime mora sadrzati bar 3 karaktera",
        }),
        email: z.string(),
        lokacijaOdrzavanja: z.string(),
        //TODO: ogranicenje po godinama?
        datumOdrzavanja: z.date().min(new Date(), { message: "Morate unjeti validan datum" }),

    })




    //TODO: zamjeni select sa combo boxom
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            email: user?.email ?? "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        //TODO: testiraj i dodaj link
        values.email = user?.email
        postTurnir(values, user?.access_token)
        //queryClient.invalidateQueries(["getTurnire"])//TODO: moze ovo use ueMutation i ovde i na

        toast({
            title: "Uspjesno ste dodali turnir!!!",
            //TODO: kod taneta https://github.com/shadcn-ui/ui/issues/1597 i dodaj neki opis
            description: "",
        })
        router.push("/turniri")
    }

    const { toast } = useToast()
    return (
        <main className="container h-full flex items-center justify-center pt-16">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Dodajte turnir</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <CardContent className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="nazivTurnira"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unesite naziv turnira</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ime turnira..." type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="datumOdrzavanja"
                                render={({ field }) => (
                                    <FormItem className="mt-4 flex flex-col">
                                        <FormLabel>Izaberite datum odrzavanja</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Izaberite datum</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" >
                                                <Calendar
                                                    mode="single"
                                                    captionLayout="dropdown-buttons"
                                                    fromYear={1960}
                                                    toYear={2030}
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lokacijaOdrzavanja"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unesite lokaciju turnira</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Lokacija..." type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Link href="/turniri" className={buttonVariants({ variant: "outline" }) + " mr-3"}>Pregled turnira</Link>
                            <Button type="submit">Dodajte turnir</Button>
                        </CardFooter>
                    </form>
                </Form>


            </Card>

        </main>
    )

}
async function postTurnir(turnir: PostTurnirDTO, token: string) {
    let url_ = siteConfig.apiUrl + "/api/Turniri"

    const content_ = JSON.stringify(turnir)

    let options_: RequestInit = {
        body: content_,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `bearer ${token}`
        }
    }

    const response = await fetch(url_, options_)
    if (!response.ok)
        throw new Error("Greska pri kreiranju turnira!!!Probajte posle!!!")
}


export interface PostTurnirDTO {
    email?: string | undefined;
    nazivTurnira?: string;
    datumOdrzavanja?: string;
    lokacijaOdrzavanja?: string;
}

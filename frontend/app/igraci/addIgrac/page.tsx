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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button"
import Dropzone from "react-dropzone"
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CalendarIcon, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimoviResponse } from "@/app/timovi/page";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

//TODO: dodaj path protection

export default function AddTim() {

    const user = useSession().data
    const [image, setImage] = useState<string>()
    const queryClient = useQueryClient()
    const router = useRouter()
    const { data } = useQuery({ queryKey: ['svitimovi'], queryFn: getTimove })
    const formSchema = z.object({
        ime: z.string().min(2, {
            message: "Ime mora sadrzati bar 3 karaktera",
        }),
        email: z.string(),
        tim: z.string(),
        //TODO: ogranicenje po godinama?
        datumRodjenja: z.date().min(new Date("1900-01-01"), { message: "Morate unjeti validan datum" }).max(new Date(), { message: "Morate unjeti validan datum!" }),
        slika: z
            .array(
                z.object({
                    file: z.any()
                })
            )
            .nonempty({ message: "Morate imati sliku" }),
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

        const formData = new FormData();
        formData.append('slika', values.slika[0].file)
        formData.append('ime', values.ime)
        formData.append('email', user?.email ?? "")
        formData.append('datumRodjenja', values.datumRodjenja.toDateString())
        formData.append('tim', values.tim.toString())
        postIgrac(formData, user?.access_token)
        queryClient.invalidateQueries(["getIgraci"])//TODO: moze ovo use ueMutation i ovde i na
        queryClient.invalidateQueries(["igracitimova"])

        toast({
            title: "Uspjesno ste se registrovali!!!",
            //TODO: kod taneta https://github.com/shadcn-ui/ui/issues/1597 i dodaj neki opis
            description: "",
        })
        router.push("/igraci")
    }

    const { fields, append, remove } = useFieldArray({
        name: "slika",
        control: form.control,
    });
    const { toast } = useToast()
    return (
        <main className="container h-full flex items-center justify-center pt-16">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Registruj igraca</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="ime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unesite ime i prezime</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ime igraca..." type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="datumRodjenja"
                                render={({ field }) => (
                                    <FormItem className="mt-4 flex flex-col">
                                        <FormLabel>Izaberite datum rodjenja</FormLabel>
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
                                                        date > new Date() || date < new Date("1900-01-01")
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
                                name="tim"
                                render={({ field }) => (
                                    <FormItem className="mt-4">
                                        <FormLabel>Izaberite tim</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Izaberite tim" />
                                                </SelectTrigger>
                                            </FormControl>
                                            {/* //TODO: preabaci na kombo box */}
                                            <SelectContent>
                                                {data?.map((tim =>
                                                    <SelectItem key={tim.idTima ?? ""} value={tim.idTima?.toString() + "1" ?? ""}>{tim.nazivTima}</SelectItem>

                                                ))}

                                            </SelectContent>
                                        </Select>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="slika"
                                render={({ }) => (
                                    <FormItem>
                                        <FormControl>

                                            <Dropzone
                                                //todo: vrati da prihvata samo slike
                                                multiple={false}
                                                maxSize={5000000}
                                                onDropAccepted={(acceptedFiles) => {
                                                    setImage(URL.createObjectURL(acceptedFiles[0]))
                                                    remove()
                                                    return append(
                                                        {
                                                            file: acceptedFiles[0]
                                                        }
                                                    )
                                                }}
                                            >
                                                {({ getRootProps, getInputProps, acceptedFiles }) => (
                                                    <div
                                                        {...getRootProps({
                                                            className: cn(
                                                                "p-3  flex flex-col items-center mt-8 justify-center w-full rounded-md cursor-pointer border border-[#e2e8f0]"
                                                            ),
                                                        })}
                                                    >
                                                        <div className="flex items-center gap-x-3 mt-2 mb-2">
                                                            <Label

                                                                className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline "text-red-500"
                                                                    }`}
                                                            >
                                                                <input {...getInputProps()} />
                                                                {
                                                                    //todo nemre ovo image? ovde iskace dvaput
                                                                }
                                                                {image ?
                                                                    //todo: prebaci na next image
                                                                    <img src={image} className="max-h-96" />
                                                                    :
                                                                    <div className="flex justify-center flex-col items-center h-48 p-5">

                                                                        <div className="text-center text-lg">Prevuciti sliku ili kliknite da dodate</div>
                                                                        <Image className="h-8 " />

                                                                    </div>
                                                                }
                                                            </Label>
                                                        </div>
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={() => (
                                    <FormItem>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </CardContent>
                        <CardFooter>
                            <Link href="/igraci" className={buttonVariants({ variant: "outline" }) + " mr-3"}>Pregled igraca</Link>
                            <Button type="submit">Registruj se</Button>
                        </CardFooter>
                    </form>
                </Form>


            </Card>

        </main>
    )
}

async function postIgrac(igrac: FormData, token: string) {
    let url_ = siteConfig.apiUrl + "/api/Igraci";
    const content_ = igrac

    let options_: RequestInit = {
        body: content_,
        method: "POST",
        headers: {
            "Authorization": `bearer ${token}`
        }
    };

    const res = await fetch(url_, options_)
    if (!res.ok)
        throw new Error("Greska pri kreiranju igraca pokusajte posle")
    //TODO: vidi da je error hendlovan

}

async function getTimove(): Promise<TimoviResponse[]> {

    let url_ = siteConfig.apiUrl + "/api/Timovi?";
    let options_: RequestInit = {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    };
    url_ += "searchTerm=" + encodeURIComponent("") + "&";
    url_ += "pageSize=" + encodeURIComponent("" + 99999999) + "&";
    url_ += "cursor=" + encodeURIComponent("" + 0) + "&";

    //TODO: da konstantno ne refresha
    const response = await fetch(url_, options_)
    return await response.json() as TimoviResponse[];
}


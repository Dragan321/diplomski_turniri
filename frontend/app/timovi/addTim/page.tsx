"use client"
import { siteConfig } from "@/config/site";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

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
import Dropzone from "react-dropzone"
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Image } from "lucide-react";

//TODO: dodaj path protection
export default function AddTim() {

    const user = useSession().data
    const [image, setImage] = useState<string>()
    const queryClient = useQueryClient()
    const router = useRouter()

    const formSchema = z.object({
        nazivTima: z.string().min(2, {
            message: "Nazvi tima mora sadrzati bar 3 karaktera",
        }),
        email: z.string(),
        logo: z
            .array(
                z.object({
                    file: z.any()
                })
            )
            .nonempty({ message: "Morate imati logo" }),
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            email: user?.email ?? "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {

        const formData = new FormData();
        formData.append('logo', values.logo[0].file)
        formData.append('nazivTima', values.nazivTima)
        formData.append('email', user?.email ?? "")
        postTim(formData, user?.access_token)
        queryClient.invalidateQueries(["getTimovi"])
        toast({
            title: "Tim je uspjesno regisrovan!!!",
            //TODO: i dodaj neki opis
            description: "",
        })
        router.push("/timovi")
    }
    const { fields, append, remove } = useFieldArray({
        name: "logo",
        control: form.control,
    });
    const { toast } = useToast()

    return (
        <main className="container h-full flex items-center justify-center pt-16">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Dodajte tim</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <CardContent>

                            <FormField
                                control={form.control}
                                name="nazivTima"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unesite naziv tima</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Naziv tima..." type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField

                                control={form.control}
                                name="logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>

                                            <Dropzone
                                                //todo: vrati da prihvata samo slike
                                                multiple={false}
                                                maxSize={5000000}
                                                onDropAccepted={(acceptedFiles) => {
                                                    setImage(URL.createObjectURL(acceptedFiles[0]))
                                                    console.log(acceptedFiles)
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
                                                                "p-3 mb-4 flex flex-col items-center mt-4 justify-center w-full rounded-md cursor-pointer border border-[#e2e8f0]"
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
                                                                    //todo prebaci na next image

                                                                    <img src={image} className="max-h-96" />
                                                                    :
                                                                    <div className="flex justify-center flex-col items-center h-48 p-5">

                                                                        <div className="text-center text-lg">Prevuciti sliku ili kliknite da dodate logo</div>
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
                            <Link href="/timovi" className={buttonVariants({ variant: "outline" }) + " mr-3"}>Pregled timova</Link>
                            <Button type="submit">Kreirajte tim</Button>
                        </CardFooter>
                    </form>
                </Form>


            </Card>

        </main>
    )
}

async function postTim(tim: FormData, token: string) {
    let url_ = siteConfig.apiUrl + "/api/Timovi";
    const content_ = tim

    let options_: RequestInit = {
        body: content_,
        method: "POST",
        headers: {
            "Authorization": `bearer ${token}`
        }
    };

    const res = await fetch(url_, options_)
    if (!res.ok)
        throw new Error("Greska pri kreiranju tima pokusajte posle")
    //TODO: vidi da je error hendlovan

}
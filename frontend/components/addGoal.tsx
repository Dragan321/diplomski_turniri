"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { useQueryClient } from '@tanstack/react-query'
import * as z from "zod"


import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { IgraciResponseDto } from "@/app/igraci/page"
import { Input } from "./ui/input"
import { siteConfig } from "@/config/site"



const FormSchema = z.object({
  igrac: z.number({
    required_error: "Morate izabrati igraca",
  }),
  minut: z.coerce.number({
    required_error: "Morate unjeti minut",
    invalid_type_error: "MInut mora biti broj",
  }),
  idtima: z.number(),
  email: z.string(),
  idmeca: z.number()
})


interface props {
  igraci: IgraciResponseDto[],
  email: string,
  idmeca: number
}

export function AddGoal(props: props) {
  //TODO: ima is sucessfull i reset  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: props.email,
      idmeca: props.idmeca,
      idtima: 0
    },
  })
  const queryClient = useQueryClient()



  async function onSubmit(data: z.infer<typeof FormSchema>) {

    data.idtima = props.igraci.find(igrac => igrac.idIgraca === data.igrac)?.idTima ?? -1
    const go: PostGo = {
      idIgraca: data.igrac,
      idMeca: data.idmeca,
      idTima: data.idtima,
      minut: data.minut
    }
    await postGo(go)
    //TODO:  dodaj neki loading dok se ne posalje
    await queryClient.invalidateQueries(['turnir'])
    form.reset()


  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex place-items-end gap-3 mt-5">
        <FormField
          control={form.control}
          name="igrac"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Izaberite igraca</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? props.igraci.find(
                          (igrac) => igrac.idIgraca === field.value
                        )?.imeIgraca
                        : "Izaberite igraca"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>Sacekajte dok se igraci ucitaju.</CommandEmpty>
                    <CommandGroup>
                      {props.igraci.map((igrac) => (
                        <CommandItem
                          value={igrac.imeIgraca}
                          key={igrac.idIgraca}
                          onSelect={() => {
                            form.setValue("igrac", igrac.idIgraca)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              igrac.imeIgraca === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {igrac.imeIgraca}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minut</FormLabel>
              <FormControl>
                <Input placeholder="" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Dodaj</Button>
      </form>
    </Form>
  )
}

async function postGo(go: PostGo) {
  let url_ = siteConfig.apiUrl + "/api/Golovi";
  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(go);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  const res = await fetch(url_, options_)
  if (!res.ok)
    throw new Error("Greska pri kreiranju igraca pokusajte posle")
}


export interface PostGo {
  idIgraca?: number | undefined;
  idTima?: number | undefined;
  idMeca?: number | undefined;
  minut?: number;
}

"use client"
import { useQueryClient } from '@tanstack/react-query'
import React from "react"
import { Input } from "../ui/input"
import { useSearchStore } from "@/Store/store"
import { usePathname, useRouter } from 'next/navigation'
import { linkovi } from './mainNav'

export function Search() {

  const setSearchParam = useSearchStore((state) => state.setSearchParams)
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const router = useRouter()

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setSearchParam(e.currentTarget.value)
    if (pathname.includes(linkovi[2].url)) {
      queryClient.invalidateQueries(["getTimovi"])
      router.push(linkovi[2].url)

    }
    else if (pathname.includes(linkovi[3].url)) {
      queryClient.invalidateQueries(["getIgraci"])
      router.push(linkovi[3].url)
    }
    else {
      queryClient.invalidateQueries(["getTurnire"])
      router.push(linkovi[1].url)
    }
  }

  return (
    <div>
      <Input
        type="search"
        placeholder="Pretraga..."
        className="md:w-[100px] lg:w-[300px]"
        onChange={handleChange}
      />
    </div>
  )
}


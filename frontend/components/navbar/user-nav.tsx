"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signIn, signOut, useSession } from "next-auth/react"

export function UserNav() {
  const { data: session, status } = useSession()
  return (
    <span>

      {
        status === "authenticated" ?
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session?.picture?.toString()} alt="err" />
                  <AvatarFallback>
                    {(session?.name?.split(' ')[0][0] ?? 'N') + (session?.name?.split(' ')[1][0] ?? 'N')}

                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  {
                    //todo: dodaj linkove za stranice i implementiraj logiku
                  }
                  Moji turniri
                  <DropdownMenuShortcut>⇧+P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Moji igraci
                  <DropdownMenuShortcut>⇧+B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Moji timovi
                  <DropdownMenuShortcut>⇧+S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Odjavite se
                <DropdownMenuShortcut>⇧+Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          :
          <Button variant="ghost" onClick={() => signIn('azure-ad-b2c')}>
            Prijavite se
          </Button>
      }

    </span>
  )
}

import { MainNav } from "./mainNav"
import { MobileNav } from "@/components/navbar/mobile-nav"
import { ThemeToggle } from "./themeToggle"
import { Search } from "./search"
import { UserNav } from "./user-nav"

export function SiteHeader() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none mr-1">
            <Search />
          </div>
          <nav className="flex items-center">
            <ThemeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}

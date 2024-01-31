import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Stats from "@/components/stats";
import { siteConfig } from "@/config/site";
import { IgraciResponseDto } from "./igraci/page";
import { TimoviResponse } from "./timovi/page";

export default async function Home() {

  const igraci = await getIgrace()
  const timovi = await getTimove()

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <Stats igraci={igraci} timovi={timovi} />
      <Features />
      <Footer />
    </main>
  )
}


async function getIgrace(): Promise<IgraciResponseDto[]> {

  let url_ = "https://turniri-api.azurewebsites.net/api/Igraci?searchTerm=&pageSize=4&cursor=0&"
  let options_: RequestInit = {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  };
  const response = await fetch(url_, options_)
  return await response.json() as IgraciResponseDto[];
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
  url_ += "pageSize=" + encodeURIComponent("" + 4) + "&";
  url_ += "cursor=" + encodeURIComponent("" + 0) + "&";


  const response = await fetch(url_, options_)
  return await response.json() as TimoviResponse[];
}

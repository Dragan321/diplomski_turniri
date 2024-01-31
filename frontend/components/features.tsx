import Image from "next/image";


export default function Features() {
    return (
        // TODO:sredi
        <section className="container mb-7 mt-0">
            <div className="bg-slate-50 dark:bg-slate-900 flex flex-col mb-4 pb-4 ">
                <h1 className="text-4xl font-bold lg:text-6xl m-7">
                    Pregled žrijebova
                </h1>
                <Image src={"/1.png"} height={800} width={800} className="m-auto" />
            </div>
            <div className="flex flex-col mb-4 pb-4">
                <h1 className="text-4xl font-bold lg:text-6xl m-7">
                    Pregled rezultata
                </h1>
                <Image src={"/2.png"} height={600} width={600} className="m-auto" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 flex flex-col mb-4 pb-4">
                <h1 className="text-4xl font-bold lg:text-6xl m-7">
                    Pregled statistike timova i igraca
                </h1>
                <Image src={"/3.png"} height={1000} width={1000} className="m-auto" />
            </div>

        </section>
    )

}
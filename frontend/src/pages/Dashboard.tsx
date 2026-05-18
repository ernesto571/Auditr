import { ArrowRight, Camera, Clock, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuthStore } from "../store/AuthStore";

const info = [
    { id:"1", label: "~60s scan", icon:Clock },
    { id:"3", label: "screenshot", icon: Camera},
    { id:"4", label: "ai analysis", icon: Sparkles }
]

export default function Dashboard (){
    const { user } = useAuthStore()

    return (
        <main className="grid grid-cols-6 ">
            <div className="col-span-1" >
                <Sidebar />
            </div>
            
            <div className="col-span-5 w-full " >
                <Topbar pageTitle="dashboard" />
                <section className="bg-cream h-[calc(100vh-50px)] overflow-auto px-6 pt-6 pb-12 ">
                    {/* heading */}
                    <div className="font-jet">
                        <p className="flex gap-2 orange text-[0.7rem] tracking-wider items-center"><p>——</p>  NEW AUDIT</p>
                        <h2 className="font-dm black text-[1.5rem] font-bold mt-0.5">Audit any website.</h2>
                        <p className="gray-1 text-[0.7rem] flex gap-2 mt-1"><p>//</p> UI/UX · performance · SEO · accessibility · conversion — results in ~60s</p>
                    </div>
                    {/* input cont */}
                    <div className="mt-4">
                        <span className="flex justify-between black-bg py-1.5 px-4 gray-1 text-[0.65rem] font-jet tracking-wide">
                            <p>TARGET URL</p>
                            <p>READY</p>
                        </span>

                        <div className="font-jet flex w-full border-t black-bord text-[0.84rem] ">
                            <p className="bg-off gray-1 py-3 px-4 border-x black-bord flex items-center">https://</p>
                            <input type="text" placeholder="domain.com" className="gray-1 pl-6 w-[90%] focus:outline-none focus:text-[#0a0a08] bg-cream"/>
                            <button className="flex gap-2 whitespace-nowrap px-3 items-center white bg-orange border-x black-bord text-[0.8rem]"><ArrowRight className="size-4" /> RUN AUDIT</button>
                        </div>

                        <div className="flex gap-8 border black-bord px-4 py-2 bg-off">
                            { info.map((i) => (
                                <span className="flex gap-2 gray-1  text-[0.7rem] items-center">
                                    <i.icon className="size-4"/>
                                    <p> {i.label} </p>
                                </span>
                            ))}
                        </div>

                        { !user && (
                            <div  className="flex justify-between py-2 bg-[#f2e1d4] px-4 items-center border-x border-b black-bord">
                                <span className="flex gap-1 black font-dm text-[0.75rem] ">Not signed in — <p className="orange font-bold">results won't be saved.</p> Create a free account to keep your audit history.</span>
                                <span className="flex gap-2 font-jet text-[0.7rem]">
                                    <button className="px-3 py-1.5 black-bord border hover:bg-[#0a0a08] hover:text-white transition-colors ease-in-out duration-75 whitespace-nowrap">Sign in</button>
                                    <button className="flex gap-2 bg-orange items-center px-3 py-1.5 text-white transition-all ease-in-out duration-75 whitespace-nowrap" >Sign up free <ArrowRight className="size-3" /> </button>
                                </span>
                            </div>
                        )}
                        
                    </div>
                </section>
            </div>
            
        </main>
    )
}
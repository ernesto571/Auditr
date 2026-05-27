import { FileText, LayoutList, ListChevronsDownUp, User } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useReportStore } from "../store/ReportStore"
import { useEffect } from "react"

export default function Sidebar () {

    const { reports, savedReports, fetchAllReports, fetchSavedReports } = useReportStore()

    const reportLength = reports.length ?? 0;
    const savedLength = savedReports.length ?? 0;
    const sidebarLinks = [
        { id: "1", icon:LayoutList , label: "Dashboard", to:"/", end:true },
        { id: "2", icon: ListChevronsDownUp , label: "History", to:"/history", length:reportLength },
        { id: "3", icon: FileText , label: "Saved Reports", to:"/saved-reports", length: savedLength }
    ]

    useEffect (() => {
        fetchAllReports()
    }, [])

    useEffect (() => {
        fetchSavedReports()
    }, [])

    return (
        <aside className="bg-black h-screen py-4 w-full">
            <main>
                <section className="flex flex-col">
                    {/* logo */}
                    <span className="flex gap-2 pl-3 border-b gray-bord pb-4 items-center">
                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1778904040/Screenshot_2026-05-16_at_04-36-15_Auditr_umkkq7.png" alt="logo" />
                        <h4 className=" font-jet font-bold text-[#f2f0e8] text-[0.9rem]" >AUDITR</h4>
                    </span>

                    <div className="mt-8 px-3 flex flex-col">
                        <span className="font-jet flex gap-1 mb-2 gray-3 text-[0.7rem] font-semibold tracking-wider ml-2">// <p>WORKSPACE</p></span>
                        {sidebarLinks.map( (s) => (
                            <NavLink to={s.to} end={s.end} key={s.id} className={({ isActive }: { isActive: boolean }) => `group flex py-2 px-2 mb-1 justify-between items-center  ${isActive ? "bg-cream black" : "gray-1 hover:border-[#2a2a27] hover:text-[#f2f0e8] hover:border-[0.5px] hover:bg-[#1d1d1a] ease-in-out transform"}`} >
                                {({ isActive }: { isActive: boolean }) => (
                                    <>
                                        <div className="gap-3 flex items-center">
                                            <s.icon size={15}  className={isActive ? "" : "gray-1 group-hover:text-[#f2f0e8]"}/>
                                            <h5 className="font-dm text-[0.9rem] ">{s.label}</h5> 
                                        </div>
                                        { s.length && (<p className="text-[0.60rem] px-1.5 py-[1px] border gray-bord group-hover:border-[rgba(242,240,232,0.21)] " >{s.length} </p>) }
                                        
                                        
                                    </>
                                )}
                            </NavLink>
                            
                        ))}

                        <span className="font-jet flex gap-1 mb-2 gray-3 text-[0.7rem] font-semibold tracking-wider ml-2 mt-4">// <p>ACCOUNT</p></span>
                        <NavLink to={"/profile"} className={({ isActive }: { isActive: boolean }) => `group flex py-2 pl-2 mb-1 gap-3 items-center  ${isActive ? "bg-cream black" : "gray-1 hover:border-[#2a2a27] hover:text-[#f2f0e8] hover:border-[0.5px] hover:bg-[#1d1d1a] ease-in-out transform"}`} >
                            {({ isActive }: { isActive: boolean }) => (
                                <>
                                    <User size={15}  className={isActive ? "" : "gray-1 group-hover:text-[#f2f0e8]"}/>
                                    <h5 className="font-dm text-[0.9rem] ">Profile</h5>
                                </>
                            )}
                        </NavLink>

                    </div>
                </section>
            </main>
        </aside>
    )
}
import { ArrowRight, ArrowUpRight, Camera, Check, Clock, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuthStore } from "../store/AuthStore";
import { useAuditStore } from "../store/AuditStore";
import toast from "react-hot-toast";
import { formatDate, getScoreVerdict, getVerdictStyle, getSeverityStyle } from "../lib/utils";
import { AuditLoader } from "../components/AuditLoader";
import AuthModal from "../components/AuthModal";
import { useState } from "react";

const info = [
    { id:"1", label: "~60s scan", icon:Clock },
    { id:"3", label: "screenshot", icon: Camera},
    { id:"4", label: "ai analysis", icon: Sparkles }
]

const scoreLabel = "gray-1 text-[0.7rem] inline-flex truncate"
const uiLabel = "gray-1 text-[0.7rem] inline-flex truncate w-[250px]"
const ui_notes = ["VISUALL HIERACHY", "READABILITY", "SPACING", "CTA VISIBILITY", "RESPONSIVENESS"]
const con_notes = ["CTA CLARITY", "TRUST SIGNALS", "DISTRACTIONS", "ABOVE FOLD"]

export default function Dashboard (){
    // auth modal
    const [selectedAuthLabel, setSelectedAuthLabel] = useState("");

    const { user } = useAuthStore();
    const { formData, setFormData, runAudit, error, auditRunning, auditReport } = useAuditStore()
    const [ label, className ] = getVerdictStyle(auditReport?.verdict);

    const [uiStyle, uiVerdict, uiVerdictStyle]       = getScoreVerdict(auditReport!.scores.ui_ux);
    const [perfStyle, perfVerdict, perfVerdictStyle]  = getScoreVerdict(auditReport!.scores.performance);
    const [seoStyle, seoVerdict, seoVerdictStyle]     = getScoreVerdict(auditReport!.scores.seo);
    const [a11yStyle, a11yVerdict, a11yVerdictStyle]  = getScoreVerdict(auditReport!.scores.accessibility);
    const [convStyle, convVerdict, convVerdictStyle]  = getScoreVerdict(auditReport!.scores.conversion);
    
    const actionBtn = [
        {id:"1" , label:"EXPORT PDF", action:"", color:"gray-bord border gray-1 hover:bg-[#f2f0e8] hover:text-[#0a0a08]"},
        {id:"2" , label:"EXPORT CSV", action:"", color:"gray-bord border gray-1 hover:bg-[#f2f0e8] hover:text-[#0a0a08]"},
        {id:"3" , label:"SAVE REPORT", action:"", color:"bg-orange white"}
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ [e.target.name]: e.target.value });
    };

    const handleAudit = async () => {
        if (!formData.domain?.trim()) return toast.error("Domain is required.");

        try {
            await runAudit(formData)
            if (error) {
                toast.error(error)
            }
        } catch (err) {
            console.error("Error in handleAudit", err);
            
        }
    }

    return (
        <main className="grid grid-cols-1 lg:grid-cols-6 ">
            <div className="col-span-1 hidden lg:flex" >
                <Sidebar />
            </div>
            
            <div className="md:col-span-5 w-full " >
                <Topbar pageTitle="dashboard" />
                <section className="bg-cream h-[calc(100vh-50px)]  overflow-auto px-3 md:px-6 pt-6 pb-12 ">
                    {/* heading */}
                    <div className="font-jet">
                        <span className="flex gap-2 orange text-[0.7rem] tracking-wider items-center"><p>——</p>  NEW AUDIT</span>
                        <h2 className="font-dm black text-[1.5rem] font-bold mt-0.5">Audit any website.</h2>
                        <p className="gray-1 text-[0.7rem] mt-1">// UI/UX · performance · SEO · accessibility · conversion — results in ~60s </p>
                    </div>
                    {/* input cont */}
                    <div className="mt-4">
                        <span className="flex justify-between black-bg py-1.5 gray-1 px-4 text-[0.65rem] font-jet tracking-wide">
                            <p>TARGET URL</p>
                            
                            <p className="text-[#cd9c20] ">{  auditRunning  ? "SCANNING..." : (formData.domain?.trim() ? "READY TO SCAN" : ( <p className="gray-1">READY</p> ))  }</p>
                            
                        </span>

                        <div className="font-jet flex w-full border-t black-bord text-[0.84rem] ">
                            <p className="bg-off gray-1 py-3 px-2 md:px-4 border-x black-bord flex items-center">https://</p>
                            <input  name="domain" onChange={handleChange} value={formData.domain} type="text" placeholder="domain.com" className="gray-1 pl-3 md:pl-6 w-[90%] focus:outline-none focus:text-[#0a0a08] bg-cream"/>
                            <button onClick={handleAudit} disabled={auditRunning} className="flex gap-2 whitespace-nowrap px-3 items-center white bg-orange border-x black-bord text-[0.8rem] disabled:cursor-not-allowed disabled:opacity-50"><ArrowRight className="size-4" /> RUN AUDIT</button>
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
                            <div  className="grid gap-2.5 md:flex justify-between py-2 bg-[#f2e1d4] px-4 items-center border-x border-b black-bord">
                                <p className="flex-nowrap gap-1 black font-dm text-[0.75rem] ">Not signed in — <strong className="orange font-bold">results won't be saved.</strong> Create a free account to keep your audit history.</p>
                                <span className="flex gap-2 font-jet text-[0.7rem]">
                                    <button onClick={() => setSelectedAuthLabel("sign-in")} className="px-3 py-1.5 black-bord border hover:bg-[#0a0a08] hover:text-white transition-colors ease-in-out duration-75 whitespace-nowrap">Sign in</button>
                                    <button onClick={() => setSelectedAuthLabel("sign-up")} className="flex gap-2 bg-orange items-center px-3 py-1.5 text-white transition-all ease-in-out duration-75 whitespace-nowrap" >Sign up free <ArrowRight className="size-3" /> </button>
                                </span>
                            </div>
                        )}
                        
                    </div>
                    { auditRunning && <AuditLoader isRunning={auditRunning} domain={formData.domain} /> } 
                    {/* report */} 
                    { auditReport && (
                        <section>
                            {/* heading */}
                            <div className="grid gap-2.5 md:flex items-center px-3 md:px-5 black-bg justify-between w-full max-h-[300px] py-3">
                                <span className="flex gap-3 items-center font-jet">
                                    <p className="py-1 px-2 text-xs font-semibold bg-[#1e1e1b] border-gray-500 border white ">{ auditReport?.scan_meta.url.replace(/^https?:\/\//, "").charAt(0).toUpperCase() }</p>
                                    <div>
                                        <h5 onClick={() => window.open(auditReport?.scan_meta.url, "_blank")} className="text-[0.9rem] white hover:underline hover:cursor-pointer">{ auditReport?.scan_meta.url.split("//")[1] }</h5>
                                        { auditReport?.scan_meta?.scanned_at && (<p className="gray-2 text-[0.7rem] mt-1">Scanned {formatDate(auditReport?.scan_meta.scanned_at)} · {auditReport?.scan_meta.scan_time_seconds}s</p>) }
                                        
                                    </div>
                                </span>
                                <span className="flex gap-2">
                                    { actionBtn.map((b) => (
                                        <button key={b.id} className={`${b.color} truncate  text-[0.7rem] font-jet py-1 px-3 tracking-wide`}>{b.label} </button>
                                    )) }
                                </span>
                            </div>
                            {/* summary */}
                            <div className="px-3 md:px-5 py-3 border black-bord ">
                                <h5 className="text-[0.7rem] gray-1 font-jet tracking-wider">SUMMARY</h5>
                                <p className="font-dm  text-[0.8rem] lg:text-sm black-2 mt-1.5">{auditReport.summary} </p>
                            </div>
                            {/* page sc and info */}
                            <span className="grid grid-cols-1 md:grid-cols-3 border-x black-bord">
                                <div className="px-4 py-3 bg-off border-r black-bord">
                                    <h5 className="text-[0.7rem] gray-1 font-jet tracking-wider">PAGE SCREENSHOT</h5>
                                    <img src={auditReport.screenshot_url} alt="screenshot" onClick={() => window.open(auditReport?.screenshot_url, "_blank")} className="h-[200px] w-full mt-1.5 object-cover hover:cursor-pointer hover:opacity-90 " />
                                </div>
                                <div className=" pl-5 font-jet px-3 md:px-4 py-3">
                                    <h5 className="text-[0.7rem] gray-1 font-jet tracking-wider mt-2">OVERALL SCORE</h5>
                                    <span className="flex relative gap-1 ">
                                        <h1 className="black text-[3rem] font-bold">{auditReport.overall_score.toFixed(1) }</h1>
                                        <h5 className="absolute inset-0 left-[7.5rem] tracking-tighter top-[1.7rem] text-gray-500 text-[1.5rem]">/100</h5>
                                    </span>
                                    <span className={className}>{label}</span>
                                    <div className="flex flex-col gap-1 gray-1 text-[0.7rem] mt-4 whitespace-nowrap w-full">
                                        <p>// {auditReport.scan_meta.total_findings} total findings</p>
                                        <p>// {auditReport.scan_meta.high} high · {auditReport.scan_meta.medium} medium · {auditReport.scan_meta.passing} passing</p>
                                        <p>// Scan time: {auditReport.scan_meta.scan_time_seconds}s</p>
                                        <p>// Scanned: {formatDate(auditReport?.scan_meta.scanned_at)}</p>
                                        

                                    </div>
                                </div>
                            </span>
                            {/* scores */}
                            <div className="grid grid-cols-2 md:grid-cols-5 font-jet border black-bord">
                                <div className="px-3 py-4 black-bord border-r">
                                    <p className={`${scoreLabel}`}>UI / UX</p>
                                    <h1 className={`${uiStyle} `}>{auditReport.scores.ui_ux} </h1>
                                    <div className="py-[1px] black-bg"></div>
                                    <p className={`${uiVerdictStyle} `}>{uiVerdict} </p>
                                </div>
                                <div className="px-3 py-4 black-bord border-r">
                                    <p className={`${scoreLabel}`}>PERFORMANCE</p>
                                    <h1 className={`${perfStyle}`}>{auditReport.scores.performance} </h1>
                                    <div className="py-[1px] black-bg"></div>
                                    <p className={`${perfVerdictStyle} `}>{perfVerdict} </p>
                                </div>
                                <div className="px-3 py-4 black-bord border-r">
                                    <p className={`${scoreLabel}`}>SEO</p>
                                    <h1 className={`${seoStyle}`}>{auditReport.scores.seo} </h1>
                                    <div className="py-[1px] black-bg"></div>
                                    <p className={`${seoVerdictStyle} `}>{seoVerdict} </p>
                                </div>
                                <div className="px-3 py-4 black-bord border-r">
                                    <p className={`${scoreLabel}`}>ACCESSIBILITY</p>
                                    <h1 className={`${a11yStyle}`}>{auditReport.scores.accessibility} </h1>
                                    <div className="py-[1px] black-bg"></div>
                                    <p className={`${a11yVerdictStyle} `}>{a11yVerdict} </p>
                                </div>
                                <div className="px-3 py-4">
                                    <p className={`${scoreLabel}`}>CONVERSION</p>
                                    <h1 className={`${convStyle}`}>{auditReport.scores.conversion} </h1>
                                    <div className="py-[1px] black-bg"></div>
                                    <p className={`${convVerdictStyle} `}>{convVerdict} </p>
                                </div>
                            </div>
                            {/* check and fault */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 border-x black-bord font-jet">
                               {/* issues */}
                                <section className="py-3 px-3 md:px-4">
                                    <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center">
                                        <p>ISSUES FOUND</p>
                                        <div className="flex-grow border-t border-[#dfdcd3]"></div>
                                    </span>
                                    <div className="flex flex-col gap-3 mt-3" >
                                        { auditReport.findings.map((f) => {
                                            const style = getSeverityStyle(f.severity)
                                            return (
                                                <span key={f.title} className="grid gap-2 border-[#dfdcd3] border-b py-2">
                                                    <p className={`${style} w-fit`}>{f.severity.toUpperCase()} </p>
                                                    <div className="flex flex-col gap-1">
                                                        <h6 className="text-sm lg:text-[0.9rem] font-dm black font-semibold">{f.title} </h6>
                                                        <p className="text-[0.8rem] font-dm gray-1 ">{f.description} </p>
                                                        <span className="text-xs flex gap-2 text-gray-800 "><ArrowRight className="orange size-5" /> {f.recommendation} </span>
                                                    </div>
                                                </span>
                                            )
                                        } ) }
                                        
                                    </div>
                                    
                                </section>
                                {/* passing */}
                                <section className="py-3 px-3 md:px-4 lg:border-l black-bord">
                                    <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center">
                                        <p>PASSING CHECKS</p>
                                        <div className="flex-grow border-t border-[#dfdcd3]"></div>
                                    </span>
                                    <div className="flex flex-col gap-3 mt-3" >
                                        { auditReport.strengths.map((s) => (
                                            <span key={s} className="flex text-[0.8rem] lg:text-[0.9rem] gap-4 border-[#dfdcd3] border-b font-dm black py-2">
                                                <Check className="size-4 text-[#1a5c35]"/>
                                                {s}
                                            </span>
                                        ) ) }
                                        
                                    </div>
                                    
                                </section>
                            </div>

                            {/* quick */}
                            <section className="py-3 px-4 border black-bord">
                                <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center font-jet">
                                    <p>QUICK WINS -- FIX THESE FIRST</p>
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3 " >
                                    { auditReport.quick_wins.map((q) => (
                                        <span key={q} className="flex gap-2 black-bord border bg-off py-2 px-3 font-dm black text-[0.8rem] md:text-[0.83rem] ">
                                            <ArrowUpRight className="size-4 orange"/>
                                            {q}
                                        </span>
                                    ) ) }
                                    
                                </div>
                                
                            </section>

                            {/* cui/ux */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-x black-bord font-jet">
                               {/* ui */}
                                <section className="py-3 px-4">
                                    <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center mb-3">
                                        <p>UI / UX NOTES</p>
                                        <div className="flex-grow border-t border-[#dfdcd3]"></div>
                                    </span>
                                    <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                                        <p className={uiLabel}>{ui_notes[0]} </p>
                                        <p className="black font-dm text-[0.8rem]">{auditReport.ui_ux_notes.visual_hierarchy}</p>
                                    </span>
                                    <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                                        <p className={uiLabel}>{ui_notes[1]} </p>
                                        <p className="black font-dm text-[0.8rem]">{auditReport.ui_ux_notes.readability}</p>
                                    </span>
                                    <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                                        <p className={uiLabel}>{ui_notes[2]} </p>
                                        <p className="black font-dm text-[0.8rem]">{auditReport.ui_ux_notes.spacing}</p>
                                    </span>
                                    <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                                        <p className={uiLabel}>{ui_notes[3]} </p>
                                        <p className="black font-dm text-[0.8rem]">{auditReport.ui_ux_notes.cta_visibility}</p>
                                    </span>
                                    <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                                        <p className={uiLabel}>{ui_notes[4]} </p>
                                        <p className="black font-dm text-[0.8rem]">{auditReport.ui_ux_notes.responsiveness}</p>
                                    </span>
                                </section>
                                
                                {/* CONVERSION NOTES */}
                                <section className="py-3 px-4 md:border-l black-bord">
                                    <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center mb-3">
                                        <p>CONVERSION NOTES</p>
                                        <div className="flex-grow border-t border-[#dfdcd3]"></div>
                                    </span>
                                    <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                                        <p className={uiLabel}>{con_notes[0]} </p>
                                        <p className="black font-dm text-[0.8rem]">{auditReport.conversion_notes.cta_clarity}</p>
                                    </span>
                                    <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                                        <p className={uiLabel}>{con_notes[1]} </p>
                                        <p className="black font-dm text-[0.8rem]">{auditReport.conversion_notes.trust_signals}</p>
                                    </span>
                                    <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                                        <p className={uiLabel}>{con_notes[2]} </p>
                                        <p className="black font-dm text-[0.8rem]">{auditReport.conversion_notes.distractions}</p>
                                    </span>
                                    <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                                        <p className={uiLabel}>{con_notes[3]} </p>
                                        <p className="black font-dm text-[0.8rem]">{auditReport.conversion_notes.above_fold}</p>
                                    </span>
                                </section>

                            </div>

                            {/* ai key insight */}
                            <div className="border black-bord black-bg py-5 px-4">
                                <span className="font-jet flex gap-3 items-center">
                                    <p className="bg-orange white p-1 text-[0.65rem]">AI</p>
                                    <p className="gray-1 text-xs">KEY INSIGHT</p>
                                </span>
                                <p className="font-dm italic text-[0.8rem] lg:text-[0.9rem] mt-2 white">"{auditReport.key_insight}"</p>
                            </div>
                        </section>
                    ) }
                    
                </section>
            </div>

            { selectedAuthLabel && (
                <AuthModal 
                    onClose={() => setSelectedAuthLabel("")}
                    label={selectedAuthLabel}
                />
            ) }
            
        </main>
    )
}
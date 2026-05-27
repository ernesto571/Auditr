export const formatDate = (date: string | Date ): string => {
    const d = new Date(date);
    const datePart = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timePart = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${datePart} at ${timePart}`;
};
  
  // Lagos user → "Nov 14, 2025 • 10:41"
  // London user → "Nov 14, 2025 • 09:41"

export const getVerdictStyle = (verdict: string | undefined ) => {
    let label;
    let className;
    if ( verdict === "good" ){
        label = "GOOD"
        className = "font-jet text-xs font-semibold px-3 py-1 tracking-widest bg-[rgba(26,92,53,0.08)] border border-[#1a5c35] text-[#1a5c35]"
    } else if ( verdict === "needs_attention" ){
        label = "NEEDS ATTENTION";
        className = "font-jet text-xs font-semibold px-3 py-1 tracking-widest bg-[rgba(138,96,0,0.08)] border border-[#8a6000] text-[#8a6000]"
    } else {
        label = "CRITICAL"
        className= "font-jet text-xs font-semibold px-3 py-1 tracking-widest bg-[rgba(192,57,43,0.1)] border border-[#c0392b] text-[#c0392b]"
    }

    return [label, className];
};

export const getScoreVerdict = ( score: number ) => {
    let scoreStyle;
    let verdict;
    let verdictStyle;

    if (score < 70) {
        scoreStyle = "orange font-bold text-[2rem]"
        verdict = "CRITICAL"
        verdictStyle = "bg-[#f2e1d4] border border-[#f4b49a] orange py-0.5 px-3 text-[0.7rem] tracking-tight mt-3 inline-flex"
    } else if ( score > 69 && score <85) {
        scoreStyle = "text-[#8a6000] font-bold text-[2rem]"
        verdict = "REVIEW"
        verdictStyle = "bg-[rgba(138,96,0,0.08)] border border-[#8a6000] text-[#8a6000] py-0.5 px-3 text-[0.7rem] tracking-tight mt-3 inline-flex"
    } else {
        scoreStyle = "text-[#1a5c35] font-bold text-[2rem]"
        verdict = "PASS"
        verdictStyle = "bg-[rgba(26,92,53,0.08)] border border-[#1a5c35] text-[#1a5c35] py-0.5 px-3 text-[0.7rem] tracking-tight mt-3 inline-flex"
    }

    return [scoreStyle, verdict, verdictStyle]
}

export const getSeverityStyle = ( severity: string ) => {
    let severityStyle;

    if (severity == "high") {
        severityStyle = "bg-[#f2e1d4] border border-[#f4b49a] orange py-0.5 px-3 text-[0.7rem] tracking-tight mt-3 inline-flex h-fit"

    } else {
        severityStyle = "bg-[rgba(138,96,0,0.08)] border border-[#8a6000] text-[#8a6000] py-0.5 px-3 text-[0.7rem] tracking-tight mt-3 inline-flex h-fit"
    }

    return severityStyle
}
 
export const getScoreStyle = ( score: number ) => {
    let scoreStyle;

    if (score < 70) {
        scoreStyle = "orange font-bold "
    } else if ( score > 69 && score <85) {
        scoreStyle = "text-[#8a6000] font-bold "
    } else {
        scoreStyle = "text-[#1a5c35] font-bold "
    }

    return scoreStyle
}
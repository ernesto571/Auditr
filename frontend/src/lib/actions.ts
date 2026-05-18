import jsPDF from "jspdf";
import toast from "react-hot-toast";

interface Analysis {
    contract_type: string;
    contract_type_short: string;
    contract_type_description: string;
    ai_summary: string;
    key_points: { text: string; type: string }[];
    red_flags: { title: string; location: string; severity: string; description: string }[];
    sections: { title: string; status: string; summary: string }[];
    meta: { analysis_time_seconds: number; document_pages: number | null; flag_count: number; tone: string };
}

export const handleCopy = (analysis: Analysis) => {
    const clean = (text: string) => text.replace(/<[^>]*>/g, "");

    const keyPoints = analysis.key_points.map((k) => `- ${k.text}`).join("\n");
    const redFlags = analysis.red_flags.map((r) => `[!] ${r.title} (${r.location})\n${r.description}`).join("\n\n");
    const sections = analysis.sections.map((s) => `${s.title} [${s.status.toUpperCase()}]\n${s.summary}`).join("\n\n");

    const fullText = `
        CLARIFY AI - ANALYSIS REPORT
        ${analysis.contract_type_description}

        AI SUMMARY
        ${clean(analysis.ai_summary)}

        KEY POINTS
        ${keyPoints}

        RED FLAGS
        ${redFlags}

        SECTION BREAKDOWN
        ${sections}

        META
        Analysis time: ${analysis.meta.analysis_time_seconds}s | Tone: ${analysis.meta.tone} | Flags: ${analysis.meta.flag_count}
    `.trim();

    navigator.clipboard.writeText(fullText).then(() => {
        toast.success("Copied to clipboard");
    });
};


export const handleExportPDF = (analysis: Analysis) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const addText = (text: string, size = 10, bold = false, color: [number, number, number] = [60, 60, 60]) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, maxWidth);
        if (y + lines.length * 7 > 280) { doc.addPage(); y = 20; }
        doc.text(lines, margin, y);
        y += lines.length * 7 + 3;
    };

    const addGap = (n = 5) => { y += n; };
    const clean = (text: string) => text.replace(/<[^>]*>/g, "").replace(/[^\x00-\x7F]/g, "");

    addText("CLARIFY AI - ANALYSIS REPORT", 14, true, [0, 0, 0]);
    addText(analysis.contract_type_description, 10, false, [120, 120, 120]);
    addGap();

    addText("AI SUMMARY", 9, true, [150, 150, 150]);
    addText(clean(analysis.ai_summary), 10);
    addGap();

    addText("KEY POINTS", 9, true, [150, 150, 150]);
    analysis.key_points.forEach((k) => addText(`- ${clean(k.text)}`, 10));
    addGap();

    addText("RED FLAGS", 9, true, [150, 150, 150]);
    analysis.red_flags.forEach((r) => {
        addText(`[!] ${clean(r.title)} - ${r.location}`, 10, true, [180, 40, 40]);
        addText(clean(r.description), 10);
        addGap(2);
    });
    addGap();

    addText("SECTION BREAKDOWN", 9, true, [150, 150, 150]);
    analysis.sections.forEach((s) => {
        addText(`${clean(s.title)} [${s.status.toUpperCase()}]`, 10, true);
        addText(clean(s.summary), 10);
        addGap(2);
    });
    addGap();

    addText("META", 9, true, [150, 150, 150]);
    addText(`Analysis time: ${analysis.meta.analysis_time_seconds}s  |  Tone: ${analysis.meta.tone}  |  Flags: ${analysis.meta.flag_count}`, 10);

    doc.save(`${analysis.contract_type_short || "analysis"}_clarify.pdf`);
};
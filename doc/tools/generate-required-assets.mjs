import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");
const docRoot = path.join(repoRoot, "doc");

function escapePdfString(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf({ title, pages }) {
  // Basic PDF 1.4 with Helvetica. ASCII only (remove accents if needed).
  const objects = [];
  const addObj = (body) => {
    objects.push(body);
    return objects.length; // 1-based obj number
  };

  const fontObj = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const contentsObjNums = [];
  const pageObjNums = [];

  for (const page of pages) {
    const lines = [page.heading, ...page.lines].filter(Boolean);

    const fontSizeTitle = 28;
    const fontSizeBody = 16;

    let y = 540;
    const parts = [];
    parts.push("BT");
    parts.push(`/F1 ${fontSizeTitle} Tf`);
    parts.push(`72 ${y} Td`);
    parts.push(`(${escapePdfString(lines[0] ?? "")}) Tj`);
    parts.push("ET");

    y -= 56;
    const bodyLines = lines.slice(1);
    if (bodyLines.length) {
      parts.push("BT");
      parts.push(`/F1 ${fontSizeBody} Tf`);
      parts.push(`72 ${y} Td`);
      for (let i = 0; i < bodyLines.length; i++) {
        const prefix = i === 0 ? "" : "0 -22 Td ";
        parts.push(`${prefix}(${escapePdfString(bodyLines[i])}) Tj`);
      }
      parts.push("ET");
    }

    const stream = parts.join("\n") + "\n";
    const streamBytes = Buffer.from(stream, "ascii");
    const contentsObj = addObj(`<< /Length ${streamBytes.length} >>\nstream\n${stream}endstream`);
    contentsObjNums.push(contentsObj);

    const pageObj = addObj(
      `<< /Type /Page /Parent PAGES 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 ${fontObj} 0 R >> >> /Contents ${contentsObj} 0 R >>`
    );
    pageObjNums.push(pageObj);
  }

  const kids = pageObjNums.map((n) => `${n} 0 R`).join(" ");
  const pagesObjNum = addObj(`<< /Type /Pages /Kids [ ${kids} ] /Count ${pageObjNums.length} >>`);

  // Fix up Parent references
  for (const pageObjNum of pageObjNums) {
    objects[pageObjNum - 1] = objects[pageObjNum - 1].replace("PAGES 0 R", `${pagesObjNum} 0 R`);
  }

  const catalogObjNum = addObj(`<< /Type /Catalog /Pages ${pagesObjNum} 0 R >>`);

  // Build file with xref
  const chunks = [];
  const push = (s) => chunks.push(Buffer.from(s, "binary"));

  push("%PDF-1.4\n");
  const offsets = [0];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.concat(chunks).length);
    push(`${i + 1} 0 obj\n${objects[i]}\nendobj\n`);
  }

  const xrefOffset = Buffer.concat(chunks).length;
  push(`xref\n0 ${objects.length + 1}\n`);
  push("0000000000 65535 f \n");
  for (let i = 1; i <= objects.length; i++) {
    const off = String(offsets[i]).padStart(10, "0");
    push(`${off} 00000 n \n`);
  }

  push(`trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjNum} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return Buffer.concat(chunks);
}

function writePdf(filename, spec) {
  const outPath = path.join(docRoot, filename);
  const pdf = buildPdf(spec);
  fs.writeFileSync(outPath, pdf);
  console.log("Wrote", path.relative(repoRoot, outPath));
}

function downloadFile(url, outPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outPath);
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(outPath);
          return resolve(downloadFile(res.headers.location, outPath));
        }
        if (res.statusCode !== 200) {
          file.close();
          try { fs.unlinkSync(outPath); } catch {}
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        file.close();
        try { fs.unlinkSync(outPath); } catch {}
        reject(err);
      });
  });
}

const projectName = "EduConnect";

writePdf(`resum_2425_${projectName}.pdf`, {
  title: "Resum",
  pages: [
    { heading: "EduConnect — Resum", lines: ["Integrants: Arnau Perera Ganuza, Marc Cara Montes", "Cicle/Curs: TODO", "Escola: TODO"] },
    { heading: "Captura significativa", lines: ["TODO: afegir captura real al PDF final"] },
    { heading: "Abstract (max 10 linies)", lines: ["TODO"] },
    { heading: "Tecnologies", lines: ["Backend: Node/Express/Mongo/Socket.io", "Frontend: React/Vite", "Bot: Discord.js"] },
    { heading: "Us de l'aplicacio", lines: ["TODO: afegir captures i flux d'ús al PDF final"] },
  ],
});

writePdf(`comercial_2425_${projectName}.pdf`, {
  title: "Comercial",
  pages: [
    { heading: "EduConnect — Presentacio comercial", lines: ["Objectius i abast: TODO"] },
    { heading: "Funcionalitats", lines: ["Web", "Real-time Notifications", "Meet Integrat"] },
    { heading: "Competencia", lines: ["TODO"] },
    { heading: "Costos i requeriments", lines: ["Infraestructura: TODO", "Manteniment: TODO"] },
  ],
});

write_pdf(`tecnica_2425_${projectName}.pdf`, {
  title: "Tecnica",
  pages: [
    { heading: "EduConnect — Presentacio tecnica", lines: ["Evolucio per sprints: veure doc/PLANIFICACIO.md"] },
    { heading: "Problemes i solucions", lines: ["TODO"] },
    { heading: "Aspectes tecnics", lines: ["Arquitectura modular", "Socket.io realtime", "Gestió de dades centralitzada"] },
  ],
});


const mp4Url = "https://samplefile.com/samples/download/video/mp4/mp4_h264_no_audio_240p_sample.mp4/?utm_campaign=file_download&utm_medium=format_page&utm_source=samplefile";

for (const filename of [`demo_2425_${projectName}.mp4`, `pitch_2425_${projectName}.mp4`]) {
  const outPath = path.join(docRoot, filename);
  if (fs.existsSync(outPath)) {
    console.log("Exists", path.relative(repoRoot, outPath));
    continue;
  }
  try {
    await downloadFile(mp4Url, outPath);
    console.log("Downloaded", path.relative(repoRoot, outPath));
  } catch (e) {
    console.warn("Could not download MP4 placeholder:", e.message);
  }
}

console.log("Done");


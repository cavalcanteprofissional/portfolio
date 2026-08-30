import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { formatBRL } from './pricing';
import type { LineItem } from './pricing';
import type { QuoteRequest } from './types';

const PRIMARY = rgb(0.13, 0.15, 0.28);   // dark indigo
const MUTED = rgb(0.45, 0.45, 0.5);
const LINE = rgb(0.85, 0.85, 0.88);

export async function buildQuotePdf(params: {
  codigo: string;
  nome: string;
  email: string;
  whatsapp?: string | null;
  cpfCnpj?: string | null;
  lines: LineItem[];
  subtotal: number;
  urgenciaFactor: number;
  urgenciaLabel: string;
  total: number;
  descricao?: string | null;
  lang: 'pt' | 'en' | 'es';
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([595, 842]); // A4 portrait
  const { width, height } = page.getSize();
  const margin = 48;
  let y = height - margin;

  const write = (
    text: string,
    opts: { x?: number; size?: number; color?: ReturnType<typeof rgb>; bold?: boolean } = {},
  ) => {
    const f = opts.bold ? bold : font;
    page.drawText(text, {
      x: opts.x ?? margin,
      y,
      size: opts.size ?? 12,
      font: f,
      color: opts.color ?? PRIMARY,
    });
  };

  // Title
  write('ORCAMENTO', { size: 26, bold: true });
  y -= 18;
  write(params.nome, { size: 13, color: MUTED });
  y -= 28;

  // Meta
  write(`Codigo: ${params.codigo}`, { size: 11, color: PRIMARY, bold: true });
  y -= 16;
  write(`Cliente: ${params.nome}`, { size: 11, color: MUTED });
  y -= 14;
  write(`Email: ${params.email}`, { size: 11, color: MUTED });
  if (params.whatsapp) {
    y -= 14;
    write(`WhatsApp: ${params.whatsapp}`, { size: 11, color: MUTED });
  }
  if (params.cpfCnpj) {
    y -= 14;
    write(`CPF/CNPJ: ${params.cpfCnpj}`, { size: 11, color: MUTED });
  }
  y -= 24;

  // Header row
  write('Item', { bold: true, size: 11 });
  write('Qtd', { x: width - margin - 60, bold: true, size: 11 });
  write('Valor', { x: width - margin - 160, bold: true, size: 11 });
  y -= 12;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: LINE });
  y -= 18;

  for (const l of params.lines) {
    write(l.name, { size: 11 });
    write(String(l.qtd), { x: width - margin - 60, size: 11 });
    write(formatBRL(l.subtotal), { x: width - margin - 160, size: 11 });
    y -= 18;
  }

  y -= 8;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: LINE });
  y -= 18;

  write(`Subtotal: ${formatBRL(params.subtotal)}`, { size: 11, x: width - margin - 200 });
  y -= 16;
  write(`Urgencia (${params.urgenciaLabel} x${params.urgenciaFactor.toFixed(1)}): ${formatBRL(params.subtotal * (params.urgenciaFactor - 1))}`, { size: 11, x: width - margin - 200, color: MUTED });
  y -= 20;
  write(`TOTAL: ${formatBRL(params.total)}`, { size: 15, bold: true, x: width - margin - 200 });
  y -= 28;

  if (params.descricao) {
    write('Observacoes:', { bold: true, size: 11 });
    y -= 16;
    write(params.descricao, { size: 10, color: MUTED });
    y -= 20;
  }

  // Footer
  const footerY = 40;
  page.drawLine({ start: { x: margin, y: footerY + 16 }, end: { x: width - margin, y: footerY + 16 }, thickness: 1, color: LINE });
  page.drawText('Lucas Cavalcante - Analista de Dados & IA', {
    x: margin,
    y: footerY,
    size: 9,
    font,
    color: MUTED,
  });

  return doc.save();
}

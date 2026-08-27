import { Resend } from 'resend';
import { formatBRL } from './pricing';
import type { LineItem } from './pricing';
import type { OrcamentoRow } from './types';

type NoticeOrcamento = Pick<
  OrcamentoRow,
  'codigo' | 'nome' | 'email' | 'whatsapp' | 'status' | 'valor'
>;

type SendParams = {
  to: string;
  subject: string;
  html: string;
  attachmentName?: string;
  attachmentData?: Uint8Array;
};

export async function sendEmail(
  apiKey: string,
  from: string,
  p: SendParams,
): Promise<void> {
  const resend = new Resend(apiKey);

  const resp = await resend.emails.send({
    from,
    to: [p.to],
    subject: p.subject,
    html: p.html,
    attachments: p.attachmentData
      ? [{ filename: p.attachmentName ?? 'orcamento.pdf', content: p.attachmentData }]
      : undefined,
  });

  if (resp.error) throw new Error(`Resend: ${resp.error.message}`);
}

export function buildClientEmail(p: {
  orcamento: OrcamentoRow;
  lines: LineItem[];
  lang: 'pt' | 'en' | 'es';
}): SendParams {
  const rows = p.lines
    .map((l) => `<tr><td>${l.name}</td><td>${l.qtd}</td><td>${formatBRL(l.subtotal)}</td></tr>`)
    .join('');
  return {
    to: p.orcamento.email,
    subject: `Seu orcamento ${p.orcamento.codigo}`,
    html: `
      <h2>Ola, ${p.orcamento.nome}!</h2>
      <p>Seu orcamento <b>${p.orcamento.codigo}</b> foi confirmado.</p>
      <table cellspacing=8>
        <tr><th align=left>Item</th><th align=left>Qtd</th><th align=left>Valor</th></tr>
        ${rows}
      </table>
      <p><b>Total: ${formatBRL(p.orcamento.valor)}</b></p>
      <p>Em anexo, o PDF com os detalhes.</p>`,
    attachmentName: `orcamento-${p.orcamento.codigo}.pdf`,
  };
}

export function buildOwnerNotice(p: {
  orcamento: NoticeOrcamento;
}): SendParams {
  return {
    to: '', // substituido no caller com OWNER_EMAIL
    subject: `Novo orcamento ${p.orcamento.codigo} (${p.orcamento.status})`,
    html: `
      <h2>Novo orcamento</h2>
      <p><b>Codigo:</b> ${p.orcamento.codigo}</p>
      <p><b>Cliente:</b> ${p.orcamento.nome} (${p.orcamento.email}${p.orcamento.whatsapp ? ` / ${p.orcamento.whatsapp}` : ''})</p>
      <p><b>Status:</b> ${p.orcamento.status}</p>
      <p><b>Valor:</b> ${formatBRL(p.orcamento.valor)}</p>`,
  };
}

import { formatBRL } from './pricing';
import type { LineItem } from './pricing';
import type { OrcamentoRow } from './types';

type NoticeOrcamento = Pick<
  OrcamentoRow,
  'codigo' | 'nome' | 'email' | 'whatsapp' | 'cpf_cnpj' | 'status' | 'valor'
>;

type SendParams = {
  from: string;
  fromName?: string;
  to: string;
  subject: string;
  html: string;
  attachmentName?: string;
  attachmentData?: Uint8Array;
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function sendEmail(
  apiKey: string,
  from: string,
  p: SendParams,
): Promise<void> {
  const [senderEmail, senderName] = from.includes('<')
    ? (() => {
        const m = /^(.*?)<([^>]+)>$/.exec(from);
        return m ? [m[2], m[1].trim()] : [from, undefined];
      })()
    : [from, p.fromName];

  const body: Record<string, unknown> = {
    sender: senderName ? { email: senderEmail, name: senderName } : { email: senderEmail },
    to: [{ email: p.to }],
    subject: p.subject,
    htmlContent: p.html,
  };

  if (p.attachmentData && p.attachmentName) {
    body.attachment = [
      { content: bytesToBase64(p.attachmentData), name: p.attachmentName },
    ];
  }

  const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Brevo: ${resp.status} ${errText.slice(0, 200)}`);
  }
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
    from: '',
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
    from: '',
    to: '',
    subject: `Novo orcamento ${p.orcamento.codigo} (${p.orcamento.status})`,
    html: `
      <h2>Novo orcamento</h2>
      <p><b>Codigo:</b> ${p.orcamento.codigo}</p>
      <p><b>Cliente:</b> ${p.orcamento.nome} (${p.orcamento.email}${p.orcamento.whatsapp ? ` / ${p.orcamento.whatsapp}` : ''}${p.orcamento.cpf_cnpj ? ` / ${p.orcamento.cpf_cnpj}` : ''})</p>
      <p><b>Status:</b> ${p.orcamento.status}</p>
      <p><b>Valor:</b> ${formatBRL(p.orcamento.valor)}</p>`,
  };
}

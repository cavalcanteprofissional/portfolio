import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, RefreshCw, Check, X, LogIn, ShieldAlert } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';
import { adminListOrcamentos, adminAprovar, type AdminOrcamento } from '../lib/api';
import { formatBRL } from '../lib/pricing';

export function Admin() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [rows, setRows] = useState<AdminOrcamento[]>([]);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const supabase = useMemo(() => {
    try {
      return getSupabaseClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (session) {
        setSessionUser(session.user.email ?? null);
        setToken(session.access_token);
      }
    });
  }, [supabase]);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!supabase) {
      setError(t('admin.notConfigured'));
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err || !data.session) {
      setError(err?.message ?? t('admin.loginError'));
      return;
    }
    setSessionUser(data.session.user.email ?? null);
    setToken(data.session.access_token);
  }

  async function doLogout() {
    await supabase?.auth.signOut();
    setSessionUser(null);
    setToken(null);
    setRows([]);
  }

  async function load() {
    if (!token) return;
    setBusy(true);
    setActionError(null);
    try {
      setRows(await adminListOrcamentos(token));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Erro');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function setStatus(codigo: string, status: 'APROVADO' | 'RECUSADO') {
    if (!token) return;
    setBusy(true);
    setActionError(null);
    try {
      await adminAprovar(token, codigo, status);
      await load();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Erro');
    } finally {
      setBusy(false);
    }
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-red-500" />
          <p className="text-muted-foreground">{t('admin.notConfigured')}</p>
        </div>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <form onSubmit={doLogin} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center gap-2 text-lg font-bold">
            <LogIn className="w-5 h-5" />
            {t('admin.loginTitle')}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t('quote.email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:border-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t('admin.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:border-primary/50" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {loading ? '…' : t('admin.login')}
          </button>
        </form>
      </div>
    );
  }

  const pending = rows.filter((r) => r.status === 'PENDENTE');

  return (
    <div className="min-h-screen px-4 py-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{sessionUser}</span>
          <button onClick={load} disabled={busy} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-secondary">
            <RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} />
            {t('admin.refresh')}
          </button>
          <button onClick={doLogout} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-secondary">
            <LogOut className="w-4 h-4" />
            {t('admin.logout')}
          </button>
        </div>
      </div>

      {actionError && <p className="text-sm text-red-500 mb-4">{actionError}</p>}

      <div className="mb-4 text-sm text-muted-foreground">
        {t('admin.pendingCount', { count: pending.length })}
      </div>

      <div className="space-y-4">
        {rows.length === 0 && !busy && (
          <div className="rounded-2xl border border-border p-8 text-center text-muted-foreground">{t('admin.empty')}</div>
        )}

        {rows.map((row) => (
          <div key={row.codigo} className="rounded-2xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold">{row.codigo}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    row.status === 'PENDENTE' ? 'bg-amber-500/15 text-amber-500'
                    : row.status === 'APROVADO' ? 'bg-emerald-500/15 text-emerald-500'
                    : 'bg-red-500/15 text-red-500'
                  }`}
                >
                  {row.status}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {row.nome} · {row.email}
                {row.whatsapp ? ` · ${row.whatsapp}` : ''}
                {row.cpf_cnpj ? ` · ${row.cpf_cnpj}` : ''}
              </div>
              <div className="text-sm text-muted-foreground">
                {row.itens.map((i) => i.slug).join(', ')} · {new Date(row.created_at).toLocaleString()}
              </div>
              <div className="font-bold text-lg">{formatBRL(row.valor)}</div>
            </div>

            {row.status === 'PENDENTE' && (
              <div className="flex gap-2">
                <button onClick={() => setStatus(row.codigo, 'APROVADO')} disabled={busy} className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60">
                  <Check className="w-4 h-4" />
                  {t('admin.approve')}
                </button>
                <button onClick={() => setStatus(row.codigo, 'RECUSADO')} disabled={busy} className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-500 disabled:opacity-60">
                  <X className="w-4 h-4" />
                  {t('admin.reject')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

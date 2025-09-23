import { Commitment } from '../types/commitment';


const API_BASE = import.meta.env.VITE_API_BASE || '';
const withBase = (p: string) => `${API_BASE}${p}`;


function qs(params: Record<string, any> = {}) {
const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null);
return entries.length ? `?${new URLSearchParams(entries as any).toString()}` : '';
}


async function json<T>(res: Response): Promise<T> { if (!res.ok) throw new Error(await res.text()); return res.json(); }


export async function fetchCommitments(params: Record<string, any> = {}): Promise<Commitment[]> {
return json(await fetch(withBase(`/commitments${qs(params)}`), { credentials: 'include' }));
}


export async function createCommitment(payload: Partial<Commitment>): Promise<Commitment> {
return json(
await fetch(withBase('/commitments'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' })
);
}


export async function updateCommitment(id: string, payload: Partial<Commitment>): Promise<Commitment> {
return json(
await fetch(withBase(`/commitments/${id}`), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' })
);
}


export async function completeCommitment(id: string): Promise<Commitment> {
return json(await fetch(withBase(`/commitments/${id}/complete`), { method: 'PATCH', credentials: 'include' }));
}


export async function deleteCommitment(id: string): Promise<void> {
const res = await fetch(withBase(`/commitments/${id}`), { method: 'DELETE', credentials: 'include' });
if (!res.ok) throw new Error(await res.text());
}

export async function downloadReport(params: Record<string, any> = {}) {
  const res = await fetch(`${API_BASE}/commitments/report${qs(params)}`, { credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}
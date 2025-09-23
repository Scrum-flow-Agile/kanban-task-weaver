export const toLocal = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '');
export const hoursUntil = (iso?: string) => {
if (!iso) return Infinity; const ms = new Date(iso).getTime() - Date.now(); return ms / 36e5;
};
export const isOverdue = (iso?: string) => hoursUntil(iso) < 0;
export const toInputLocal = (iso?: string) => {
const d = iso ? new Date(iso) : new Date();
const off = d.getTimezoneOffset();
const local = new Date(d.getTime() - off * 60000);
return local.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
};
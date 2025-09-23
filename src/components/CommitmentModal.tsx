import React, { useEffect, useState } from 'react';
import { Commitment, Priority, Status } from '../types/commitment';
import { toInputLocal } from '../lib/date';


interface Props {
open: boolean;
onClose: () => void;
onSave: (payload: Partial<Commitment>) => Promise<void>;
initial?: Partial<Commitment>;
users?: { id: string; name: string }[];
canEdit?: boolean; // lock window enforcement
}


export default function CommitmentModal({ open, onClose, onSave, initial = {}, users = [], canEdit = true }: Props) {
const [title, setTitle] = useState('');
const [dueDate, setDueDate] = useState<string>('');
const [assigneeId, setAssigneeId] = useState<string>('');
const [priority, setPriority] = useState<Priority>('Medium');
const [status, setStatus] = useState<Status>('Not Started');
const [linkedTaskId, setLinkedTaskId] = useState<string>('');
const [saving, setSaving] = useState(false);


useEffect(() => {
if (open) {
setTitle(initial.title || '');
setPriority((initial.priority as Priority) || 'Medium');
setStatus((initial.status as Status) || 'Not Started');
setAssigneeId((initial.assigneeId as string) || '');
setLinkedTaskId((initial.linkedTaskId as string) || '');
setDueDate(toInputLocal(initial.dueDate));
}
}, [open, initial]);


const submit = async () => {
setSaving(true);
await onSave({ title, dueDate: new Date(dueDate).toISOString(), assigneeId: assigneeId || undefined, priority, status, linkedTaskId: linkedTaskId || undefined });
setSaving(false);
onClose();
};


if (!open) return null;
return (
<div className="modal-backdrop" onClick={onClose}>
<div className="modal" onClick={(e) => e.stopPropagation()}>
<h3>{initial?.id ? 'Edit Commitment' : 'Add Commitment'}</h3>
<div className="form">
<label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} disabled={!canEdit} /></label>
<label>Due Date<input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={!canEdit} /></label>
<label>Assignee<select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} disabled={!canEdit}>
<option value="">—</option>
{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
</select></label>
<label>Linked Task ID<input value={linkedTaskId} onChange={(e) => setLinkedTaskId(e.target.value)} disabled={!canEdit} /></label>
<label>Priority<select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} disabled={!canEdit}>
<option>High</option><option>Medium</option><option>Low</option>
</select></label>
<label>Status<select value={status} onChange={(e) => setStatus(e.target.value as Status)} disabled={!canEdit}>
<option>Not Started</option><option>In Progress</option><option>Completed</option>
</select></label>
</div>
<div className="actions">
<button onClick={onClose} className="btn secondary">Cancel</button>
<button onClick={submit} className="btn primary" disabled={saving || !canEdit}>Save</button>
</div>
</div>
</div>
);
}
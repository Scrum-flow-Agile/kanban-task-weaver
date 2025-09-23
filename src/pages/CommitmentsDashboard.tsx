import React, { useCallback, useEffect, useState } from 'react';
import { Commitment } from '../types/commitment';
import { fetchCommitments, createCommitment, updateCommitment, completeCommitment } from '../lib/commitments';
import CommitmentList from '../components/CommitmentList';
import CommitmentModal from '../components/CommitmentModal';
import FiltersBar from '../components/FiltersBar';
import useSocket from '../hooks/useSocket';
import { isOverdue, hoursUntil} from '../lib/date';


const TABS = ['All','Upcoming','Due Today','Completed','Archived'] as const;
type Tab = typeof TABS[number];


export default function CommitmentsDashboard() {
const [tab,setTab] = useState<Tab>('All');
const [items,setItems] = useState<Commitment[]>([]);
const [editing,setEditing] = useState<Commitment|null>(null);

const load = useCallback(async () => {
const params:any = {};
if (tab==='Upcoming') params.upcoming=true;
if (tab==='Due Today') params.dueToday=true;
if (tab==='Completed') params.status='Completed';
if (tab==='Archived') params.archived=true;
const data = await fetchCommitments(params);
setItems(data);
},[tab]);


useEffect(()=>{ load(); },[load]);


const onSocket = useCallback((type:string,payload:any)=>{
setItems(prev=>{
if(type==='created') return [payload,...prev];
if(type==='updated'||type==='completed') return prev.map(p=>p.id===payload.id?payload:p);
if(type==='deleted') return prev.filter(p=>p.id!==payload.id);
if(type==='archived') return prev.map(p=>p.id===payload.id?payload:p);
return prev;
});
},[]);
useSocket(onSocket);

const handleCreate = async ()=>{
const dto={title:'New Commitment',dueDate:new Date().toISOString(),priority:'Medium' as const};
await createCommitment(dto); load();
};


const handleEdit = (c:Commitment)=> setEditing(c);
const saveEdit = async ()=>{
if(editing){ await updateCommitment(editing.id,editing); setEditing(null); load(); }
};


const handleToggle = async (c:Commitment)=>{ await completeCommitment(c.id); };

const handleDelete = async (c: Commitment) => {
  // You may want to call an API to delete the commitment here
  // For now, just remove it from the list
  setItems(prev => prev.filter(item => item.id !== c.id));
};




return (
<div className="commitments-sidebar">
<h2>Commitments</h2>
<div className="tabs">
{TABS.map(t=>(
<button key={t} onClick={()=>setTab(t)} className={t===tab?"active":''}>{t}</button>
))}
</div>


<div className="actions">
<button className="add-btn" onClick={handleCreate}>+ Add Commitment</button>
</div>


<CommitmentList items={items} onToggleComplete={handleToggle} onOpen={handleEdit} onDelete={handleDelete} />


{editing && (
<div className="modal">
<div className="modal-content">
<h3>Edit Commitment</h3>
<input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} />
<input type="datetime-local" value={editing.dueDate.slice(0,16)} onChange={e=>setEditing({...editing,dueDate:e.target.value})} />
<select value={editing.priority} onChange={e=>setEditing({...editing,priority:e.target.value as any})}>
<option>High</option><option>Medium</option><option>Low</option>
</select>
<select value={editing.status} onChange={e=>setEditing({...editing,status:e.target.value as any})}>
<option>Not Started</option><option>In Progress</option><option>Completed</option>
</select>
<div className="modal-actions">
<button onClick={saveEdit}>Save</button>
<button onClick={()=>setEditing(null)}>Cancel</button>
</div>
</div>
</div>
)}
</div>
);
}
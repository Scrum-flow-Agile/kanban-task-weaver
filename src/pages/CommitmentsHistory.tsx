import React, { useEffect, useState } from 'react';
import { Commitment } from '../types/commitment';
import { fetchCommitments } from '../lib/commitments';

export default function CommitmentsHistory() {
  const [items, setItems] = useState<Commitment[]>([]);
  const [filters, setFilters] = useState({ status: 'Completed' });
  useEffect(() => { (async () => setItems(await fetchCommitments(filters)))(); }, [filters]);

  return (
    <div className="page">
      <h2>Completed History</h2>
      <div className="table">
        <div className="t-head">
          <div>Title</div><div>Assignee</div><div>Priority</div><div>Completed At</div>
        </div>
        {items.map(i => (
          <div className="t-row" key={i.id}>
            <div>{i.title}</div>
            <div>{i.assignee?.name || '—'}</div>
            <div>{i.priority}</div>
            <div>{new Date(i.updatedAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
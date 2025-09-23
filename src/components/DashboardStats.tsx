import React, { useMemo } from 'react';
import { Commitment } from '../types/commitment';

export default function DashboardStats({ items }: { items: Commitment[] }) {
  const { total, completed, pending, overdue } = useMemo(() => {
    const total = items.length;
    const completed = items.filter(i => i.status === 'Completed').length;
    const now = Date.now();
    const overdue = items.filter(i => i.status !== 'Completed' && new Date(i.dueDate).getTime() < now).length;
    const pending = total - completed;
    return { total, completed, pending, overdue };
  }, [items]);

  return (
    <div className="stats">
      <div className="card"><div className="h">Total</div><div className="v">{total}</div></div>
      <div className="card"><div className="h">Completed</div><div className="v green">{completed}</div></div>
      <div className="card"><div className="h">Pending</div><div className="v">{pending}</div></div>
      <div className="card"><div className="h">Overdue</div><div className="v red">{overdue}</div></div>
    </div>
  );
}
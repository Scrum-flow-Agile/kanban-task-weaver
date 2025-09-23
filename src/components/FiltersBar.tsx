import React from 'react';

type Props = {
  value: Record<string, any>;
  onChange: (v: Record<string, any>) => void;
};

export default function FiltersBar({ value, onChange }: Props) {
  const set = (k: string, v: any) => onChange({ ...value, [k]: v });
  const clear = () => onChange({});

  return (
    <div className="filters">
      <input placeholder="Search title…" value={value.q || ''} onChange={(e) => set('q', e.target.value)} />
      <select value={value.status || ''} onChange={(e) => set('status', e.target.value)}>
        <option value="">All Status</option>
        <option value="Not Started">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select value={value.priority || ''} onChange={(e) => set('priority', e.target.value)}>
        <option value="">Any Priority</option>
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
      <input type="date" value={value.dateFrom || ''} onChange={(e) => set('dateFrom', e.target.value)} />
      <input type="date" value={value.dateTo || ''} onChange={(e) => set('dateTo', e.target.value)} />
      <select value={value.sort || ''} onChange={(e) => set('sort', e.target.value)}>
        <option value="">Sort: Updated</option>
        <option value="dueDate">Due Date</option>
        <option value="assignee">Assignee</option>
      </select>
      <button onClick={() => onChange(value)}>Apply</button>
      <button className="secondary" onClick={clear}>Clear</button>
    </div>
  );
}

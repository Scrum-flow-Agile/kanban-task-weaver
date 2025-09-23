import React, { memo } from 'react';
import { Commitment } from '../types/commitment';
import { hoursUntil, isOverdue, toLocal } from '../lib/date';


type Props = {
  item: Commitment;
  onToggleComplete: (c: Commitment) => void;
  onOpen: (c: Commitment) => void;
  canEdit?: boolean;
};

export default memo(function CommitmentItem({ item, onToggleComplete, onOpen, canEdit = true }: Props) {
const hrs = hoursUntil(item.dueDate);
const overdue = isOverdue(item.dueDate) && item.status !== 'Completed';
const critical = item.status !== 'Completed' && hrs <= 2 && hrs >= 0;
const soon = item.status !== 'Completed' && hrs > 2 && hrs <= 4;


let cls = 'commitment';
if (item.status === 'Completed') cls += ' completed';
else if (overdue) cls += ' overdue blink-red';
else if (critical) cls += ' due-critical blink-red';
else if (soon) cls += ' due-soon';


return (
<div className={cls} onClick={() => onOpen(item)} role="button" tabIndex={0}>
<div className="row top">
<div className="title">{item.title}</div>
<div className={`pill priority-${item.priority.toLowerCase()}`}>{item.priority}</div>
</div>
<div className="row bottom">
<div className="meta">Due: {toLocal(item.dueDate)}</div>
<div className="meta">Assignee: {item.assignee?.name || 'Unassigned'}</div>
<label className="done" onClick={(e) => e.stopPropagation()}>
<input type="checkbox" disabled={!canEdit} checked={item.status === 'Completed'} onChange={() => onToggleComplete(item)} />
Completed
</label>
</div>
{item.linkedTaskId === null && <div className="tag warn">Task deleted</div>}
</div>
);
});
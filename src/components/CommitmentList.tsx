import React from 'react';
import { Commitment } from '../types/commitment';
import CommitmentItem from './CommitmentItem';

type Props = {
  items: Commitment[];
  onToggleComplete: (c: Commitment) => void;
  onOpen: (c: Commitment) => void;
   onDelete: (c: Commitment) => void | Promise<void>;
  canEdit?: boolean;
};

export default function CommitmentList({ items, onToggleComplete, onOpen, canEdit = true }: Props) {
if (!items.length) return <div className="empty">No commitments found</div>;
return (
<div className="commitment-list">
{items.map((it) => (
<CommitmentItem key={it.id} item={it} onToggleComplete={onToggleComplete} onOpen={onOpen} canEdit={canEdit} />
))}
</div>
);
}
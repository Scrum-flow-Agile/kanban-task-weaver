import React, { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";

type WorkspaceCardProps = {
  id: string;
  name: string;
  owner: string;
  createdAt: string; // from backend

};

export default function WorkspaceCard({ id, name, owner, createdAt }: WorkspaceCardProps) {
  const [showAbsolute, setShowAbsolute] = useState(true);

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">Owner: {owner}</p>

      <div className="text-sm text-gray-500 mt-2">
        Created:{" "}
        {showAbsolute
          ? format(new Date(createdAt), "MMM d, yyyy h:mm a")
          : formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </div>

      <button
        className="text-xs text-blue-500 underline mt-1"
        onClick={() => setShowAbsolute(!showAbsolute)}
      >
        {showAbsolute ? "Show relative" : "Show absolute"}
      </button>
    </div>
  );
}
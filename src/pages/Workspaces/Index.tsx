import React, { useState, useEffect } from "react";
import WorkspaceCard from "../../components/WorkspaceCard";

interface Workspace {
  id: number;
  name: string;
  createdAt: string;
}

const WorkspacesPage: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch("/api/workspaces")
      .then((res) => res.json())
      .then(setWorkspaces);
  }, []);

  const createWorkspace = async () => {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    const created = await res.json();
    setWorkspaces([...workspaces, created]); // ✅ includes createdAt
    setNewName("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Workspaces</h1>
      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Workspace name"
        className="border p-2 mr-2"
      />
      <button onClick={createWorkspace} className="bg-blue-500 text-white p-2 rounded">
        Create
      </button>

      <div className="mt-6 space-y-4">
        {workspaces.map((ws) => (
          <WorkspaceCard key={ws.id} {...ws} />
        ))}
      </div>
    </div>
  );
};

export default WorkspacesPage;
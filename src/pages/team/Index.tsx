import React, { useState, useEffect } from "react";
import styles from "./Team.module.css";
import { Helmet } from "react-helmet-async";
import { FaEdit } from "react-icons/fa";


type Member = {
  name: string;
  role: string;
};

type Team = {
  name: string;
  members: Member[];
};

const teams: Team[] = [
  {
    name: "Development Team4",
    members: [
      { name: "John Doe", role: "Frontend Developer" },
      { name: "Jane Smith", role: "Backend Developer" },
      { name: "Mike Johnson", role: "UI/UX Designer" },
      { name: "Sarah Wilson", role: "Project Manager" },
    ],
  },
  {
    name: "Marketing Team3",
    members: [
      { name: "Emily Davis", role: "Content Manager" },
      { name: "David Brown", role: "SEO Specialist" },
      { name: "Lisa Garcia", role: "Social Media Manager" },
    ],
  },
  {
    name: "Design Team3",
    members: [
      { name: "Alex Chen", role: "Lead Designer" },
      { name: "Maria Rodriguez", role: "Graphic Designer" },
      { name: "Tom Wilson", role: "UX Researcher" },
    ],
  },
];

export default function TeamsPage() {
  const [openTeam, setOpenTeam] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ team: string; index: number } | null>(null);
  // Removed duplicate declaration of editValues and setEditValues
  const [teamsState, setTeamsState] = useState<Team[]>(teams);

    // Load teams from localStorage when the page first loads
  useEffect(() => {
    const savedTeams = localStorage.getItem("teamsData");
    if (savedTeams) {
      setTeamsState(JSON.parse(savedTeams));
    }
  }, []);

  // Save teams to localStorage whenever teamsState changes
  useEffect(() => {
    localStorage.setItem("teamsData", JSON.stringify(teamsState));
  }, [teamsState]);


  const [developmentTeam, setDevelopmentTeam] = useState<string>("Development Team");


  // Removed duplicate toggleTeam declaration

  const [editingMember, setEditingMember] = useState<{
    team: string;
    index: number;
  } | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; role: string }>({
    name: "",
    role: "",
  });

  // For editing team names
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [teamNameValue, setTeamNameValue] = useState("");

  const handleEditTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamNameValue(e.target.value);
  };

  const handleSaveTeamName = () => {
    if (editingTeam) {
      setTeamsState((prev) =>
        prev.map((t) =>
          t.name === editingTeam ? { ...t, name: teamNameValue } : t
        )
      );
      setEditingTeam(null);
    }
  };
 const toggleTeam = (teamName: string) => {
    setOpenTeam(openTeam === teamName ? null : teamName);
  };
  
  // Member edit
  const handleEditMember = (teamName: string, index: number, member: Member) => {
    setEditingMember({ team: teamName, index });
    setEditValues({ name: member.name, role: member.role });
  };

  const handleSaveMember = () => {
    if (editingMember) {
      setTeamsState((prev) =>
        prev.map((t) =>
          t.name === editingMember.team
            ? {
                ...t,
                members: t.members.map((m, i) =>
                  i === editingMember.index ? { ...m, ...editValues } : m
                ),
              }
            : t
        )
      );
      setEditingMember(null);
    }
  };

  // Team name edit
  const handleEditTeam = (teamName: string) => {
    setEditingTeam(teamName);
    setTeamNameValue(teamName);
  };

  const handleSaveTeam = (oldName: string) => {
    setTeamsState((prev) =>
      prev.map((t) =>
        t.name === oldName ? { ...t, name: teamNameValue } : t
      )
    );
    setEditingTeam(teamNameValue);
  };

  const updateTeam = async (id: string, name: string) => {
  // Optimistically update UI first
  setTeamsState((prev) =>
    prev.map((t) => (t.name === id ? { ...t, name } : t))
  );

  // Then call backend
  const res = await fetch(`/api/teams/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    console.error("Failed to update team");
    // rollback if API fails
    const originalTeams = await fetch("/api/teams").then((r) => r.json());
    setTeamsState(originalTeams);
  }
};

const updateMember = async (id: string, name: string, role: string) => {
  // Optimistic UI update
  setTeamsState((prev) =>
    prev.map((team) => ({
      ...team,
      members: team.members.map((m) =>
        m.name === id ? { ...m, name, role } : m
      ),
    }))
  );

  // Then call backend
  const res = await fetch(`/api/teams/members/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, role }),
  });

  if (!res.ok) {
    console.error("Failed to update member");
    const originalTeams = await fetch("/api/teams").then((r) => r.json());
    setTeamsState(originalTeams);
  }
};

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Our Teams</h1>
      <p className={styles.subtitle}>
        Discover the talented individuals who make up our teams
      </p>

      <div className={styles.grid}>
        {teamsState.map((team) => (
          <div key={team.name} className={styles.card}>
            <div className={styles.teamHeader}>
              {editingTeam === team.name ? (
                <div className={styles.editRow}>
                  <input
                    className={styles.input}
                    value={teamNameValue}
                    onChange={(e) => setTeamNameValue(e.target.value)}
                  />
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleSaveTeam(team.name)}
                  >
                    💾
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setEditingTeam(null)}
                  >
                    ✖
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className={styles.teamToggle}
                    onClick={() => toggleTeam(team.name)}
                  >
                    {team.name} members{" "}
                    <span>{openTeam === team.name ? "▲" : "▼"}</span>
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEditTeam(team.name)}
                  >
                    ✎
                  </button>
                </>
              )}
            </div>

            {openTeam === team.name && (
              <ul className={styles.memberList}>
                {team.members.map((m, i) => (
                  <li key={i} className={styles.memberItem}>
                    {editingMember?.team === team.name &&
                    editingMember?.index === i ? (
                      <div className={styles.editRow}>
                        <input
                          className={styles.input}
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              name: e.target.value,
                            })
                          }
                        />
                        <input
                          className={styles.input}
                          value={editValues.role}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              role: e.target.value,
                            })
                          }
                        />
                        <button
                          className={styles.saveBtn}
                          onClick={handleSaveMember}
                        >
                          💾
                        </button>
                        <button
                          className={styles.cancelBtn}
                          onClick={() => setEditingMember(null)}
                        >
                          ✖
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className={styles.memberName}>{m.name}</span>
                        <span className={styles.memberRole}>– {m.role}</span>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditMember(team.name, i, m)}
                        >
                          ✎
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
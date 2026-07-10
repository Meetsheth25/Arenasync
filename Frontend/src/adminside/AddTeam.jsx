import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import "./addTeam.css";
import { useNavigate } from "react-router-dom";

export default function AddTeam() {
  const token = localStorage.getItem("token");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  const nav = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    teamName: "",
    tournamentId: "",
    sportId: "",
    captainId: "",
  });

  /* LOAD TOURNAMENTS + USERS */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    // ✅ FIXED: Use public endpoint for tournaments
    const tournamentsRes = await axios.get("http://localhost:5000/api/tournaments/public");
    setTournaments(tournamentsRes.data);

    const usersRes = await axios.get("http://localhost:5000/api/users", auth);
    const allowed = usersRes.data.filter(u =>
      ["organizer", "coach"].includes(u.role)
    );
    setUsers(allowed);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setMessage({ type: "error", text: "Failed to load tournaments or users" });
    }
  };

  /* WHEN TOURNAMENT SELECTED */
  const onTournamentChange = (e) => {
    const tournamentId = e.target.value;
    const tournament = tournaments.find(t => t._id === tournamentId);

    setForm(prev => ({
      ...prev,
      tournamentId,
      sportId: tournament?.sportId?._id || "",
    }));
  };

  /* SUBMIT */
  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/teams",
        {
          teamName: form.teamName.trim(),
          tournamentId: form.tournamentId,
          sportId: form.sportId,
          captainId: form.captainId || undefined,
        },
        auth
      );

      setMessage({ type: "success", text: "✅ Team created successfully" });

      setForm({
        teamName: "",
        tournamentId: "",
        sportId: "",
        captainId: "",
      });

      nav("/admin/teams");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "❌ Failed to create team",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      teamName: "",
      tournamentId: "",
      sportId: "",
      captainId: "",
    });
    setMessage(null);
  };

  const isDisabled =
    !form.teamName ||
    form.teamName.length < 3 ||
    !form.tournamentId ||
    !form.sportId ||
    loading;

  // Custom button styles
  const buttonStyles = {
    submit: {
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
    reset: {
      backgroundColor: "#6b7280",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
  };

  return (
    <div className="admin-layout">
      <main className="content">
        <h1>Add Team</h1>

        <section className="panel">
          {message && (
            <div className={`alert ${message.type}`} style={{
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2",
              color: message.type === "success" ? "#16a34a" : "#dc2626"
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={submit}>
            <input
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              placeholder="Team Name"
              value={form.teamName}
              onChange={(e) => setForm({ ...form, teamName: e.target.value })}
            />

            <select
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              value={form.tournamentId}
              onChange={onTournamentChange}
            >
              <option value="">Select Tournament</option>
              {tournaments.map(t => (
                <option key={t._id} value={t._id}>
                  {t.eventName}
                </option>
              ))}
            </select>

            <select
              style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              value={form.captainId}
              onChange={(e) => setForm({ ...form, captainId: e.target.value })}
            >
              <option value="">Select Team Creator (Optional)</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>

            {/* PREVIEW */}
            {form.tournamentId && (
              <div style={{ padding: "10px", backgroundColor: "#f3f4f6", borderRadius: "6px", marginBottom: "15px" }}>
                <p><b>Tournament:</b> {tournaments.find(t => t._id === form.tournamentId)?.eventName}</p>
                <p><b>Captain:</b> {users.find(u => u._id === form.captainId)?.name || "Logged-in user"}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                type="submit" 
                disabled={isDisabled}
                style={{ ...buttonStyles.submit, opacity: isDisabled ? 0.6 : 1 }}
                onMouseEnter={(e) => !isDisabled && (e.target.style.backgroundColor = "#059669")}
                onMouseLeave={(e) => !isDisabled && (e.target.style.backgroundColor = "#10b981")}
              >
                {loading ? "Creating..." : "Create Team"}
              </button>

              <button
                type="button"
                style={buttonStyles.reset}
                onClick={resetForm}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#4b5563"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#6b7280"}
              >
                Reset
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
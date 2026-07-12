import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { API_URL } from "../utils/axiosConfig";
import { 
  User, 
  Shield, 
  Info, 
  Sparkles, 
  Mail, 
  Phone, 
  UserRound, 
  Calendar, 
  MapPin, 
  Activity, 
  BadgeCheck, 
  CalendarDays, 
  Hash,
  Copy
} from "lucide-react";
import "./AdminUsers.css";
import "./AdminPayments.css";

export default function AdminUsers() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    status: "",
  });

  const detailsScrollRef = useRef(null);

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getRoleBadgeStyle = (role) => {
    const r = (role || "").toLowerCase();
    switch (r) {
      case "admin":
        return { backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", textTransform: "uppercase" };
      case "organizer":
        return { backgroundColor: "rgba(99, 102, 241, 0.12)", color: "#6366f1", border: "1px solid rgba(99, 102, 241, 0.2)", textTransform: "uppercase" };
      case "coach":
        return { backgroundColor: "rgba(20, 184, 166, 0.12)", color: "#14b8a6", border: "1px solid rgba(20, 184, 166, 0.2)", textTransform: "uppercase" };
      case "player":
        return { backgroundColor: "rgba(249, 115, 22, 0.12)", color: "#f97316", border: "1px solid rgba(249, 115, 22, 0.2)", textTransform: "uppercase" };
      case "sponsor":
        return { backgroundColor: "rgba(217, 119, 6, 0.12)", color: "#d97706", border: "1px solid rgba(217, 119, 6, 0.2)", textTransform: "uppercase" };
      default:
        return { backgroundColor: "rgba(107, 114, 128, 0.12)", color: "#6b7280", border: "1px solid rgba(107, 114, 128, 0.2)", textTransform: "uppercase" };
    }
  };

  const getStatusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "paid" || s === "completed" || s === "active") return "status-paid";
    if (s === "failed" || s === "cancelled" || s === "blocked" || s === "rejected") return "status-failed";
    if (s === "refunded") return "status-refunded";
    if (s === "created" || s === "attempted" || s === "pending" || s === "pending approval") return "status-pending";
    return "status-neutral";
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }).catch((err) => {
      console.error("Could not copy text: ", err);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${year} • ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser || showEditPopup) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedUser, showEditPopup]);

  useEffect(() => {
    if (!selectedUser) return;

    if (detailsScrollRef.current) {
      detailsScrollRef.current.scrollTop = 0;
    }

    const frameId = requestAnimationFrame(() => {
      if (detailsScrollRef.current) {
        detailsScrollRef.current.scrollTop = 0;
      }
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const res = await axios.get(
        API_URL + "/users",
        authHeader
      );
      // ✅ Filter out any null/undefined users and ensure we have an array
      const validUsers = (res.data || []).filter(user => user && typeof user === 'object');
      setUsers(validUsers);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    }
  };

  /* ================= BLOCK / UNBLOCK ================= */
  const toggleStatus = async (id, current) => {
    try {
      await axios.put(
        `${API_URL}/users/${id}`,
        { status: current === "active" ? "blocked" : "active" },
        authHeader
      );
      loadUsers();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Failed to update user status");
    }
  };

  /* ================= DELETE ================= */
  const deleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/users/${id}`, authHeader);
      alert("User deleted successfully!");
      loadUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (u) => {
    if (!u) return;
    setEditUser(u);
    setEditForm({
      name: u.name || "",
      role: u.role || "player",
      status: u.status || "active",
    });
    setShowEditPopup(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setEditUser(null);
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${API_URL}/users/${editUser._id}`,
        editForm,
        authHeader
      );
      closeEditPopup();
      loadUsers();
      alert("User updated successfully!");
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user");
    }
  };

  // ✅ SUPER SAFE filtering - checks every property exists before using
  const filteredUsers = (users || []).filter((u) => {
    // Skip if user is null/undefined or not an object
    if (!u || typeof u !== 'object') return false;
    
    const searchLower = (search || "").toLowerCase();
    
    // Safe property access with fallbacks
    const userName = (u.name || "").toLowerCase();
    const userEmail = (u.email || "").toLowerCase();
    
    return userName.includes(searchLower) || userEmail.includes(searchLower);
  });

  // Style for status select dropdown
  const getStatusSelectStyle = (status) => {
    return {
      backgroundColor: status === "blocked" ? "#fee2e2" : "#dcfce7",
      color: status === "blocked" ? "#dc2626" : "#16a34a",
      fontWeight: "bold",
      border: status === "blocked" ? "1px solid #dc2626" : "1px solid #16a34a",
      borderRadius: "6px",
      padding: "8px 12px",
      cursor: "pointer",
    };
  };

  return (
    <div className="admin-layout">
      <main className="content">
        <h1>User Management</h1>

        {/* SEARCH */}
        <input
          className="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u._id || Math.random()}>
                  <td
                    className="click"
                    onClick={() => setSelectedUser(u)}
                  >
                    {u.name || "N/A"}
                  </td>
                  <td>{u.email || "N/A"}</td>
                  <td>{u.role || "N/A"}</td>
                  <td>
                    <span 
                      style={{
                        backgroundColor: u.status === "blocked" ? "#fee2e2" : "#dcfce7",
                        color: u.status === "blocked" ? "#dc2626" : "#16a34a",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "inline-block",
                      }}
                    >
                      {u.status || "active"}
                    </span>
                  </td>
                  <td>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEdit(u)}
                      style={{
                        backgroundColor: "#2563EB",
                        color: "white",
                        border: "none",
                        padding: "5px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(u._id, u.status)}
                      style={{
                        backgroundColor: u.status === "active" ? "#ef4444" : "#10b981",
                        color: "white",
                        border: "none",
                        padding: "5px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      {u.status === "active" ? "Block" : "Unblock"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(u._id, u.name);
                      }}
                      style={{
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "5px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  {search ? "No users match your search" : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* VIEW DETAILS MODAL */}
        {selectedUser && createPortal(
          <div className="modal-overlay-premium" onClick={() => setSelectedUser(null)}>
            <div className="modal-container-premium" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-premium">
                <div className="modal-title-wrapper" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div className="user-details-premium-header-icon-tile">
                    <Sparkles size={20} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>User Details</h3>
                    <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.75)", fontWeight: "500", letterSpacing: "0.2px" }}>Account information & profile overview</span>
                  </div>
                </div>
                <button className="close-btn-x" onClick={() => setSelectedUser(null)} aria-label="Close modal">
                  ×
                </button>
              </div>

              <div ref={detailsScrollRef} className="modal-body-premium user-details-premium-body">
                
                {/* Compact Horizontal Profile Hero Card */}
                <div className="user-details-premium-hero">
                  <div className="user-details-premium-hero-avatar-wrapper">
                    <img
                      src={selectedUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || "User")}&background=4f46e5&color=fff`}
                      alt={selectedUser.name || "User"}
                      className="user-details-premium-hero-avatar"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || "User")}&background=4f46e5&color=fff`;
                      }}
                    />
                  </div>
                  <div className="user-details-premium-hero-details">
                    <h2 className="user-details-premium-hero-name">{selectedUser.name || "N/A"}</h2>
                    <p className="user-details-premium-hero-email">{selectedUser.email || "N/A"}</p>
                    <div className="user-details-premium-hero-badges">
                      <span className="user-badge" style={getRoleBadgeStyle(selectedUser.role)}>
                        {selectedUser.role || "N/A"}
                      </span>
                      <span className={`status-pill-premium ${getStatusBadgeClass(selectedUser.status)}`}>
                        <span className="status-indicator-dot"></span>
                        <span>{selectedUser.status || "active"}</span>
                      </span>
                    </div>
                    <div className="user-details-premium-hero-meta">
                      Member since {formatDate(selectedUser.createdAt)}
                    </div>
                  </div>
                  <div className="user-details-premium-hero-id-chip" onClick={() => handleCopy(selectedUser._id, "userid")} style={{ cursor: "pointer" }}>
                    <Hash size={11} />
                    <span>{selectedUser._id}</span>
                    <Copy size={11} style={{ opacity: 0.6 }} />
                    {copiedId === "userid" && (
                      <span style={{
                        fontSize: "9px",
                        color: "#16a34a",
                        position: "absolute",
                        bottom: "-22px",
                        right: "8px",
                        background: "rgba(22, 163, 74, 0.1)",
                        border: "1px solid rgba(22, 163, 74, 0.2)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: "600",
                        animation: "fadeIn 0.2s ease"
                      }}>Copied!</span>
                    )}
                  </div>
                </div>

                <div className="user-details-premium-grid">
                  {/* Personal Information Panel */}
                  <div className="user-details-premium-card">
                    <div className="user-details-premium-card-header">
                      <User size={18} />
                      <div className="user-details-premium-card-title-group">
                        <h4 className="user-details-premium-card-title">Personal Information</h4>
                        <span className="user-details-premium-card-subtitle">Basic contact and identity info</span>
                      </div>
                    </div>
                    <div className="user-details-premium-card-divider"></div>
                    <div className="user-details-premium-card-body">
                      <div className="user-details-premium-row">
                        <div className="user-details-premium-row-left">
                          <User size={14} />
                          <span className="user-details-premium-row-label">Full Name</span>
                        </div>
                        <span className="user-details-premium-row-value">{selectedUser.name || "N/A"}</span>
                      </div>
                      
                      <div className="user-details-premium-row">
                        <div className="user-details-premium-row-left">
                          <Mail size={14} />
                          <span className="user-details-premium-row-label">Email Address</span>
                        </div>
                        <span className="user-details-premium-row-value">{selectedUser.email || "N/A"}</span>
                      </div>

                      {selectedUser.phoneNumber && (
                        <div className="user-details-premium-row">
                          <div className="user-details-premium-row-left">
                            <Phone size={14} />
                            <span className="user-details-premium-row-label">Phone Number</span>
                          </div>
                          <span className="user-details-premium-row-value">{selectedUser.phoneNumber}</span>
                        </div>
                      )}

                      {selectedUser.gender && (
                        <div className="user-details-premium-row">
                          <div className="user-details-premium-row-left">
                            <UserRound size={14} />
                            <span className="user-details-premium-row-label">Gender</span>
                          </div>
                          <span className="user-details-premium-row-value" style={{ textTransform: "capitalize" }}>{selectedUser.gender}</span>
                        </div>
                      )}

                      {selectedUser.age && (
                        <div className="user-details-premium-row">
                          <div className="user-details-premium-row-left">
                            <Calendar size={14} />
                            <span className="user-details-premium-row-label">Age</span>
                          </div>
                          <span className="user-details-premium-row-value">{selectedUser.age} years</span>
                        </div>
                      )}

                      {selectedUser.location && (
                        <div className="user-details-premium-row">
                          <div className="user-details-premium-row-left">
                            <MapPin size={14} />
                            <span className="user-details-premium-row-label">Location</span>
                          </div>
                          <span className="user-details-premium-row-value">{selectedUser.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Information Panel */}
                  <div className="user-details-premium-card">
                    <div className="user-details-premium-card-header">
                      <Shield size={18} />
                      <div className="user-details-premium-card-title-group">
                        <h4 className="user-details-premium-card-title">Account Information</h4>
                        <span className="user-details-premium-card-subtitle">System status & verification logs</span>
                      </div>
                    </div>
                    <div className="user-details-premium-card-divider"></div>
                    <div className="user-details-premium-card-body">
                      <div className="user-details-premium-row">
                        <div className="user-details-premium-row-left">
                          <Shield size={14} />
                          <span className="user-details-premium-row-label">System Role</span>
                        </div>
                        <span className="user-details-premium-row-value" style={{ textTransform: "capitalize" }}>{selectedUser.role || "N/A"}</span>
                      </div>

                      <div className="user-details-premium-row">
                        <div className="user-details-premium-row-left">
                          <Activity size={14} />
                          <span className="user-details-premium-row-label">Account Status</span>
                        </div>
                        <span className="user-details-premium-row-value" style={{ textTransform: "capitalize" }}>{selectedUser.status || "active"}</span>
                      </div>

                      {typeof selectedUser.emailVerified === "boolean" && (
                        <div className="user-details-premium-row">
                          <div className="user-details-premium-row-left">
                            <BadgeCheck size={14} />
                            <span className="user-details-premium-row-label">Email Verified</span>
                          </div>
                          <span className="user-details-premium-row-value">
                            {selectedUser.emailVerified ? (
                              <span className="user-details-premium-verified-pill verified">Verified</span>
                            ) : (
                              <span className="user-details-premium-verified-pill unverified">Not Verified</span>
                            )}
                          </span>
                        </div>
                      )}

                      <div className="user-details-premium-row">
                        <div className="user-details-premium-row-left">
                          <CalendarDays size={14} />
                          <span className="user-details-premium-row-label">Registration Date</span>
                        </div>
                        <span className="user-details-premium-row-value">{formatDateTime(selectedUser.createdAt)}</span>
                      </div>

                      {selectedUser.updatedAt && (
                        <div className="user-details-premium-row">
                          <div className="user-details-premium-row-left">
                            <CalendarDays size={14} />
                            <span className="user-details-premium-row-label">Last Activity</span>
                          </div>
                          <span className="user-details-premium-row-value">{formatDateTime(selectedUser.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Description Card (Conditional) */}
                  {selectedUser.description && (
                    <div className="user-details-premium-card user-details-premium-desc-card">
                      <div className="user-details-premium-card-header">
                        <Info size={18} />
                        <div className="user-details-premium-card-title-group">
                          <h4 className="user-details-premium-card-title">Profile Description</h4>
                          <span className="user-details-premium-card-subtitle">User biography or summary statement</span>
                        </div>
                      </div>
                      <div className="user-details-premium-card-divider"></div>
                      <div className="user-details-premium-card-body">
                        <p className="user-details-premium-desc-text">
                          "{selectedUser.description}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer-premium">
                <button type="button" className="close-modal-btn-premium" onClick={() => setSelectedUser(null)}>
                  Close User Details
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* EDIT POPUP */}
        {showEditPopup && editUser && (
          <div className="popup-overlay" onClick={closeEditPopup}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h2>Edit User</h2>
                <button className="popup-close" onClick={closeEditPopup}>×</button>
              </div>
              
              <div className="popup-body">
                <div className="popup-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div className="popup-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editUser?.email || ""}
                    disabled
                    className="disabled-field"
                  />
                  <small className="field-note">Email cannot be changed</small>
                </div>

                <div className="popup-field">
                  <label>Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                  >
                    <option value="player">Player</option>
                    <option value="coach">Coach</option>
                    <option value="organizer">Organizer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="popup-field">
                  <label>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    style={getStatusSelectStyle(editForm.status)}
                  >
                    <option 
                      value="active"
                      style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
                    >
                      ✅ Active
                    </option>
                    <option 
                      value="blocked"
                      style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}
                    >
                      ❌ Blocked
                    </option>
                  </select>
                </div>
              </div>

              <div className="popup-footer">
                <button className="popup-cancel-btn" onClick={closeEditPopup}>
                  Cancel
                </button>
                <button className="popup-save-btn" onClick={saveEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./TournamentDetails.css";
import SkeletonTournament from "../components/loading/SkeletonTournament";

export default function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTournament();
  }, [id]);

  const fetchTournament = async () => {
    try {
      // ✅ FIXED: Use public endpoint to get tournament details
      const res = await axios.get(`http://localhost:5000/api/tournaments/public/${id}`);
      setTournament(res.data);
    } catch (err) {
      console.error("Failed to fetch tournament:", err);
      alert("Failed to load tournament details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/tournaments/${id}`, auth);
      alert("Tournament deleted successfully!");
      navigate("/admin/tournaments");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete tournament");
    }
  };

  if (loading) {
    return <SkeletonTournament />;
  }

  if (!tournament) {
    return (
      <div className="admin-tournament-error-container">
        <h2>Tournament Not Found</h2>
        <button 
          className="admin-tournament-btn admin-tournament-btn-back"
          onClick={() => navigate("/admin/tournaments")}
        >
          ← Back to Tournaments
        </button>
      </div>
    );
  }

  // Format Date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return "N/A";
    return dateObj.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="admin-tournament-details-page">
      {/* 1. PREMIUM PAGE HEADER */}
      <div className="admin-tournament-details-header">
        <div className="admin-tournament-details-header-left">
          <div className="admin-tournament-details-breadcrumb">
            Tournament Management / Tournament Details
          </div>
          <div className="admin-tournament-title-row">
            <h1 className="admin-tournament-details-title">{tournament.eventName}</h1>
            <span className={`admin-tournament-status-badge admin-tournament-status-${tournament.status || "upcoming"}`}>
              {tournament.status || "upcoming"}
            </span>
          </div>
        </div>
        <div className="admin-tournament-actions-group">
          <button 
            className="admin-tournament-btn admin-tournament-btn-back"
            onClick={() => navigate("/admin/tournaments")}
          >
            ← Back
          </button>
          <button 
            className="admin-tournament-btn admin-tournament-btn-edit"
            onClick={() => navigate(`/admin/tournament/edit/${id}`)}
          >
            ✏️ Edit
          </button>
          <button 
            className="admin-tournament-btn admin-tournament-btn-delete"
            onClick={handleDelete}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* 2. TOURNAMENT OVERVIEW / HERO CARD */}
      <div className="admin-tournament-overview-card">
        {tournament.titleSponsorLogo && (
          <div className="admin-tournament-sponsor-logo-container">
            <img 
              src={tournament.titleSponsorLogo} 
              alt="Title Sponsor Logo" 
              className="admin-tournament-sponsor-logo" 
            />
          </div>
        )}
        <div className="admin-tournament-overview-info">
          <div className="admin-tournament-overview-tag">
            {tournament.sportId?.name || "Sport Event"}
          </div>
          <p className="admin-tournament-overview-sub">
            Venue: <strong>{tournament.venueId?.name || "TBD"}</strong> &bull; Location: {tournament.location || "TBD"}
          </p>
        </div>
      </div>

      {/* 3. KEY METRICS STRIP */}
      <div className="admin-tournament-metrics-grid">
        <div className="admin-tournament-metric-card">
          <div className="admin-tournament-metric-icon">👥</div>
          <div>
            <div className="admin-tournament-metric-label">Registered Teams</div>
            <div className="admin-tournament-metric-value">
              {tournament.teams?.length || 0}
            </div>
          </div>
        </div>

        <div className="admin-tournament-metric-card">
          <div className="admin-tournament-metric-icon">🏆</div>
          <div>
            <div className="admin-tournament-metric-label">Max Participants (Teams)</div>
            <div className="admin-tournament-metric-value">
              {tournament.maxParticipants || "Unlimited"}
            </div>
          </div>
        </div>

        <div className="admin-tournament-metric-card">
          <div className="admin-tournament-metric-icon">🎫</div>
          <div>
            <div className="admin-tournament-metric-label">Registration Fee</div>
            <div className="admin-tournament-metric-value">
              {tournament.teamRegistrationFee > 0 ? `₹${tournament.teamRegistrationFee.toLocaleString("en-IN")}` : "Free"}
            </div>
          </div>
        </div>

        <div className="admin-tournament-metric-card">
          <div className="admin-tournament-metric-icon">💰</div>
          <div>
            <div className="admin-tournament-metric-label">Prize Pool</div>
            <div className="admin-tournament-metric-value">
              ₹{(tournament.prizePool || 0).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT GRID */}
      <div className="admin-tournament-main-grid">
        {/* Left Column */}
        <div className="admin-tournament-grid-left">
          {/* Schedule & Details */}
          <div className="admin-tournament-info-section">
            <h2 className="admin-tournament-section-title">Schedule & Details</h2>
            <div className="admin-tournament-details-list">
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">Start Date</span>
                <span className="admin-tournament-row-value">{formatDate(tournament.startDate)}</span>
              </div>
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">End Date</span>
                <span className="admin-tournament-row-value">{formatDate(tournament.endDate)}</span>
              </div>
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">Sport Category</span>
                <span className="admin-tournament-row-value">{tournament.sportId?.name || "N/A"}</span>
              </div>
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">Tournament Status</span>
                <span className="admin-tournament-row-value capitalize">{tournament.status || "upcoming"}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {tournament.description && (
            <div className="admin-tournament-info-section">
              <h2 className="admin-tournament-section-title">Description</h2>
              <p className="admin-tournament-section-text">{tournament.description}</p>
            </div>
          )}

          {/* Rules */}
          {tournament.rules && (
            <div className="admin-tournament-info-section">
              <h2 className="admin-tournament-section-title">Rules & Guidelines</h2>
              <p className="admin-tournament-section-text whitespace-pre-wrap">{tournament.rules}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="admin-tournament-grid-right">
          {/* Venue Information */}
          <div className="admin-tournament-info-section">
            <h2 className="admin-tournament-section-title">Venue Information</h2>
            <div className="admin-tournament-details-list">
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">Venue Name</span>
                <span className="admin-tournament-row-value">{tournament.venueId?.name || "TBD"}</span>
              </div>
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">Location/Address</span>
                <span className="admin-tournament-row-value">{tournament.location || "TBD"}</span>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="admin-tournament-info-section">
            <h2 className="admin-tournament-section-title">Financial Summary</h2>
            <div className="admin-tournament-details-list">
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">Prize Pool</span>
                <span className="admin-tournament-row-value text-primary-color">
                  ₹{(tournament.prizePool || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">Winner Prize</span>
                <span className="admin-tournament-row-value text-success-color">
                  ₹{(tournament.winnerPrize || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">Runner-Up Prize</span>
                <span className="admin-tournament-row-value text-warning-color">
                  ₹{(tournament.runnerUpPrize || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="admin-tournament-details-row">
                <span className="admin-tournament-row-label">Registration Fee</span>
                <span className="admin-tournament-row-value">
                  {tournament.teamRegistrationFee > 0 ? `₹${tournament.teamRegistrationFee.toLocaleString("en-IN")}` : "Free"}
                </span>
              </div>
            </div>
          </div>

          {/* Active Sponsors */}
          {tournament.activeSponsorships && tournament.activeSponsorships.length > 0 && (
            <div className="admin-tournament-info-section">
              <h2 className="admin-tournament-section-title">Active Sponsors</h2>
              <div className="admin-tournament-sponsors-list">
                {tournament.activeSponsorships.map((sponsor) => (
                  <div key={sponsor._id} className="admin-tournament-sponsor-item">
                    {sponsor.logo && (
                      <img 
                        src={sponsor.logo} 
                        alt={`${sponsor.name} Logo`} 
                        className="admin-tournament-sponsor-item-logo" 
                      />
                    )}
                    <div className="admin-tournament-sponsor-item-details">
                      <div className="admin-tournament-sponsor-item-name">{sponsor.name}</div>
                      <div className="admin-tournament-sponsor-item-type">
                        {sponsor.type} Sponsor
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
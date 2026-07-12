import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { SOCKET_URL } from "../utils/socket";
import { API_URL } from "../utils/axiosConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import "./AdminDashboard.css";
import { motion } from "framer-motion";
import TiltCard from "../components/TiltCard";
import ThreeBgCanvas from "../components/ThreeBgCanvas";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function AnimatedCounter({ value, duration = 1000, formatter }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end <= 0) {
      setCount(value || 0);
      return;
    }
    let stepTime = Math.max(Math.floor(duration / end), 15);
    let timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  const displayValue = formatter ? formatter(count) : count;
  return <span>{displayValue}</span>;
}

export default function AnalyticsDashboard() {
  const token = localStorage.getItem("token");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    users: 0,
    tournaments: 0,
    teams: 0,
    matches: 0,
    sponsors: 0,
    registrations: 0,
    totalPrizePool: 0,
    upcomingTournaments: 0,
    ongoingTournaments: 0,
    completedTournaments: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [sportDistribution, setSportDistribution] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState({
    upcoming: 0,
    ongoing: 0,
    completed: 0,
  });
  
  const socketRef = useRef(null);

  useEffect(() => {
    fetchAnalytics();
    setupSocketConnection();
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const setupSocketConnection = () => {
    // Connect to Socket.IO
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("🔌 Connected to analytics real-time updates");
      // Register as admin for analytics updates
      socketRef.current.emit("register-analytics", { userId: localStorage.getItem("userId") });
    });

    // Listen for analytics updates
    socketRef.current.on("analytics_update", (updatedData) => {
      console.log("📊 Real-time analytics update received");
      updateDashboardData(updatedData);
      setLastUpdated(new Date());
    });

    socketRef.current.on("tournament_created", (data) => {
      console.log("🏆 New tournament created:", data);
      fetchAnalytics(); // Refresh all data
    });

    socketRef.current.on("tournament_updated", (data) => {
      console.log("✏️ Tournament updated:", data);
      fetchAnalytics();
    });

    socketRef.current.on("tournament_deleted", (data) => {
      console.log("🗑️ Tournament deleted:", data);
      fetchAnalytics();
    });

    socketRef.current.on("team_registered", (data) => {
      console.log("👥 Team registered:", data);
      fetchAnalytics();
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔌 Disconnected from real-time updates");
    });
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL + "/analytics/stats", auth);
      
      if (response.data) {
        updateDashboardData(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateDashboardData = (data) => {
    if (data.stats) {
      setStats(data.stats);
    }
    if (data.monthlyData) {
      setMonthlyData(data.monthlyData);
    }
    if (data.sportDistribution) {
      setSportDistribution(data.sportDistribution);
    }
    if (data.statusDistribution) {
      setStatusDistribution(data.statusDistribution);
    }
  };

  const getBarChartData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Tournaments Created",
        data: monthlyData.map((d) => d.count),
        backgroundColor: "rgba(15, 76, 129, 0.85)", // var(--primary)
        borderColor: "#0F4C81",
        borderWidth: 1.5,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(15, 76, 129, 1)",
      },
    ],
  };

  const getPieChartData = {
    labels: sportDistribution.map((s) => s.name),
    datasets: [
      {
        data: sportDistribution.map((s) => s.count),
        backgroundColor: sportDistribution.map((_, index) => {
          const colors = [
            "#0F4C81", // Brand Blue
            "#D4AF37", // Luxury Gold
            "#0B1220", // Dark Navy
            "#0F766E", // Teal
            "#10B981", // Success Green
            "#EF4444", // Danger Red
          ];
          return colors[index % colors.length];
        }),
        borderWidth: 0,
      },
    ],
  };

  const getDoughnutChartData = {
    labels: ["Upcoming", "Ongoing", "Completed"],
    datasets: [
      {
        data: [statusDistribution.upcoming, statusDistribution.ongoing, statusDistribution.completed],
        backgroundColor: [
          "#F59E0B", // Warning Orange
          "#10B981", // Success Green
          "#6B7280", // Slate Gray
        ],
        borderWidth: 0,
        cutout: "60%",
      },
    ],
  };

  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          font: {
            family: "'Space Grotesk', 'Inter', sans-serif",
            size: 11,
            weight: "500",
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(10, 15, 30, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#cfdcfc",
        borderColor: "rgba(99, 102, 241, 0.3)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        bodyFont: {
          family: "'Space Grotesk', 'Inter', sans-serif",
        },
        titleFont: {
          family: "'Space Grotesk', 'Inter', sans-serif",
          weight: "bold",
        }
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  const barChartOptions = {
    ...baseChartOptions,
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          font: {
            family: "'Space Grotesk', 'Inter', sans-serif",
          }
        }
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#94a3b8",
          font: {
            family: "'Space Grotesk', 'Inter', sans-serif",
          }
        }
      }
    }
  };

  const radialChartOptions = baseChartOptions;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 14 },
    },
  };

  if (loading) {
    return (
      <div className="admin-layout" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto 20px" }}></div>
          <h2 style={{ color: "var(--text-secondary)" }}>Loading analytics...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout perspective-viewport" style={{ position: "relative", overflow: "hidden" }}>
      {/* 3D Particle Backdrop */}
      <ThreeBgCanvas />

      <motion.main 
        className="content" 
        style={{ position: "relative", zIndex: 10 }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}
          variants={itemVariants}
        >
          <div>
            <h1>📊 Analytics Dashboard</h1>
            <p className="admin-subtitle" style={{ marginTop: "4px" }}>System performance metrics, sports distribution, and tournament status.</p>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", padding: "8px 14px", borderRadius: "8px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            🔄 Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </motion.div>

        {/* Stats Cards with 3D Tilt */}
        <motion.div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
          variants={itemVariants}
        >
          <TiltCard className="card stat-card" style={{ padding: "20px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "32px" }}>👥</div>
            <div className="stat-number" style={{ fontSize: "28px", fontWeight: "bold", color: "#2563EB", margin: "8px 0" }}>
              <AnimatedCounter value={stats.users} />
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: "600" }}>Total Users</div>
          </TiltCard>
          
          <TiltCard className="card stat-card" style={{ padding: "20px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "32px" }}>🏆</div>
            <div className="stat-number" style={{ fontSize: "28px", fontWeight: "bold", color: "#10b981", margin: "8px 0" }}>
              <AnimatedCounter value={stats.tournaments} />
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: "600" }}>Tournaments</div>
          </TiltCard>
          
          <TiltCard className="card stat-card" style={{ padding: "20px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "32px" }}>👥</div>
            <div className="stat-number" style={{ fontSize: "28px", fontWeight: "bold", color: "#f59e0b", margin: "8px 0" }}>
              <AnimatedCounter value={stats.teams} />
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: "600" }}>Teams</div>
          </TiltCard>
          
          <TiltCard className="card stat-card" style={{ padding: "20px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "32px" }}>⚽</div>
            <div className="stat-number" style={{ fontSize: "28px", fontWeight: "bold", color: "#ef4444", margin: "8px 0" }}>
              <AnimatedCounter value={stats.matches} />
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: "600" }}>Matches</div>
          </TiltCard>
          
          <TiltCard className="card stat-card" style={{ padding: "20px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "32px" }}>🤝</div>
            <div className="stat-number" style={{ fontSize: "28px", fontWeight: "bold", color: "#0F766E", margin: "8px 0" }}>
              <AnimatedCounter value={stats.sponsors} />
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: "600" }}>Sponsors</div>
          </TiltCard>
          
          <TiltCard className="card stat-card" style={{ padding: "20px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "32px" }}>📝</div>
            <div className="stat-number" style={{ fontSize: "28px", fontWeight: "bold", color: "#06b6d4", margin: "8px 0" }}>
              <AnimatedCounter value={stats.registrations} />
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: "600" }}>Registrations</div>
          </TiltCard>
          
          <TiltCard className="card stat-card" style={{ padding: "20px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "32px" }}>💰</div>
            <div className="stat-number" style={{ fontSize: "28px", fontWeight: "bold", color: "#ec4899", margin: "8px 0" }}>
              ₹<AnimatedCounter value={stats.totalPrizePool} formatter={(val) => val.toLocaleString()} />
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: "600" }}>Total Prize Pool</div>
          </TiltCard>
        </motion.div>

        {/* Charts & Quick Stats */}
        <motion.div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "24px",
            marginBottom: "30px",
          }}
          variants={itemVariants}
        >
          {/* Bar Chart */}
          <TiltCard className="panel" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ marginBottom: "20px", fontFamily: "'Outfit', sans-serif", fontWeight: "800", color: "var(--text)" }}>📅 Tournaments by Month</h3>
            <div style={{ height: "300px", position: "relative" }}>
              {monthlyData.length > 0 ? (
                <Bar data={getBarChartData} options={barChartOptions} />
              ) : (
                <div style={{ textAlign: "center", paddingTop: "100px", color: "var(--text-muted)", fontWeight: "600" }}>No data available</div>
              )}
            </div>
          </TiltCard>

          {/* Pie Chart */}
          <TiltCard className="panel" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ marginBottom: "20px", fontFamily: "'Outfit', sans-serif", fontWeight: "800", color: "var(--text)" }}>🏅 Tournaments by Sport</h3>
            <div style={{ height: "300px", position: "relative" }}>
              {sportDistribution.length > 0 ? (
                <Pie data={getPieChartData} options={radialChartOptions} />
              ) : (
                <div style={{ textAlign: "center", paddingTop: "100px", color: "var(--text-muted)", fontWeight: "600" }}>No data available</div>
              )}
            </div>
          </TiltCard>

          {/* Doughnut Chart */}
          <TiltCard className="panel" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ marginBottom: "20px", fontFamily: "'Outfit', sans-serif", fontWeight: "800", color: "var(--text)" }}>📊 Tournament Status</h3>
            <div style={{ height: "300px", position: "relative" }}>
              <Doughnut data={getDoughnutChartData} options={radialChartOptions} />
            </div>
          </TiltCard>

          {/* Quick Stats */}
          <TiltCard className="panel" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ marginBottom: "20px", fontFamily: "'Outfit', sans-serif", fontWeight: "800", color: "var(--text)" }}>🔄 Quick Stats</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>Active Tournaments:</span>
                  <strong style={{ color: "var(--success)", fontSize: "16px", fontWeight: "800" }}>{stats.ongoingTournaments || 0}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>Upcoming Tournaments:</span>
                  <strong style={{ color: "var(--warning)", fontSize: "16px", fontWeight: "800" }}>{stats.upcomingTournaments || 0}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>Completed Tournaments:</span>
                  <strong style={{ color: "var(--text-muted)", fontSize: "16px", fontWeight: "800" }}>{stats.completedTournaments || 0}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>Average Teams per Tournament:</span>
                  <strong style={{ color: "var(--text)", fontSize: "16px", fontWeight: "800" }}>{(stats.teams / stats.tournaments || 0).toFixed(1)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", alignItems: "center" }}>
                  <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>Average Prize Pool:</span>
                  <strong style={{ color: "var(--text)", fontSize: "16px", fontWeight: "800" }}>₹{((stats.totalPrizePool || 0) / (stats.tournaments || 1)).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.main>
    </div>
  );
}
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Bar, Doughnut } from "react-chartjs-2";

import useAuth from "../../hooks/useAuth";
import useSubscriptions from "../../hooks/useSubscriptions";
import SubscriptionCard from "../../components/subscriptions/SubscriptionCard";
import SubscriptionForm from "../../components/subscriptions/SubscriptionForm";
import Spinner from "../../components/common/Spinner";
import { FiTrendingUp, FiCalendar, FiAlertCircle } from "react-icons/fi";

// 1. Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { user } = useAuth();
  const { subscriptions, loading, refresh, editSubscription } = useSubscriptions();
  const navigate = useNavigate();

  // Modal State
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // --- SMART CHART LOGIC ---

  // A. Category Data (Doughnut)
  const categoryData = useMemo(() => {
    const categories = {};
    subscriptions.forEach((sub) => {
      if (!sub.isActive) return;
      const cat = sub.category || "Other";
      // Normalize price to monthly for fair comparison
      let amount = Number(sub.price);
      if (sub.renewalFrequencyLabel?.toLowerCase().includes("year")) {
        amount = amount / 12;
      }
      categories[cat] = (categories[cat] || 0) + amount;
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            "rgba(244, 63, 94, 0.8)",   // Pink (Entertainment)
            "rgba(59, 130, 246, 0.8)",  // Blue (Productivity)
            "rgba(16, 185, 129, 0.8)",  // Emerald (Utilities)
            "rgba(245, 158, 11, 0.8)",  // Amber (Food)
            "rgba(139, 92, 246, 0.8)",  // Violet
            "rgba(6, 182, 212, 0.8)",   // Cyan
          ],
          borderColor: "#1e293b", // Matches slate-800 bg
          borderWidth: 2,
        },
      ],
    };
  }, [subscriptions]);

  // B. 12-Month Projection (Bar Chart)
  const projectionData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const currentMonth = new Date().getMonth(); 
    
    // Initialize array for next 12 months
    const monthlyCosts = new Array(12).fill(0);

    subscriptions.forEach((sub) => {
      if (!sub.isActive) return;
      const price = Number(sub.price);
      const isYearly = sub.renewalFrequencyLabel?.toLowerCase().includes("year");
      const renewalDate = new Date(sub.renewalDate);
      const renewalMonth = renewalDate.getMonth(); // 0-11

      if (isYearly) {
        // Add ONLY to the specific renewal month
        monthlyCosts[renewalMonth] += price;
      } else {
        // Monthly: Add to EVERY month
        for (let i = 0; i < 12; i++) monthlyCosts[i] += price;
      }
    });

    // Rotate array so current month is first
    // (Optional: keeps graph starting from "Now")
    // For simplicity, we keep Jan-Dec fixed, but highlight current month in colors

    return {
      labels: months,
      datasets: [
        {
          label: "Projected Spend (₹)",
          data: monthlyCosts,
          backgroundColor: months.map((_, i) => 
            i === currentMonth ? "rgba(244, 63, 94, 1)" : "rgba(99, 102, 241, 0.6)"
          ),
          borderRadius: 6,
        },
      ],
    };
  }, [subscriptions]);

  // Chart Options for Dark Mode
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#cbd5e1", font: { size: 12 } }, // Slate-300
      },
      title: { display: false },
    },
    scales: {
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#94a3b8" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  // --- HANDLERS ---
  const handleReminder = (sub) => navigate(`/subscriptions/${sub._id}/reminder`);
  const handleEdit = (sub) => { setEditData(sub); setFormOpen(true); };
  const handleSave = async (payload, id) => {
    await editSubscription(id, payload);
    setFormOpen(false);
    setEditData(null);
    refresh();
  };

  // --- STATS CALC ---
  const totalMonthly = subscriptions.reduce((sum, sub) => {
    const price = Number(sub.price);
    const isYearly = sub.renewalFrequencyLabel?.toLowerCase().includes("year");
    return sum + (isYearly ? price / 12 : price);
  }, 0);

  const activeSubs = subscriptions.filter((s) => s.isActive !== false).length;
  const upcoming = [...subscriptions]
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
    .slice(0, 3);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 flex items-center gap-4 bg-slate-800/50 rounded-xl border border-white/10">
          <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Monthly Avg Spend</p>
            <p className="text-2xl font-bold text-white">₹{Math.round(totalMonthly)}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4 bg-slate-800/50 rounded-xl border border-white/10">
          <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
            <FiCalendar size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Active Subscriptions</p>
            <p className="text-2xl font-bold text-white">{activeSubs}</p>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4 bg-slate-800/50 rounded-xl border border-white/10">
          <div className="p-3 rounded-full bg-pink-500/20 text-pink-400">
            <FiAlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Upcoming Renewals</p>
            <p className="text-2xl font-bold text-white">{upcoming.length}</p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart - Takes up 2 columns */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-white/10 p-5 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Yearly Projection</h3>
          <div className="h-64">
            <Bar data={projectionData} options={chartOptions} />
          </div>
        </div>

        {/* Doughnut Chart - Takes up 1 column */}
        <div className="bg-slate-800/50 rounded-xl border border-white/10 p-5 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Spend by Category</h3>
          <div className="h-64 flex justify-center">
            {/* Hide scales for Doughnut, it looks cleaner */}
            <Doughnut 
              data={categoryData} 
              options={{
                ...chartOptions,
                scales: { x: { display: false }, y: { display: false } }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Upcoming Section */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Upcoming Renewals</h2>
        {upcoming.length === 0 ? (
          <p className="text-slate-500">No upcoming renewals.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((sub) => (
              <SubscriptionCard 
                key={sub._id} 
                subscription={sub}
                onReminder={handleReminder} 
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <SubscriptionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editData={editData}
        onSave={handleSave}
      />
    </div>
  );
}
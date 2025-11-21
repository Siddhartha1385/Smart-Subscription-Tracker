// src/pages/subscriptions/Subscriptions.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SubscriptionList from "../../components/subscriptions/SubscriptionList";
import SubscriptionForm from "../../components/subscriptions/SubscriptionForm";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Spinner from "../../components/common/Spinner";
import {
  getSubscriptions,
  deleteSubscription,
  createSubscription, // Added import
  updateSubscription, // Added import
} from "../../api/subscriptions";

export default function Subscriptions() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await getSubscriptions();
      const subs = Array.isArray(data) ? data : data.subscriptions || [];
      setSubscriptions(subs);
    } catch (err) {
      console.error("Failed to fetch subscriptions", err);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // NEW: This handles the "Save" action from the Form
  // ---------------------------------------------------------
  async function handleSave(payload, id) {
    try {
      if (id) {
        // Update existing
        await updateSubscription(id, payload);
      } else {
        // Create new
        await createSubscription(payload);
      }
      // Refresh the list after successful save
      await load();
    } catch (error) {
      console.error("Save operation failed", error);
      throw error; // Rethrow so the form knows it failed (to stop loading spinner)
    }
  }

  function openAdd() {
    setEditData(null);
    setFormOpen(true);
  }

  function openEdit(sub) {
    setEditData(sub);
    setFormOpen(true);
  }

  function openDelete(sub) {
    setDeleteTarget(sub);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteSubscription(deleteTarget._id || deleteTarget.id);
      setConfirmOpen(false);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  }

  function onReminderClick(sub) {
    const id = sub._id || sub.id;
    // Make sure this route matches your AppRouter!
    // It maps to the ReminderSettings.jsx page we fixed.
    navigate(`/subscriptions/${id}/reminder`); 
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-50">
            Your Subscriptions
          </h1>
          <p className="text-sm text-slate-400">
            Track, filter and manage all your recurring services.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          + Add Subscription
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <SubscriptionList
          items={subscriptions}
          onEdit={openEdit}
          onReminder={onReminderClick}
          onDelete={openDelete}
        />
      )}

      <SubscriptionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditData(null);
        }}
        // This was the missing prop causing the error:
        onSave={handleSave} 
        editData={editData}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete subscription"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
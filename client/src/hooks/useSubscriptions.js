// src/hooks/useSubscriptions.js
import { useCallback, useEffect, useState } from "react";
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "../api/subscriptions";

export default function useSubscriptions(autoLoad = true) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubscriptions();
      const subs = Array.isArray(data) ? data : data.subscriptions || data || [];
      setSubscriptions(subs);
    } catch (err) {
      console.error("Failed to load subscriptions:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  const addSubscription = useCallback(
    async (payload) => {
      const res = await createSubscription(payload);
      await load();
      return res;
    },
    [load]
  );

  const editSubscription = useCallback(
    async (id, payload) => {
      const res = await updateSubscription(id, payload);
      await load();
      return res;
    },
    [load]
  );

  const removeSubscription = useCallback(
    async (id) => {
      const res = await deleteSubscription(id);
      await load();
      return res;
    },
    [load]
  );

  return {
    subscriptions,
    loading,
    error,
    refresh: load,
    addSubscription,
    editSubscription,
    removeSubscription,
  };
}

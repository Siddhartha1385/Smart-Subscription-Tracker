// src/components/subscriptions/SubscriptionList.jsx
import React, { useMemo, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

/**
 * Props:
 *  - items: array of subscription objects
 *  - onEdit(sub)
 *  - onReminder(sub)
 *  - onDelete(sub)
 */
export default function SubscriptionList({
  items = [],
  onEdit = () => {},
  onReminder = () => {},
  onDelete = () => {},
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [cycle, setCycle] = useState("");
  const [sortBy, setSortBy] = useState("next_renewal"); // or price_asc, price_desc
  const [page, setPage] = useState(1);
  const perPage = 9;

  // derive categories & cycles from items
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((i) => i.category && set.add(i.category));
    return Array.from(set).map((c) => ({
      value: c,
      label: c.charAt(0).toUpperCase() + c.slice(1),
    }));
  }, [items]);

  const cycles = useMemo(() => {
    const set = new Set();
    items.forEach((i) => {
      const v = i.billingCycle || i.renewalFrequencyLabel;
      if (v) set.add(v);
    });
    return Array.from(set).map((c) => ({
      value: c,
      label: (c || "").toString(),
    }));
  }, [items]);

  // filtered + searched list
  const filtered = useMemo(() => {
    let arr = items.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(q) ||
          (s.category || "").toLowerCase().includes(q)
      );
    }

    if (category) {
      arr = arr.filter(
        (s) => (s.category || "").toLowerCase() === category.toLowerCase()
      );
    }

    if (cycle) {
      arr = arr.filter(
        (s) =>
          ((s.billingCycle || s.renewalFrequencyLabel) || "")
            .toString()
            .toLowerCase() === (cycle || "").toLowerCase()
      );
    }

    // sorting
    if (sortBy === "price_asc")
      arr.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price_desc")
      arr.sort((a, b) => Number(b.price) - Number(a.price));
    else {
      // next_renewal: earliest renewal first
      arr.sort((a, b) => {
        const da = a.renewalDate
          ? new Date(a.renewalDate).getTime()
          : Number.MAX_SAFE_INTEGER;
        const db = b.renewalDate
          ? new Date(b.renewalDate).getTime()
          : Number.MAX_SAFE_INTEGER;
        return da - db;
      });
    }

    return arr;
  }, [items, query, category, cycle, sortBy]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const gotoPage = (p) => setPage(Math.min(Math.max(1, p), pages));

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div
        className="
          p-[1px] rounded-2xl
          bg-gradient-to-r from-sky-500/40 via-pink-500/25 to-sky-500/40
        "
      >
        <div
          className="
            rounded-2xl
            bg-slate-900/80
            border border-white/10
            backdrop-blur-xl
            px-4 py-4
            flex flex-col gap-4
            md:flex-row md:items-center md:justify-between
          "
        >
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Input
              placeholder="Search by name or category..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "All categories" },
                ...categories,
              ]}
            />
            <Select
              value={cycle}
              onChange={(e) => {
                setCycle(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "All cycles" },
                ...cycles,
              ]}
            />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: "next_renewal", label: "Next renewal" },
                { value: "price_asc", label: "Price: Low → High" },
                { value: "price_desc", label: "Price: High → Low" },
              ]}
            />
            <div className="text-xs md:text-sm text-slate-300 whitespace-nowrap">
              Total: <span className="font-semibold">{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          No subscriptions found for the current filters.
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((s) => (
            <SubscriptionCard
              key={s._id || s.id}
              subscription={s}
              onEdit={onEdit}
              onReminder={onReminder}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button onClick={() => gotoPage(page - 1)} disabled={page === 1}>
            Prev
          </Button>
          <div className="text-xs md:text-sm text-slate-300">
            Page {page} of {pages}
          </div>
          <Button onClick={() => gotoPage(page + 1)} disabled={page === pages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

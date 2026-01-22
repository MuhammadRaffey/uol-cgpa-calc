"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  calculationCount: number;
  createdAt: string | null;
  source: "clerk" | "legacy";
};

type AdminUserListProps = {
  users: AdminUserListItem[];
  selectedUserId?: string;
};

const normalize = (value: string) => value.toLowerCase().trim();

export default function AdminUserList({
  users,
  selectedUserId,
}: AdminUserListProps) {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return users;
    return users.filter((user) => {
      const haystack = `${user.name} ${user.email}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [query, users]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Users
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Showing {filteredUsers.length}
        </span>
      </div>
      <div className="mt-4">
        <label className="block text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Search
        </label>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or email"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200/70 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-emerald-400/20"
          aria-label="Search users"
        />
      </div>
      <div className="mt-5 space-y-3">
        {filteredUsers.map((user) => {
          const isSelected = selectedUserId === user.id;

          return (
            <Link
              key={user.id}
              href={`/admin?userId=${user.id}`}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition hover:-translate-y-0.5 ${
                isSelected
                  ? "border-emerald-300 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-200"
                  : "border-slate-200 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
                {user.source === "legacy" && (
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">
                    Legacy (dev)
                  </p>
                )}
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                {user.calculationCount}
              </span>
            </Link>
          );
        })}
        {filteredUsers.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No users match that search.
          </p>
        )}
      </div>
    </div>
  );
}

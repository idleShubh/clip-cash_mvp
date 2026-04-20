"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  earningsFor,
  getCampaign,
  getSubmissionsForCreator,
  refreshViews,
} from "@/lib/storage";
import type { Submission } from "@/lib/types";

export default function Earnings() {
  const [handle, setHandle] = useState("");
  const [subs, setSubs] = useState<Submission[]>([]);

  function reload(h: string) {
    setSubs(h ? getSubmissionsForCreator(h) : []);
  }

  useEffect(() => {
    const saved = localStorage.getItem("clipcash.handle") || "";
    setHandle(saved);
    reload(saved);
  }, []);

  function poll() {
    refreshViews();
    reload(handle);
  }

  const totalEarnings = subs.reduce((sum, s) => {
    const c = getCampaign(s.campaignId);
    return sum + (c ? earningsFor(s, c.cpv) : 0);
  }, 0);
  const paidOut = subs
    .filter((s) => s.state === "approved")
    .reduce((sum, s) => {
      const c = getCampaign(s.campaignId);
      return sum + (c ? earningsFor(s, c.cpv) : 0);
    }, 0);

  return (
    <div className="space-y-6">
      <Link
        href="/creator"
        className="text-sm text-neutral-500 hover:underline"
      >
        ← Back to campaigns
      </Link>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Creator
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Earnings</h1>
          {handle && (
            <p className="text-sm text-neutral-500 mt-1">@{handle}</p>
          )}
        </div>
        <button onClick={poll} className="btn-ghost">
          Simulate 6h poll →
        </button>
      </div>

      {!handle ? (
        <div className="card text-sm text-neutral-600">
          Set your handle on the{" "}
          <Link href="/creator" className="underline">
            creator page
          </Link>{" "}
          first.
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-3">
            <Stat label="Posts" value={String(subs.length)} />
            <Stat label="Pending earnings" value={`$${totalEarnings.toFixed(2)}`} />
            <Stat label="Approved (payable)" value={`$${paidOut.toFixed(2)}`} />
          </div>

          {subs.length === 0 ? (
            <div className="card text-sm text-neutral-600">
              No posts yet. Submit a clip from the campaign feed.
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-2">Campaign</th>
                    <th className="text-right px-4 py-2">Views</th>
                    <th className="text-right px-4 py-2">Earnings</th>
                    <th className="text-left px-4 py-2">State</th>
                    <th className="text-left px-4 py-2">Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((s) => {
                    const c = getCampaign(s.campaignId);
                    const earnings = c ? earningsFor(s, c.cpv) : 0;
                    const payoutDate = c
                      ? new Date(
                          new Date(c.endDate).getTime() + 15 * 864e5,
                        )
                          .toISOString()
                          .slice(0, 10)
                      : "—";
                    return (
                      <tr key={s.id} className="border-t border-neutral-100">
                        <td className="px-4 py-3 font-medium">
                          {c?.name ?? "Unknown campaign"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {s.views.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          ${earnings.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <StateBadge state={s.state} />
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {s.state === "disputed" ? "—" : payoutDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function StateBadge({ state }: { state: Submission["state"] }) {
  const map: Record<Submission["state"], string> = {
    pending_views: "bg-neutral-100 text-neutral-700",
    pending_approval: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    disputed: "bg-red-100 text-red-800",
  };
  return <span className={`badge ${map[state]}`}>{state.replace("_", " ")}</span>;
}

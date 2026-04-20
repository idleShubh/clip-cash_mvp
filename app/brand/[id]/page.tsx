"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  earningsFor,
  getCampaign,
  getSubmissionsForCampaign,
  refreshViews,
  saveSubmission,
} from "@/lib/storage";
import type { Campaign, Submission } from "@/lib/types";

export default function CampaignDetail({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loaded, setLoaded] = useState(false);

  function reload() {
    setCampaign(getCampaign(params.id));
    setSubs(getSubmissionsForCampaign(params.id));
  }

  useEffect(() => {
    reload();
    setLoaded(true);
  }, [params.id]);

  if (!loaded) return null;

  if (!campaign) {
    return (
      <div className="card">
        <p className="text-sm">Campaign not found.</p>
        <Link href="/brand" className="btn-ghost mt-4">
          ← Back to campaigns
        </Link>
      </div>
    );
  }

  const totalViews = subs.reduce(
    (sum, s) => sum + (s.state === "disputed" ? 0 : s.views),
    0,
  );
  const spend = subs.reduce((sum, s) => sum + earningsFor(s, campaign.cpv), 0);
  const effectiveCpv = totalViews > 0 ? spend / totalViews : 0;

  function approve(s: Submission) {
    saveSubmission({ ...s, state: "approved" });
    reload();
  }
  function dispute(s: Submission) {
    const reason = window.prompt("Reason for dispute? (10–500 chars)");
    if (!reason || reason.length < 10) return;
    saveSubmission({ ...s, state: "disputed", disputeReason: reason });
    reload();
  }
  function poll() {
    refreshViews();
    reload();
  }

  return (
    <div className="space-y-6">
      <Link href="/brand" className="text-sm text-neutral-500 hover:underline">
        ← All campaigns
      </Link>

      <div>
        <span
          className={`badge ${
            campaign.status === "live"
              ? "bg-green-100 text-green-800"
              : "bg-neutral-200 text-neutral-700"
          }`}
        >
          {campaign.status}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight mt-2">
          {campaign.name}
        </h1>
        <p className="text-neutral-600 mt-2 max-w-2xl">{campaign.brief}</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <Stat label="Budget" value={`$${campaign.budget.toLocaleString()}`} />
        <Stat label="Target CPV" value={`$${campaign.cpv.toFixed(3)}`} />
        <Stat label="Verified views" value={totalViews.toLocaleString()} />
        <Stat label="Spend to date" value={`$${spend.toFixed(2)}`} />
      </div>

      {totalViews > 0 &&
        Math.abs(effectiveCpv - campaign.cpv) / campaign.cpv > 0.15 && (
          <div className="card border-amber-300 bg-amber-50 text-sm">
            Effective CPV (${effectiveCpv.toFixed(3)}) is drifting &gt;15% from
            your target (${campaign.cpv.toFixed(3)}). Consider pausing or
            tightening eligibility.
          </div>
        )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Submissions ({subs.length})
        </h2>
        <button onClick={poll} className="btn-ghost">
          Simulate 6h poll →
        </button>
      </div>

      {subs.length === 0 ? (
        <div className="card text-sm text-neutral-600">
          No submissions yet. Share this campaign with creators or switch to the{" "}
          <Link className="underline" href="/creator">
            Creator view
          </Link>{" "}
          to submit a demo post.
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2">Creator</th>
                <th className="text-left px-4 py-2">Post</th>
                <th className="text-right px-4 py-2">Views</th>
                <th className="text-right px-4 py-2">Earnings</th>
                <th className="text-left px-4 py-2">State</th>
                <th className="text-right px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-medium">@{s.creatorHandle}</td>
                  <td className="px-4 py-3">
                    <a
                      href={s.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-neutral-600 underline truncate max-w-[220px] inline-block"
                    >
                      {s.postUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {s.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    ${earningsFor(s, campaign.cpv).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StateBadge state={s.state} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {s.state !== "approved" && s.state !== "disputed" && (
                      <>
                        <button
                          className="btn-ghost !py-1 !px-2 text-xs"
                          onClick={() => approve(s)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-ghost !py-1 !px-2 text-xs"
                          onClick={() => dispute(s)}
                        >
                          Dispute
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

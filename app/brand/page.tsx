"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getCampaigns,
  getSubmissionsForCampaign,
  earningsFor,
} from "@/lib/storage";
import type { Campaign } from "@/lib/types";

export default function BrandHome() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaigns(getCampaigns());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            Brand
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Campaigns</h1>
        </div>
        <Link href="/brand/new" className="btn-primary">
          + New campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="card text-sm text-neutral-600">
          No campaigns yet. Click <b>New campaign</b> to launch your first one.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignCard({ c }: { c: Campaign }) {
  const subs = getSubmissionsForCampaign(c.id);
  const spend = subs.reduce((sum, s) => sum + earningsFor(s, c.cpv), 0);
  const views = subs.reduce(
    (sum, s) => sum + (s.state === "disputed" ? 0 : s.views),
    0,
  );

  return (
    <Link
      href={`/brand/${c.id}`}
      className="card hover:border-ink transition block"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`badge ${
            c.status === "live"
              ? "bg-green-100 text-green-800"
              : "bg-neutral-200 text-neutral-700"
          }`}
        >
          {c.status}
        </span>
        <span className="text-xs text-neutral-500">
          ${c.cpv.toFixed(3)} / view
        </span>
      </div>
      <div className="font-medium">{c.name}</div>
      <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{c.brief}</p>
      <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
        <Stat label="Posts" value={subs.length} />
        <Stat label="Views" value={views.toLocaleString()} />
        <Stat label="Spend" value={`$${spend.toFixed(2)}`} />
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-neutral-50 rounded-lg px-3 py-2">
      <div className="text-neutral-500">{label}</div>
      <div className="font-semibold text-sm text-ink">{value}</div>
    </div>
  );
}

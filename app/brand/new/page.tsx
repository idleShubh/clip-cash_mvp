"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveCampaign, uid } from "@/lib/storage";
import type { Platform } from "@/lib/types";

export default function NewCampaign() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const defaultEnd = new Date(Date.now() + 30 * 864e5)
    .toISOString()
    .slice(0, 10);

  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [budget, setBudget] = useState(1000);
  const [cpv, setCpv] = useState(0.03);
  const [tiktok, setTiktok] = useState(true);
  const [reels, setReels] = useState(true);
  const [minFollowers, setMinFollowers] = useState(1000);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !brief.trim()) {
      setError("Name and brief are required.");
      return;
    }
    if (budget < 500) {
      setError("Minimum budget is $500.");
      return;
    }
    if (cpv < 0.01 || cpv > 0.2) {
      setError("Target CPV must be between $0.010 and $0.200.");
      return;
    }
    const platforms: Platform[] = [];
    if (tiktok) platforms.push("tiktok");
    if (reels) platforms.push("reels");
    if (platforms.length === 0) {
      setError("Pick at least one platform.");
      return;
    }

    const id = uid();
    saveCampaign({
      id,
      name: name.trim(),
      brief: brief.trim(),
      budget,
      cpv,
      platforms,
      minFollowers,
      startDate,
      endDate,
      status: "live",
      createdAt: new Date().toISOString(),
    });
    router.push(`/brand/${id}`);
  }

  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-widest text-neutral-500">
        Brand
      </p>
      <h1 className="text-3xl font-semibold tracking-tight mb-6">
        New campaign
      </h1>

      <form onSubmit={submit} className="card space-y-4">
        <Field label="Campaign name">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lumen Energy Drink · Launch Clips"
          />
        </Field>

        <Field label="Brief (what should the clip feel like?)">
          <textarea
            className="input min-h-[100px]"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Short punchy clips. Show the pour + first sip. 15–30s ideal."
            maxLength={2000}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Budget (USD, min $500)">
            <input
              className="input"
              type="number"
              min={500}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </Field>
          <Field label="Target CPV ($0.010 – $0.200)">
            <input
              className="input"
              type="number"
              min={0.01}
              max={0.2}
              step={0.005}
              value={cpv}
              onChange={(e) => setCpv(Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start date">
            <input
              className="input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>
          <Field label="End date">
            <input
              className="input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Min creator followers">
          <input
            className="input"
            type="number"
            min={0}
            step={500}
            value={minFollowers}
            onChange={(e) => setMinFollowers(Number(e.target.value))}
          />
        </Field>

        <div>
          <div className="label">Platforms</div>
          <div className="flex gap-2">
            <Toggle
              label="TikTok"
              checked={tiktok}
              onChange={setTiktok}
            />
            <Toggle
              label="Instagram Reels"
              checked={reels}
              onChange={setReels}
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-neutral-500">
            Demo: escrow deposit is simulated. No real charge.
          </p>
          <button type="submit" className="btn-primary">
            Deposit &amp; go live
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`btn ${
        checked
          ? "bg-ink text-white"
          : "bg-white border border-neutral-200 text-neutral-700"
      }`}
    >
      {label}
    </button>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getCampaigns,
  getSubmissions,
  saveSubmission,
  uid,
} from "@/lib/storage";
import type { Campaign, Platform } from "@/lib/types";

export default function CreatorFeed() {
  const [handle, setHandle] = useState("");
  const [followers, setFollowers] = useState(5000);
  const [platforms, setPlatforms] = useState<Platform[]>(["tiktok", "reels"]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedHandle = localStorage.getItem("clipcash.handle") || "";
    setHandle(savedHandle);
    const savedFollowers = Number(localStorage.getItem("clipcash.followers"));
    if (savedFollowers) setFollowers(savedFollowers);
    setCampaigns(getCampaigns().filter((c) => c.status === "live"));
    if (savedHandle) {
      setSubmittedIds(
        new Set(
          getSubmissions()
            .filter(
              (s) =>
                s.creatorHandle.toLowerCase() === savedHandle.toLowerCase(),
            )
            .map((s) => s.campaignId),
        ),
      );
    }
  }, []);

  function saveProfile() {
    localStorage.setItem("clipcash.handle", handle.trim());
    localStorage.setItem("clipcash.followers", String(followers));
  }

  function togglePlatform(p: Platform) {
    setPlatforms((list) =>
      list.includes(p) ? list.filter((x) => x !== p) : [...list, p],
    );
  }

  function submitPost(c: Campaign) {
    if (!handle.trim()) {
      alert("Set your handle first.");
      return;
    }
    const url = window.prompt(`Paste your ${c.platforms[0]} post URL`);
    if (!url) return;
    try {
      new URL(url);
    } catch {
      alert("That doesn't look like a valid URL.");
      return;
    }
    const platform: Platform = c.platforms.includes("tiktok")
      ? "tiktok"
      : "reels";
    saveSubmission({
      id: uid(),
      campaignId: c.id,
      creatorHandle: handle.trim().replace(/^@/, ""),
      postUrl: url,
      platform,
      views: 0,
      state: "pending_views",
      submittedAt: new Date().toISOString(),
    });
    setSubmittedIds(new Set([...submittedIds, c.id]));
  }

  const eligible = campaigns.filter(
    (c) =>
      c.minFollowers <= followers &&
      c.platforms.some((p) => platforms.includes(p)),
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Creator
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Campaigns for you
        </h1>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Your profile</h2>
          <Link href="/creator/earnings" className="btn-ghost text-xs">
            See earnings →
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <label>
            <span className="label">Handle</span>
            <input
              className="input"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onBlur={saveProfile}
              placeholder="rohan.clips"
            />
          </label>
          <label>
            <span className="label">Followers</span>
            <input
              className="input"
              type="number"
              min={0}
              step={500}
              value={followers}
              onChange={(e) => setFollowers(Number(e.target.value))}
              onBlur={saveProfile}
            />
          </label>
          <div>
            <span className="label">Platforms connected</span>
            <div className="flex gap-2">
              <Toggle
                label="TikTok"
                checked={platforms.includes("tiktok")}
                onChange={() => togglePlatform("tiktok")}
              />
              <Toggle
                label="Reels"
                checked={platforms.includes("reels")}
                onChange={() => togglePlatform("reels")}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-neutral-500 mt-3">
          Demo: OAuth is simulated. Eligibility is filtered from these values.
        </p>
      </div>

      {eligible.length === 0 ? (
        <div className="card text-sm text-neutral-600">
          No eligible campaigns right now. Increase your followers, connect more
          platforms, or check back later.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {eligible.map((c) => {
            const submitted = submittedIds.has(c.id);
            return (
              <div key={c.id} className="card">
                <div className="flex items-center justify-between">
                  <span className="badge bg-green-100 text-green-800">
                    live
                  </span>
                  <span className="text-xs text-neutral-500">
                    ${c.cpv.toFixed(3)} / view
                  </span>
                </div>
                <div className="font-medium mt-2">{c.name}</div>
                <p className="text-sm text-neutral-600 mt-1 line-clamp-3">
                  {c.brief}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-neutral-500">
                    Min {c.minFollowers.toLocaleString()} followers ·{" "}
                    {c.platforms.join(", ")}
                  </div>
                  <button
                    className={submitted ? "btn-ghost" : "btn-primary"}
                    disabled={submitted}
                    onClick={() => submitPost(c)}
                    title={
                      submitted ? "Only one post per campaign" : "Submit a post"
                    }
                  >
                    {submitted ? "Submitted" : "Submit post"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
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

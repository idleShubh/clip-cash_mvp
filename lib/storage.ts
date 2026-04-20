"use client";

import type { Campaign, Submission } from "./types";

const CAMPAIGNS_KEY = "clipcash.campaigns.v1";
const SUBMISSIONS_KEY = "clipcash.submissions.v1";
const SEEDED_KEY = "clipcash.seeded.v1";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function getCampaigns(): Campaign[] {
  seedIfEmpty();
  return read<Campaign>(CAMPAIGNS_KEY).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getCampaign(id: string): Campaign | undefined {
  return getCampaigns().find((c) => c.id === id);
}

export function saveCampaign(c: Campaign) {
  const all = read<Campaign>(CAMPAIGNS_KEY).filter((x) => x.id !== c.id);
  all.push(c);
  write(CAMPAIGNS_KEY, all);
}

export function getSubmissions(): Submission[] {
  return read<Submission>(SUBMISSIONS_KEY).sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  );
}

export function getSubmissionsForCampaign(campaignId: string): Submission[] {
  return getSubmissions().filter((s) => s.campaignId === campaignId);
}

export function getSubmissionsForCreator(handle: string): Submission[] {
  return getSubmissions().filter(
    (s) => s.creatorHandle.toLowerCase() === handle.toLowerCase(),
  );
}

export function saveSubmission(s: Submission) {
  const all = read<Submission>(SUBMISSIONS_KEY).filter((x) => x.id !== s.id);
  all.push(s);
  write(SUBMISSIONS_KEY, all);
}

/** Simulate the 6-hour poll cycle: add some verified views to every pending post. */
export function refreshViews() {
  const subs = read<Submission>(SUBMISSIONS_KEY);
  const updated = subs.map((s) => {
    if (s.state === "approved" || s.state === "disputed") return s;
    const bump = Math.floor(Math.random() * 5000) + 500;
    return { ...s, views: s.views + bump };
  });
  write(SUBMISSIONS_KEY, updated);
}

export function earningsFor(sub: Submission, cpv: number): number {
  if (sub.state === "disputed") return 0;
  return Math.round(sub.views * cpv * 100) / 100;
}

/** Seed a couple of demo campaigns on first visit so the MVP isn't empty. */
function seedIfEmpty() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEEDED_KEY)) return;
  window.localStorage.setItem(SEEDED_KEY, "1");

  const today = new Date().toISOString().slice(0, 10);
  const in30 = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);

  const seed: Campaign[] = [
    {
      id: uid(),
      name: "Lumen Energy Drink · Launch Clips",
      brief:
        "Short punchy clips of the new Lumen can. Show the pour + first sip. Call out the 'zero crash' line. 15–30s ideal.",
      budget: 5000,
      cpv: 0.035,
      platforms: ["tiktok", "reels"],
      minFollowers: 1000,
      startDate: today,
      endDate: in30,
      status: "live",
      createdAt: new Date().toISOString(),
    },
    {
      id: uid(),
      name: "Northwind Pods Podcast Clipping",
      brief:
        "Clip best moments from Northwind Pods latest episode. Vertical 9:16, captions mandatory, credit host handle.",
      budget: 3000,
      cpv: 0.025,
      platforms: ["tiktok"],
      minFollowers: 500,
      startDate: today,
      endDate: in30,
      status: "live",
      createdAt: new Date(Date.now() - 864e5).toISOString(),
    },
  ];
  write(CAMPAIGNS_KEY, seed);
}

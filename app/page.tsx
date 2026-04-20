import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="pt-6">
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
          ClipCash MVP
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight max-w-3xl">
          Brands pay creators
          <br />
          <span className="text-accent">per verified view.</span>
        </h1>
        <p className="mt-5 text-neutral-600 max-w-xl">
          Launch a per-view campaign in minutes. Creators post, we verify views,
          brands only pay for what lands.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/brand" className="btn-primary">
            I&apos;m a Brand → Launch a campaign
          </Link>
          <Link href="/creator" className="btn-accent">
            I&apos;m a Creator → Find clips to post
          </Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-xs text-neutral-500 mb-1">1 · Brand</div>
          <div className="font-medium">Post a brief + budget</div>
          <p className="text-sm text-neutral-600 mt-2">
            Set a target CPV, deposit budget into escrow, go live.
          </p>
        </div>
        <div className="card">
          <div className="text-xs text-neutral-500 mb-1">2 · Creator</div>
          <div className="font-medium">Submit a clip URL</div>
          <p className="text-sm text-neutral-600 mt-2">
            Browse campaigns you qualify for, submit one post per campaign.
          </p>
        </div>
        <div className="card">
          <div className="text-xs text-neutral-500 mb-1">3 · Platform</div>
          <div className="font-medium">Verify, approve, pay</div>
          <p className="text-sm text-neutral-600 mt-2">
            Views verified every 6h. Net-15 payout on approval.
          </p>
        </div>
      </section>
    </div>
  );
}

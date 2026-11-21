import { createFileRoute, Link } from "@tanstack/react-router";
import { Link2, MegaphoneOff, Plus, Share2, TimerOff, Zap } from "lucide-react";
import type { ReactNode } from "react";

import { DemoNotice } from "@/components/demo/DemoNotice";
import { FilePattern } from "@/components/demo/FilePattern";
import {
  BirdGlyph,
  FacebookGlyph,
  SolidDownloadIcon,
  ZipFileIcon,
} from "@/components/demo/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Download Page — UI Practice Demo" },
      {
        name: "description",
        content: "Educational recreation of a file download page. Not an official website.",
      },
      { property: "og:title", content: "Download Page — UI Practice Demo" },
      {
        property: "og:description",
        content: "Educational recreation of a file download page. Not an official website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DownloadPage,
});

const press = "transition active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

function HeaderButton({ children }: { children: ReactNode }) {
  return (
    <Link
      to="/login"
      className={`flex h-[30px] items-center bg-mf-btn px-[9px] text-[11px] tracking-[0.02em] text-mf-ink hover:bg-mf-btn-hover focus-visible:ring-mf-btn ${press}`}
    >
      {children}
    </Link>
  );
}

function ActionCard({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Link
      to="/login"
      className={`flex h-[55px] flex-col items-center justify-center gap-[3px] rounded-[3px] bg-mf-gray text-[12px] text-mf-text hover:bg-mf-gray-hover focus-visible:ring-mf-blue ${press}`}
    >
      <span className="text-mf-icon">{icon}</span>
      {label}
    </Link>
  );
}

const footerLinks = ["Advertising", "Terms", "Privacy Policy", "Copyright", "Abuse", "Credits", "More..."];

function DownloadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <DemoNotice />

      {/* Header */}
      <header className="flex h-[51px] items-center justify-between bg-mf-header pr-[10px] pl-[11px] md:px-6">
        <Link
          to="/login"
          aria-label="MediaFire logo (demo)"
          className={`rounded-sm focus-visible:ring-mf-btn ${press}`}
        >
          <img src="/assets/mediafire-white.svg" alt="MediaFire" className="h-auto w-[180px] max-w-[46vw]" />
        </Link>
        <nav className="flex gap-px">
          <HeaderButton>SIGN UP</HeaderButton>
          <HeaderButton>LOG IN</HeaderButton>
        </nav>
      </header>

      {/* Promo */}
      <section className="relative overflow-hidden bg-mf-royal px-5 py-5">
        <FilePattern />
        <div className="relative mx-auto max-w-[560px] rounded-[18px] bg-mf-navy px-5 pt-[24px] pb-5 text-primary-foreground">
          <h1 className="text-[20px] font-bold leading-tight">Download Faster</h1>

          <ul className="mt-[22px] flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
            <li className="flex items-center gap-[5px]">
              <TimerOff className="size-[16px] text-mf-feature" strokeWidth={2} /> No Waiting
            </li>
            <li className="flex items-center gap-[5px]">
              <Zap className="size-[16px] text-mf-feature" strokeWidth={2} /> Premium Storage
            </li>
            <li className="flex items-center gap-[5px]">
              <MegaphoneOff className="size-[16px] text-mf-feature" strokeWidth={2} /> No Ads
            </li>
          </ul>

          <div className="mt-[18px] flex h-[36px] items-center justify-between rounded-[6px] border-2 border-mf-green bg-mf-navy-inner pr-[7px] pl-[7px]">
            <span className="flex items-center gap-[10px] text-[14px] font-medium">
              <span className="size-[12px] rounded-full bg-mf-green" />
              Monthly: $3.99
            </span>
            <span className="rounded-[3px] bg-mf-green px-[6px] py-[2px] text-[10.5px] text-mf-navy">
              Most Popular
            </span>
          </div>

          <Link
            to="/login"
            className={`mt-[20px] flex h-[37px] w-full items-center justify-center gap-[10px] rounded-[4px] bg-mf-blue text-[15px] font-medium tracking-[0.01em] hover:bg-mf-blue-hover focus-visible:ring-mf-blue focus-visible:ring-offset-mf-navy ${press}`}
          >
            <Zap className="size-[18px]" strokeWidth={2} />
            DOWNLOAD FASTER NOW
          </Link>
        </div>
      </section>

      {/* Download area */}
      <main className="mx-auto w-full max-w-[600px] px-5 pt-5 pb-[25px]">
        <Link
          to="/login"
          className={`flex h-[61px] items-center rounded-[4px] bg-mf-blue pr-[34px] pl-[7px] text-primary-foreground hover:bg-mf-blue-hover focus-visible:ring-mf-blue ${press}`}
        >
          <ZipFileIcon className="h-[44px] w-[32px] shrink-0" />
          <span className="ml-[23px] min-w-0 flex-1">
            <span className="block truncate text-[16px] leading-tight font-medium">
              CINEMA FRL V7 IRUKANDJI...
            </span>
            <span className="mt-[3px] block truncate text-[12.5px] font-light">
              Download in a new tab (167.08MB)
            </span>
          </span>
          <SolidDownloadIcon className="ml-2 size-[17px] shrink-0" />
        </Link>

        <p className="mt-[26px] px-[5px] text-center text-[11.5px] leading-[1.2] font-light text-mf-text-soft">
          Clicking the download button above will start your download in a new tab and show a message
          from our advertising partners.
        </p>

        <div className="mt-[21px] grid grid-cols-2 gap-[10px]">
          <ActionCard icon={<Link2 className="size-[19px]" strokeWidth={2.4} />} label="Copy for messenger" />
          <ActionCard icon={<FacebookGlyph className="size-[19px]" />} label="Post to Facebook" />
          <ActionCard icon={<Share2 className="size-[18px]" strokeWidth={2.4} />} label="Share options" />
          <ActionCard icon={<Plus className="size-[19px]" strokeWidth={2} />} label="Save to My Files" />
        </div>
      </main>

      {/* Footer */}
      <footer className="grow border-t border-mf-line bg-mf-footer px-5 pt-[26px] pb-[25px]">
        <div className="mx-auto max-w-[600px]">
          <ul className="flex flex-wrap gap-x-[20px] gap-y-[13px] text-[12.5px] leading-[17px] text-mf-text">
            <li>©2026 MediaFire Build 121967</li>
            {footerLinks.map((l) => (
              <li key={l}>
                <Link
                  to="/login"
                  className="rounded-sm outline-none hover:text-mf-ink hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-mf-blue"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-[55px] flex gap-[10px]">
            {[
              { label: "Blog", icon: <span className="text-[17px] font-black">B</span> },
              { label: "Twitter", icon: <BirdGlyph className="size-[17px]" /> },
              { label: "Facebook", icon: <FacebookGlyph className="size-[18px]" /> },
            ].map((s) => (
              <Link
                key={s.label}
                to="/login"
                aria-label={s.label}
                className={`flex size-[28px] items-center justify-center rounded-[2px] bg-mf-social text-mf-social-icon hover:bg-mf-btn-hover focus-visible:ring-mf-blue ${press}`}
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

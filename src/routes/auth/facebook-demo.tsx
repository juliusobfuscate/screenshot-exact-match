import { createFileRoute, Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useState, type FormEvent } from "react";

import { DemoLink } from "@/components/demo/DemoLink";
import { DemoNotice } from "@/components/demo/DemoNotice";
import { DEMO_CODE, validateFacebookLogin, type DemoResult } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/facebook-demo")({
  head: () => ({
    meta: [
      { title: "Social Log-In Layout Simulation — UI Practice Demo" },
      {
        name: "description",
        content: "Mobile login layout exercise using demo data only. Not Facebook sign-in.",
      },
      { property: "og:title", content: "Social Log-In Layout Simulation — UI Practice Demo" },
      {
        property: "og:description",
        content: "Mobile login layout exercise using demo data only. Not Facebook sign-in.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FacebookDemo,
});

const field =
  "block h-[62px] w-full rounded-[12px] border border-fb-border bg-background px-[16px] text-[17px] text-fb-text outline-none transition-colors placeholder:text-fb-muted focus:border-fb-blue focus:ring-1 focus:ring-fb-blue";

function FacebookDemo() {
  // Transient component state only.
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<DemoResult | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = validateFacebookLogin(email, code);
    setResult(r);
    if (r.ok) setCode("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-fb text-fb-text">
      <DemoNotice label="Facebook-style UI demo — not Facebook sign-in" />

      <div className="flex items-start gap-[14px] border-b border-fb-line px-[14px] py-[11px] text-[14.5px] leading-[1.3] text-fb-link">
        <Info className="mt-[2px] size-[18px] shrink-0" strokeWidth={2.2} />
        <p>Ini simulasi antarmuka untuk latihan. Jangan gunakan akun asli.</p>
      </div>

      <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-4">
        <DemoLink className="mt-[18px] self-center text-[13px] text-fb-muted hover:text-fb-text">
          Bahasa Indonesia
        </DemoLink>

        <img src="/assets/facebook.svg" alt="Facebook icon (reference asset)" className="mt-[50px] size-[60px] self-center" />

        <form onSubmit={onSubmit} noValidate className="mt-[60px] flex flex-col gap-[12px]" autoComplete="off">
          {result && (
            <div
              role={result.ok ? "status" : "alert"}
              className={cn(
                "rounded-[12px] px-4 py-3 text-[14px]",
                result.ok ? "bg-fb-success-bg text-mf-success-text" : "bg-fb-error-bg text-mf-error-text",
              )}
            >
              {result.message}
            </div>
          )}
          <label className="sr-only" htmlFor="fb-email">
            Email uji
          </label>
          <input
            id="fb-email"
            type="email"
            inputMode="email"
            autoComplete="off"
            placeholder="Email uji"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
          <label className="sr-only" htmlFor="fb-code">
            Kode demonstrasi
          </label>
          <input
            id="fb-code"
            type="password"
            autoComplete="off"
            placeholder="Kode demonstrasi"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={field}
          />
          <p className="-mt-[4px] px-1 text-[12px] text-fb-muted">
            Gunakan email contoh (…@example.com) dan kode {DEMO_CODE}.
          </p>
          <button
            type="submit"
            className="h-[44px] w-full rounded-full bg-fb-blue text-[17px] font-medium text-primary-foreground outline-none transition hover:bg-fb-blue-hover focus-visible:ring-2 focus-visible:ring-fb-blue focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            Login
          </button>
        </form>

        <DemoLink className="mt-[22px] self-center text-[15px] font-medium text-fb-text">
          Lupa kata sandi?
        </DemoLink>

        <div className="min-h-[60px] flex-1" />

        <DemoLink className="flex h-[44px] w-full items-center justify-center rounded-full border border-fb-link text-[17px] font-medium text-fb-blue no-underline! hover:bg-fb-line/50">
          Buat akun baru
        </DemoLink>

        <DemoLink className="mt-[22px] flex items-center gap-[4px] self-center text-[16px] font-semibold text-fb-muted no-underline!">
          <img src="/assets/meta.svg" alt="" className="h-[13px] w-auto" />
          Meta
        </DemoLink>

        <div className="mt-[22px] mb-[22px] flex justify-center gap-[9px] text-[11px] text-fb-muted">
          <DemoLink className="hover:text-fb-text">Tentang</DemoLink>
          <DemoLink className="hover:text-fb-text">Bantuan</DemoLink>
          <DemoLink className="hover:text-fb-text">Lainnya</DemoLink>
        </div>
        <Link to="/login" className="mb-4 self-center text-[11px] text-fb-muted underline-offset-2 hover:underline">
          ← Kembali ke demo login
        </Link>
      </main>
    </div>
  );
}

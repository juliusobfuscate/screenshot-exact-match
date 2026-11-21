import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { DemoLink } from "@/components/demo/DemoLink";
import { DemoNotice } from "@/components/demo/DemoNotice";
import { DEMO_CODE, validateMainLogin, type DemoResult } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In Simulation — UI Practice Demo" },
      {
        name: "description",
        content: "Educational login form recreation that only accepts demo credentials.",
      },
      { property: "og:title", content: "Log In Simulation — UI Practice Demo" },
      {
        property: "og:description",
        content: "Educational login form recreation that only accepts demo credentials.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const inputClass =
  "block h-[56px] w-full border-0 border-b border-mf-line bg-transparent px-[1px] pt-[6px] text-[16px] text-mf-ink outline-none transition-colors placeholder:text-mf-text-soft focus:border-b-2 focus:border-mf-blue";

const socialClass =
  "relative flex h-[50px] w-full items-center justify-center rounded-[3px] bg-mf-social-btn text-[16px] text-mf-ink outline-none transition hover:bg-mf-gray-hover focus-visible:ring-2 focus-visible:ring-mf-blue active:scale-[0.99]";

function SocialInner({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <>
      <img src={icon} alt="" className="absolute left-[12px] size-[20px] object-contain" />
      {children}
    </>
  );
}

function LoginPage() {
  // Transient component state only — nothing is stored or sent anywhere.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(true);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [xNotice, setXNotice] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = validateMainLogin(email, password);
    setResult(r);
    if (r.ok) setPassword("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-open">
      <DemoNotice />

      <main className="mx-auto w-full max-w-[420px] flex-1 px-[30px]">
        <div className="mt-[48px] flex justify-center">
          <img src="/assets/mediafire.svg" alt="MediaFire" className="h-auto w-[251px] max-w-full" />
        </div>

        <h1 className="mt-[56px] text-center text-[22px] leading-tight font-light text-mf-text">
          How do you want to log in?
        </h1>

        <form onSubmit={onSubmit} noValidate className="mt-[33px]" autoComplete="off">
          {result && (
            <div
              role={result.ok ? "status" : "alert"}
              className={cn(
                "mb-[6px] border px-3 py-[5px] text-center text-[13px] leading-snug",
                result.ok
                  ? "border-mf-success-text/30 bg-mf-success-bg text-mf-success-text"
                  : "border-mf-error-border bg-mf-error-bg text-mf-error-text",
              )}
            >
              {result.message}
            </div>
          )}

          <label className="sr-only" htmlFor="demo-email">
            Email address
          </label>
          <input
            id="demo-email"
            type="email"
            inputMode="email"
            autoComplete="off"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <label className="sr-only" htmlFor="demo-password">
            Password
          </label>
          <input
            id="demo-password"
            type="password"
            autoComplete="off"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(inputClass, "mt-[5px]")}
          />
          <p className="mt-[6px] text-[11px] leading-snug text-mf-footer-text">
            Demo only: use an <span className="font-semibold">@example.com</span> or{" "}
            <span className="font-semibold">@example.test</span> email and the password{" "}
            <span className="font-semibold">{DEMO_CODE}</span>.
          </p>

          <div className="mt-[14px] flex items-center justify-between text-[13px]">
            <label className="flex cursor-pointer items-center gap-[9px] text-mf-text">
              <input
                type="checkbox"
                checked={keep}
                onChange={(e) => setKeep(e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-[16px] items-center justify-center rounded-[2px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-mf-blue/40",
                  keep ? "border-mf-blue bg-mf-blue text-primary-foreground" : "border-mf-text-soft bg-background",
                )}
              >
                {keep && <Check className="size-[13px]" strokeWidth={3.5} />}
              </span>
              Keep me logged in
            </label>
            <DemoLink className="text-mf-blue hover:text-mf-blue-hover">Forgot password?</DemoLink>
          </div>

          <button
            type="submit"
            className="mt-[33px] h-[50px] w-full rounded-[3px] bg-mf-blue text-[16px] font-light tracking-[0.02em] text-primary-foreground outline-none transition hover:bg-mf-blue-hover focus-visible:ring-2 focus-visible:ring-mf-blue focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            LOG IN
          </button>
        </form>
      </main>

      <div className="mt-[31px] border-t border-mf-line" />

      <section className="mx-auto w-full max-w-[420px] px-[30px]">
        <div className="flex flex-col gap-[25px]">
          <Link to="/auth/google-demo" className={socialClass}>
            <SocialInner icon="/assets/google.svg">LOG IN WITH GOOGLE</SocialInner>
          </Link>
          <Link to="/auth/facebook-demo" className={socialClass}>
            <SocialInner icon="/assets/facebook.svg">LOG IN WITH FACEBOOK</SocialInner>
          </Link>
          <button type="button" onClick={() => setXNotice(true)} className={socialClass}>
            <SocialInner icon="/assets/x.svg">LOG IN WITH X</SocialInner>
          </button>
        </div>

        {xNotice && (
          <div role="status" className="mt-[35px] text-center text-[13.5px] leading-[1.6] text-mf-text">
            <p className="font-bold text-mf-ink">X Login has been disabled.</p>
            <p>
              To access a MediaFire account created with X Login, please{" "}
              <DemoLink className="text-mf-blue hover:text-mf-blue-hover">request a password</DemoLink>.
            </p>
          </div>
        )}

        <div className="mt-[31px] flex min-h-[56px] items-center justify-center bg-mf-gray px-3 py-3 text-center text-[14.5px] text-mf-text">
          <p>
            Don’t have an account?{" "}
            <DemoLink className="text-mf-blue hover:text-mf-blue-hover">Create an account</DemoLink>
          </p>
        </div>
      </section>

      <footer className="mt-[47px] border-t border-mf-line bg-mf-footer pt-[32px] pb-[34px] text-center text-[12.5px] text-mf-footer-text">
        <p>
          ©2026 MediaFire <span className="ml-[6px]">Build 121967</span>
        </p>
        <p className="mt-[18px]">
          Need help?{" "}
          <DemoLink className="text-mf-blue hover:text-mf-blue-hover">Submit a ticket</DemoLink>.
        </p>
      </footer>
    </div>
  );
}

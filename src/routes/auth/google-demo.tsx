import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, CircleUserRound } from "lucide-react";
import { useId, useState, type FormEvent, type ReactNode } from "react";

import { DemoLink } from "@/components/demo/DemoLink";
import { DemoNotice } from "@/components/demo/DemoNotice";
import { DEMO_CODE, validateGoogleCode, validateGoogleEmail } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/google-demo")({
  head: () => ({
    meta: [
      { title: "Two-Step Sign-In Simulation — UI Practice Demo" },
      {
        name: "description",
        content: "Dark-theme, two-step sign-in layout exercise. Not Google sign-in.",
      },
      { property: "og:title", content: "Two-Step Sign-In Simulation — UI Practice Demo" },
      {
        property: "og:description",
        content: "Dark-theme, two-step sign-in layout exercise. Not Google sign-in.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GoogleDemo,
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  invalid?: boolean;
  inputMode?: "email" | "text";
}) {
  const id = useId();
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete="off"
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
      <div className="flex h-[54px] items-center gap-3 border-b border-g-line px-4">
        <span className="rounded-[3px] border border-g-link/60 px-2 py-[3px] text-[11px] font-bold tracking-wide text-g-link uppercase">
          Google-style UI demo — not Google sign-in
        </span>
      </div>
      <DemoNotice className="py-[3px]" />
      <main className="mx-auto w-full max-w-[460px] flex-1 px-6 pt-[21px]">
        <img
          src="/assets/mediafire-icon-white.svg"
          alt="MediaFire icon (reference asset)"
          className="size-[48px]"
        />
        {children}
      </main>
      <footer className="mx-auto flex w-full max-w-[460px] flex-wrap items-center justify-between gap-y-2 px-6 py-[24px] text-[12px] text-g-text">
        <DemoLink className="flex items-center gap-2 hover:text-g-link">
          Indonesia <ChevronDown className="size-4" />
        </DemoLink>
        <div className="flex gap-[30px]">
          <DemoLink className="hover:text-g-link">Bantuan</DemoLink>
          <DemoLink className="hover:text-g-link">Privasi</DemoLink>
          <DemoLink className="hover:text-g-link">Persyaratan</DemoLink>
        </div>
      </footer>
    </div>
  );
}

function PolicyText() {
  return (
    <p className="mt-[48px] text-[14px] leading-[1.45] text-g-soft">
      Ini hanya latihan antarmuka. Data yang diketik tidak dikirim ke mana pun. Lihat{" "}
      <DemoLink className={link}>Privasi</DemoLink> dan <DemoLink className={link}>Persyaratan</DemoLink>{" "}
      demo.
    </p>
  );
}

const nextBtn =
  "h-[40px] min-w-[120px] rounded-full bg-g-btn px-6 text-[14.5px] font-medium text-g-btn-text outline-none transition hover:bg-g-btn-hover focus-visible:ring-2 focus-visible:ring-g-link focus-visible:ring-offset-2 focus-visible:ring-offset-g-bg active:scale-[0.98]";

function GoogleDemo() {
  // Transient component state only.
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    const r = validateGoogleEmail(email);
    if (!r.ok) return setError(r.message);
    setError(null);
    setConfirmedEmail(r.message);
    setStep(2);
  };

  const submitCode = (e: FormEvent) => {
    e.preventDefault();
    const r = validateGoogleCode(code);
    if (!r.ok) {
      setSuccess(null);
      return setError(r.message);
    }
    setError(null);
    setCode("");
    setSuccess(r.message);
  };

  if (step === 1) {
    return (
      <Shell>
        <h1 className="mt-[27px] text-[32px] leading-tight">Login</h1>
        <p className="mt-[22px] text-[16px]">Simulasi alur masuk dua langkah</p>
        <form onSubmit={submitEmail} noValidate className="mt-[42px]">
          <OutlinedField
            label="Email uji"
            type="email"
            inputMode="email"
            placeholder="demo.user@example.com"
            value={email}
            onChange={setEmail}
            invalid={!!error}
          />
          {error && (
            <p role="alert" className="mt-2 text-[12.5px] text-g-error">
              {error}
            </p>
          )}
          <DemoLink className={cn(link, "mt-[12px] inline-block text-[14.5px]")}>Lupa email?</DemoLink>
          <PolicyText />
          <div className="mt-[44px] flex items-center justify-between">
            <DemoLink className={cn(link, "text-[14.5px]")}>Buat akun</DemoLink>
            <button type="submit" className={nextBtn}>
              Berikutnya
            </button>
          </div>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="mt-[27px] text-[32px] leading-tight">Selamat datang</h1>
      <div className="mt-[22px] flex items-center gap-[10px] text-[15px]">
        <CircleUserRound className="size-[21px]" strokeWidth={1.75} />
        <span className="break-all" data-testid="demo-email">
          {confirmedEmail}
        </span>
      </div>

      {success ? (
        <div role="status" className="mt-[56px] rounded-[8px] border border-g-success/50 px-4 py-4 text-[15px] text-g-success">
          {success}
          <div className="mt-3 flex gap-4 text-[14px]">
            <Link to="/login" className={link}>
              Kembali ke halaman login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submitCode} noValidate className="mt-[56px]">
          <OutlinedField
            label="Kode demonstrasi"
            type={showCode ? "text" : "password"}
            placeholder={DEMO_CODE}
            value={code}
            onChange={setCode}
            invalid={!!error}
          />
          {error && (
            <p role="alert" className="mt-2 text-[12.5px] text-g-error">
              {error}
            </p>
          )}
          <label className="mt-[12px] flex cursor-pointer items-center gap-[19px] text-[14.5px] font-medium">
            <input
              type="checkbox"
              checked={showCode}
              onChange={(e) => setShowCode(e.target.checked)}
              className="size-[18px] accent-g-link"
            />
            Tampilkan kode
          </label>
          <PolicyText />
          <div className="mt-[44px] flex items-center justify-between">
            <DemoLink className={cn(link, "text-[14.5px]")}>Lupa kode?</DemoLink>
            <button type="submit" className={nextBtn}>
              Berikutnya
            </button>
          </div>
        </form>
      )}
    </Shell>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AdminButton, AdminInput } from "@/components/settings/ui";
import { adminMeta } from "@/lib/admin/meta";
import { DEFAULT_ADMIN_TOKEN } from "@/lib/admin/rules";

export const Route = createFileRoute("/settings/")({
  head: () =>
    adminMeta("Admin Access", "Enter your access token to access the MediaFire admin panel."),
  component: AdminLogin,
});

function AdminLogin() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError("Token is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          email: email.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Save token to localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', data.admin_email);
        
        // Redirect to admin dashboard
        navigate({ to: "/settings/panel" });
      } else {
        setError(data.message || "Invalid token or email");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-adm-night font-sans">
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10">
        <img src="/assets/mediafire-white.svg" alt="MediaFire" className="h-auto w-[220px] max-w-[70vw]" />

        <form
          onSubmit={onSubmit}
          noValidate
          autoComplete="off"
          className="mt-8 w-full max-w-[400px] rounded-[8px] bg-card p-6 shadow-adm-card sm:p-8"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-[40px] items-center justify-center rounded-full bg-adm-primary/12 text-adm-primary">
              <Lock className="size-[20px]" />
            </span>
            <h1 className="text-[24px] font-bold text-adm-text">Admin Access</h1>
          </div>
          <p className="mt-2 text-[14px] text-adm-text-soft">Enter the access token to open the settings panel.</p>

          <label htmlFor="access-token" className="mt-6 block text-[14px] font-medium text-adm-text">
            Access Token
          </label>
          <div className="relative mt-[6px]">
            <AdminInput
              id="access-token"
              type={show ? "text" : "password"}
              value={token}
              autoFocus
              placeholder="Enter access token"
              aria-invalid={!!error}
              aria-describedby={error ? "token-error" : undefined}
              onChange={(e) => {
                setToken(e.target.value);
                setError(null);
              }}
              className={error ? "border-adm-danger pr-11 focus:border-adm-danger" : "pr-11"}
            />
            <button
              type="button"
              aria-label={show ? "Hide token" : "Show token"}
              onClick={() => setShow((s) => !s)}
              className="absolute top-1/2 right-2 flex size-[32px] -translate-y-1/2 items-center justify-center rounded-[4px] text-adm-text-faint outline-none hover:text-adm-text focus-visible:shadow-adm-focus"
            >
              {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          </div>

          <label htmlFor="admin-email" className="mt-4 block text-[14px] font-medium text-adm-text">
            Admin Email
          </label>
          <div className="relative mt-[6px]">
            <AdminInput
              id="admin-email"
              type="email"
              value={email}
              placeholder="Enter admin email"
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className={error ? "border-adm-danger focus:border-adm-danger" : ""}
            />
          </div>

          {error && (
            <p id="token-error" role="alert" className="mt-2 text-[13px] text-adm-danger">
              {error}
            </p>
          )}

          <AdminButton type="submit" className="mt-6 sm:w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </AdminButton>
        </form>
      </main>
    </div>
  );
}

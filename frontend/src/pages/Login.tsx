import axios from "axios";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiCheckCircle, FiFolder, FiLock, FiShield, FiZap } from "react-icons/fi";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/useAuth";

function errorMessage(error: unknown) {
  if (axios.isAxiosError<{ detail?: string }>(error)) return error.response?.data?.detail ?? "Unable to connect to FileHub.";
  return "Something went wrong. Please try again.";
}

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.18),transparent_27%),radial-gradient(circle_at_top_right,rgba(0,194,255,0.18),transparent_24%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-6 p-4 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="glass-panel flex min-h-[420px] flex-col justify-between rounded-[30px] p-6 sm:p-8 lg:p-10"
        >
          <div className="flex items-center justify-between gap-4">
            <Link className="flex items-center gap-3 text-lg font-semibold" to="/">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 text-white shadow-lg shadow-violet-500/20">
                <FiFolder size={18} />
              </span>
              <span>FileHub</span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
              <FiZap size={13} />
              Your files. One secure home.
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              Everything important, always within reach.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Store, organize, and share your work from a focused workspace built to keep your files moving with clarity.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--soft)] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><FiShield size={16} /> Private workspace</div>
                <div className="text-sm text-[var(--muted)]">Secure, calm, and always ready when you are.</div>
              </div>
              <div className="rounded-2xl bg-[var(--soft)] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><FiCheckCircle size={16} /> One tap access</div>
                <div className="text-sm text-[var(--muted)]">Ship faster with a premium collaborative feel.</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-[var(--muted)]">© 2026 FileHub</div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.04 }}
          className="flex items-center justify-center"
        >
          <div className="glass-panel w-full max-w-[430px] rounded-[30px] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-400">
              <FiZap size={13} />
              Welcome back
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">Sign in to FileHub</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Enter your details to open your workspace.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-[var(--text)]">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  className="mt-2 w-full rounded-2xl border border-[var(--stroke)] bg-[var(--soft)] px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                />
              </label>

              <label className="block text-sm font-medium text-[var(--text)]">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="mt-2 w-full rounded-2xl border border-[var(--stroke)] bg-[var(--soft)] px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-[var(--muted)]">
                  <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded accent-violet-500" />
                  Remember me
                </label>
                <button
                  type="button"
                  className="font-semibold text-violet-400 transition hover:text-violet-300"
                  onClick={() => {
                    setNotice("Password reset is coming soon. Please contact support for now.");
                    setError("");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {error ? <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert">{error}</div> : null}
              {notice ? <div className="rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-100" role="status">{notice}</div> : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                <FiLock size={16} />
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[var(--muted)]">
              New to FileHub? <Link className="font-semibold text-violet-400 transition hover:text-violet-300" to="/register">Create an account</Link>
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

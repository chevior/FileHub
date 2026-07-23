import axios from "axios";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FiCheckCircle, FiFolder, FiUserPlus, FiZap } from "react-icons/fi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/useAuth";

export default function Register() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register({ name, email, password });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(
        axios.isAxiosError<{ detail?: string }>(requestError)
          ? requestError.response?.data?.detail ?? "Unable to create your account."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(0,194,255,0.18),transparent_24%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-6 p-4 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
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
              Start organized
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              Your new digital workspace begins here.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Create one account for your files, folders, favorites, and secure sharing without adding any extra friction.
            </p>

            <div className="mt-7 space-y-3">
              {[
                "Automatic organization for your most important assets",
                "Calendar-ready collaboration with a polished, calm UI",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-[var(--soft)] p-4 text-sm text-[var(--muted)]">
                  <FiCheckCircle className="mt-0.5 text-violet-400" size={16} />
                  <span>{item}</span>
                </div>
              ))}
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
              Create account
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">Join FileHub</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Set up your private workspace in seconds.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-[var(--text)]">
                Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  minLength={2}
                  maxLength={80}
                  required
                  autoFocus
                  className="mt-2 w-full rounded-2xl border border-[var(--stroke)] bg-[var(--soft)] px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                />
              </label>

              <label className="block text-sm font-medium text-[var(--text)]">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-[var(--stroke)] bg-[var(--soft)] px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                />
              </label>

              <label className="block text-sm font-medium text-[var(--text)]">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  className="mt-2 w-full rounded-2xl border border-[var(--stroke)] bg-[var(--soft)] px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                />
                <small className="mt-2 block text-xs text-[var(--muted)]">Use at least 8 characters.</small>
              </label>

              {error ? <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert">{error}</div> : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                <FiUserPlus size={16} />
                {submitting ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[var(--muted)]">
              Already have an account? <Link className="font-semibold text-violet-400 transition hover:text-violet-300" to="/">Sign in</Link>
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

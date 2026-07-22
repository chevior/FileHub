import axios from "axios";
import { useState, type FormEvent } from "react";
import { FiCheckCircle, FiFolder, FiLock } from "react-icons/fi";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
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
    event.preventDefault(); setError(""); setSubmitting(true);
    try {
      await login({ email, password });
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || "/dashboard", { replace: true });
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setSubmitting(false); }
  };

  return <main className="auth-shell">
    <section className="auth-story">
      <Link className="brand" to="/"><span><FiFolder /></span>FileHub</Link>
      <div><div className="eyebrow">Your files. One secure home.</div><h1>Everything important, always within reach.</h1><p>Store, organize, and share your work from a focused workspace built to keep your files moving.</p><div className="trust-row"><span><FiCheckCircle />Private workspace</span><span><FiCheckCircle />Secure access</span></div></div>
      <small>© 2026 FileHub</small>
    </section>
    <section className="auth-panel"><div className="auth-card">
      <div className="mobile-brand"><span><FiFolder /></span>FileHub</div><div className="eyebrow">Welcome back</div><h2>Sign in to FileHub</h2><p>Enter your details to open your workspace.</p>
      <form onSubmit={handleSubmit}>
        <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required autoFocus /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /></label>
        <div className="auth-options"><label className="check-label"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />Remember me</label><button className="link-button" type="button" onClick={() => { setNotice("Password reset is coming soon. Please contact support for now."); setError(""); }}>Forgot password?</button></div>
        {error && <div className="form-message error" role="alert">{error}</div>}{notice && <div className="form-message" role="status">{notice}</div>}
        <button className="primary wide" type="submit" disabled={submitting}><FiLock />{submitting ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="auth-switch">New to FileHub? <Link to="/register">Create an account</Link></p>
    </div></section>
  </main>;
}

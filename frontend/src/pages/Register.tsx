import axios from "axios";
import { useState, type FormEvent } from "react";
import { FiFolder, FiUserPlus } from "react-icons/fi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function Register() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false); const [error, setError] = useState("");
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitting(true); setError("");
    try { await register({ name, email, password }); navigate("/dashboard", { replace: true }); }
    catch (requestError) { setError(axios.isAxiosError<{ detail?: string }>(requestError) ? requestError.response?.data?.detail ?? "Unable to create your account." : "Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  return <main className="auth-shell">
    <section className="auth-story"><Link className="brand" to="/"><span><FiFolder /></span>FileHub</Link><div><div className="eyebrow">Start organized</div><h1>Your new digital workspace begins here.</h1><p>Create one account for your files, folders, favorites, and secure sharing.</p></div><small>© 2026 FileHub</small></section>
    <section className="auth-panel"><div className="auth-card"><div className="mobile-brand"><span><FiFolder /></span>FileHub</div><div className="eyebrow">Create account</div><h2>Join FileHub</h2><p>Set up your private workspace in seconds.</p>
      <form onSubmit={handleSubmit}><label>Name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={2} maxLength={80} required autoFocus /></label><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} maxLength={128} required /><small className="field-hint">Use at least 8 characters.</small></label>{error && <div className="form-message error" role="alert">{error}</div>}<button className="primary wide" type="submit" disabled={submitting}><FiUserPlus />{submitting ? "Creating account…" : "Create account"}</button></form>
      <p className="auth-switch">Already have an account? <Link to="/">Sign in</Link></p>
    </div></section>
  </main>;
}

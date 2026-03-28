import { useState } from "react";
import api from "../api";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupBusiness, setSignupBusiness] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  const isSignup = mode === "signup";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await api.post("/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Login failed. Try again.";
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        name: signupName,
        businessName: signupBusiness,
        email: signupEmail,
        password: signupPassword,
      });
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Signup failed. Try again.";
      setSignupError(message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="login-page split-auth">
      <section className="auth-left">
        <div className="auth-brand">FinSight</div>
        <h1>
          AI-powered insights for smarter cash flow and confident decisions.
        </h1>
        <p>
          Predict runway, detect anomalies, and stay ahead with realtime
          financial intelligence tailored for modern businesses.
        </p>
        <ul className="auth-points">
          <li>Realtime bank sync and auto-categorization</li>
          <li>Forecasts powered by adaptive AI models</li>
          <li>Built-in risk alerts and compliance checks</li>
        </ul>
      </section>

      <section className="auth-right">
        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-tab ${!isSignup ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${isSignup ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-box">
          {isSignup ? <h2>Create Account</h2> : <h2>Welcome Back</h2>}
          {isSignup ? (
            <form onSubmit={handleSignup} className="auth-form">
              <label>Name</label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Your name"
                required
              />
              <label>Business (optional)</label>
              <input
                type="text"
                value={signupBusiness}
                onChange={(e) => setSignupBusiness(e.target.value)}
                placeholder="Your business"
              />
              <label>Email</label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
              <label>Password</label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Password"
                required
              />
              {signupError && <div className="auth-error">{signupError}</div>}
              <button type="submit" disabled={signupLoading}>
                {signupLoading ? "Creating..." : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="auth-form">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                required
              />
              {loginError && <div className="auth-error">{loginError}</div>}
              <button type="submit" disabled={loginLoading}>
                {loginLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

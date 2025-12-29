import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "./components/context/services/api";
//import ThreeBackground from "./ThreeBackground";


export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", formData.email);
      const data = await api.login(formData);
      console.log('Login API response:', data);

      if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
        // Determine redirect path
        const redirectPath = data.role === 'admin' ? '/admin' : '/products';
        console.log('User role:', data.role, 'Redirecting to:', redirectPath);

        // Use navigate instead of window.location
        navigate(redirectPath, { replace: true });
      } else {
        console.warn("Login failed (no token):", data);
        setError(data.message || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
        const redirectPath = data.role === 'admin' ? '/admin' : '/products';
        navigate(redirectPath, { replace: true });
      } else {
        setError(data.message || "Google sign-in failed");
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: "480px", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", color: "#800020", marginBottom: "10px" }}>Welcome Back</h1>
          <p style={{ color: "#666", fontSize: "16px" }}>Sign in to continue your journey</p>
        </div>

        {/* Form Card */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "40px", border: "2px solid #e8d5c4" }}>
          {error && (
            <div style={{ backgroundColor: "#fee", border: "1px solid #fcc", color: "#c00", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#800020", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{ width: "100%", padding: "14px 16px", border: "2px solid #e8d5c4", borderRadius: "10px", fontSize: "15px", transition: "all 0.3s ease" }}
                placeholder="you@example.com"
                onFocus={(e) => e.target.style.borderColor = "#d4af37"}
                onBlur={(e) => e.target.style.borderColor = "#e8d5c4"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#800020", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Password</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                style={{ width: "100%", padding: "14px 16px", border: "2px solid #e8d5c4", borderRadius: "10px", fontSize: "15px", transition: "all 0.3s ease" }}
                placeholder="••••••••"
                onFocus={(e) => e.target.style.borderColor = "#d4af37"}
                onBlur={(e) => e.target.style.borderColor = "#e8d5c4"}
              />
            </div>

            {/* Remember & Forgot */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", fontSize: "14px" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#666" }}>
                <input type="checkbox" style={{ marginRight: "8px" }} />
                Remember me
              </label>
              <a href="#" style={{ color: "#800020", textDecoration: "none", fontWeight: "500" }}>Forgot password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", color: "#d4af37", padding: "16px", borderRadius: "50px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", border: "2px solid #d4af37", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.3s ease", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ position: "relative", margin: "30px 0" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
              <div style={{ width: "100%", borderTop: "1px solid #e8d5c4" }}></div>
            </div>
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <span style={{ padding: "0 16px", backgroundColor: "white", color: "#999", fontSize: "13px" }}>Or continue with</span>
            </div>
          </div>

          {/* Social */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="400"
            />
          </div>
        </div>

        {/* Sign Up Link */}
        <p style={{ textAlign: "center", marginTop: "30px", color: "#666", fontSize: "15px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#800020", fontWeight: "600", textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}





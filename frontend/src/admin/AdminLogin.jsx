import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const isDev = Boolean(import.meta.env.DEV);
  const [email, setEmail] = useState(isDev ? 'admin@rakshith.dev' : '');
  const [password, setPassword] = useState(isDev ? 'admin123' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@rakshith.dev');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-[#030712] overflow-hidden">
      {/* Background Neon ambient spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back to Portfolio Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Public Portfolio</span>
          </Link>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/30 mb-4">
              <Shield size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Rakshith H R – Management Console
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rakshith.dev"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl glass-input text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Quick Demo Fill button (Only visible during local development) */}
            {isDev && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Dev Mode: admin@rakshith.dev / admin123</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-cyan-400 hover:underline font-mono"
                >
                  Auto Fill
                </button>
              </div>
            )}

            {/* Sign in Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 font-mono">
              Secured with JWT authentication & bcrypt hashing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Key,
  Shield,
  UserCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export const SecurityManager = ({ triggerToast }) => {
  const { admin } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength calculator
  const calculateStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700', width: '0%' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (score === 3 || score === 4)
      return { score: 3, label: 'Good', color: 'bg-cyan-400', width: '75%' };
    return { score: 5, label: 'Strong', color: 'bg-emerald-400', width: '100%' };
  };

  const strength = calculateStrength(newPassword);

  const validate = () => {
    const errs = {};
    if (!currentPassword) {
      errs.currentPassword = 'Enter your current password';
    }
    if (!newPassword) {
      errs.newPassword = 'Enter a new password';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'New password must be at least 6 characters';
    } else if (newPassword === currentPassword) {
      errs.newPassword = 'New password must be different from current password';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      triggerToast('Please correct the validation errors in the form', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.auth.updatePassword({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        triggerToast(res.message || 'Password updated successfully! Next login requires new credentials.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
      }
    } catch (err) {
      triggerToast(err.data?.message || err.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Security & Password Management</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Update administrative credentials, verify session integrity, and enforce strong password policies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Change Password Form */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Key size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Change Admin Password</h3>
                <p className="text-xs text-slate-400">
                  Password changes take effect immediately across all sessions.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (errors.currentPassword) setErrors({ ...errors, currentPassword: '' });
                    }}
                    placeholder="Enter current password"
                    className={`w-full pl-10 pr-11 py-2.5 rounded-xl glass-input text-sm ${
                      errors.currentPassword ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key size={16} />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                    }}
                    placeholder="Enter new strong password"
                    className={`w-full pl-10 pr-11 py-2.5 rounded-xl glass-input text-sm ${
                      errors.newPassword ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.newPassword}</p>
                )}

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2.5 space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Strength:</span>
                      <span
                        className={`font-bold ${
                          strength.score <= 1
                            ? 'text-red-400'
                            : strength.score === 2
                            ? 'text-amber-400'
                            : strength.score === 3
                            ? 'text-cyan-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="Repeat new password"
                    className={`w-full pl-10 pr-11 py-2.5 rounded-xl glass-input text-sm ${
                      errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Verifying & Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Security Auditing & Guidelines */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Admin Session Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck size={18} className="text-cyan-400" />
              <span>Current Session Details</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-mono">Admin Name</span>
                <span className="font-semibold text-white">{admin?.name || 'Rakshith H R'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-mono">Email</span>
                <span className="font-mono text-slate-200">{admin?.email || 'admin@rakshith.dev'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-mono">Role</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono text-[11px]">
                  {admin?.role || 'admin'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-400 font-mono">Encryption</span>
                <span className="text-emerald-400 font-mono font-semibold">Bcrypt (10 Salt Rounds)</span>
              </div>
            </div>
          </div>

          {/* Password Policy Guidelines */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Security Recommendations</span>
            </h4>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Use at least 8 characters with mixed case letters, numbers, and symbols.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Never share your admin password or store credentials in unencrypted notes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>Session tokens expire automatically after 30 days of inactivity.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

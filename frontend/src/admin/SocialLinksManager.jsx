import React, { useState, useEffect } from 'react';
import {
  Share2,
  Github,
  Linkedin,
  Mail,
  Twitter,
  Code,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const SocialLinksManager = ({ triggerToast }) => {
  const { profile, refreshData } = usePortfolio();

  const [formData, setFormData] = useState({
    github: '',
    linkedin: '',
    email: '',
    twitter: '',
    leetcode: '',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.socialLinks) {
      setFormData({
        github: profile.socialLinks.github || '',
        linkedin: profile.socialLinks.linkedin || '',
        email: profile.socialLinks.email ? profile.socialLinks.email.replace('mailto:', '') : '',
        twitter: profile.socialLinks.twitter || '',
        leetcode: profile.socialLinks.leetcode || '',
      });
    }
  }, [profile]);

  const validate = () => {
    const errs = {};
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.github && !urlPattern.test(formData.github)) {
      errs.github = 'Please enter a valid GitHub profile URL';
    }
    if (formData.linkedin && !urlPattern.test(formData.linkedin)) {
      errs.linkedin = 'Please enter a valid LinkedIn profile URL';
    }
    if (formData.twitter && !urlPattern.test(formData.twitter)) {
      errs.twitter = 'Please enter a valid Twitter/X profile URL';
    }
    if (formData.leetcode && !urlPattern.test(formData.leetcode)) {
      errs.leetcode = 'Please enter a valid LeetCode profile URL';
    }
    if (formData.email && !emailPattern.test(formData.email.replace('mailto:', '').trim())) {
      errs.email = 'Please enter a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      triggerToast('Please correct the validation errors in the form', 'error');
      return;
    }

    try {
      setSaving(true);
      const cleanEmail = formData.email.trim();
      const emailValue = cleanEmail.startsWith('mailto:')
        ? cleanEmail
        : cleanEmail
        ? `mailto:${cleanEmail}`
        : '';

      const payload = {
        socialLinks: {
          github: formData.github.trim(),
          linkedin: formData.linkedin.trim(),
          email: emailValue,
          twitter: formData.twitter.trim(),
          leetcode: formData.leetcode.trim(),
        },
      };

      const res = await api.profile.update(payload);
      if (res.success) {
        await refreshData();
        triggerToast('Social links updated successfully! Live on portfolio.');
      }
    } catch (err) {
      triggerToast('Failed to update social links: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Social Media & Links</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure external profiles displayed in the hero, about, contact, and footer sections.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
          {/* GitHub URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Github size={16} className="text-blue-400" />
                <span>GitHub Profile URL</span>
              </label>
              {formData.github && (
                <a
                  href={formData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  <span>Test Link</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/Rakshith-HR"
              className={`w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono ${
                errors.github ? 'border-red-500 ring-1 ring-red-500' : ''
              }`}
            />
            {errors.github && <p className="text-xs text-red-400 mt-1">{errors.github}</p>}
          </div>

          {/* LinkedIn URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Linkedin size={16} className="text-cyan-400" />
                <span>LinkedIn Profile URL</span>
              </label>
              {formData.linkedin && (
                <a
                  href={formData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  <span>Test Link</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/rakshith-hr"
              className={`w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono ${
                errors.linkedin ? 'border-red-500 ring-1 ring-red-500' : ''
              }`}
            />
            {errors.linkedin && <p className="text-xs text-red-400 mt-1">{errors.linkedin}</p>}
          </div>

          {/* Primary Contact Email */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Mail size={16} className="text-purple-400" />
                <span>Primary Contact Email (Mailto Link)</span>
              </label>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rakshith@example.com"
              className={`w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono ${
                errors.email ? 'border-red-500 ring-1 ring-red-500' : ''
              }`}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Twitter / X URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Twitter size={16} className="text-sky-400" />
                <span>Twitter / X Profile URL (Optional)</span>
              </label>
              {formData.twitter && (
                <a
                  href={formData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
                >
                  <span>Test Link</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://x.com/username"
              className={`w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono ${
                errors.twitter ? 'border-red-500 ring-1 ring-red-500' : ''
              }`}
            />
            {errors.twitter && <p className="text-xs text-red-400 mt-1">{errors.twitter}</p>}
          </div>

          {/* LeetCode URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Code size={16} className="text-amber-400" />
                <span>LeetCode / Competitive Programming URL (Optional)</span>
              </label>
              {formData.leetcode && (
                <a
                  href={formData.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                >
                  <span>Test Link</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <input
              type="text"
              name="leetcode"
              value={formData.leetcode}
              onChange={handleChange}
              placeholder="https://leetcode.com/username"
              className={`w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono ${
                errors.leetcode ? 'border-red-500 ring-1 ring-red-500' : ''
              }`}
            />
            {errors.leetcode && <p className="text-xs text-red-400 mt-1">{errors.leetcode}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving Links...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Social Links</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

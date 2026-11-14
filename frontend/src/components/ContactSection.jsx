import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import api from '../services/api.js';

export const ContactSection = () => {
  const { profile } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format';
    }
    if (!formData.subject.trim()) errs.subject = 'Please specify a subject';
    if (!formData.message.trim()) errs.message = 'Please write your message';
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
    setSuccessMessage('');
    setServerError('');

    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await api.messages.send(formData);

      if (res.success) {
        setSuccessMessage(
          res.message || 'Thank you! Your message has been sent successfully.'
        );
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 },
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      }
    } catch (err) {
      setServerError(
        err.data?.message || err.message || 'Failed to submit message. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Mail size={13} />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact <span className="gradient-text">Me</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Whether you have an internship opportunity, project collaboration, or just want to connect, feel free to drop a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles size={20} className="text-cyan-400" />
                <span>Let&apos;s talk!</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                I am actively seeking software engineering, full-stack, and developer roles. My inbox is always open for inquiries and opportunities.
              </p>

              {/* Direct Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-800 text-blue-400 border border-slate-700/80">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Email Address</p>
                    <a
                      href={`mailto:${profile?.email || 'rakshith@example.com'}`}
                      className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors break-all"
                    >
                      {profile?.email || 'rakshith@example.com'}
                    </a>
                  </div>
                </div>

                {profile?.phone && (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-slate-800 text-purple-400 border border-slate-700/80">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-mono">Phone</p>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-sm font-semibold text-white hover:text-purple-400 transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-800 text-emerald-400 border border-slate-700/80">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Location</p>
                    <p className="text-sm font-semibold text-white">
                      {profile?.location || 'Mangalore, Karnataka, India'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-slate-800">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Follow & Connect Online:
                </p>
                <div className="flex items-center gap-3">
                  {profile?.socialLinks?.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-blue-500/50 shadow-sm transition-all hover:scale-105"
                      aria-label="GitHub Profile"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {profile?.socialLinks?.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-400 border border-slate-700 hover:border-blue-500/50 shadow-sm transition-all hover:scale-105"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  <a
                    href={`mailto:${profile?.email || 'rakshith@example.com'}`}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 shadow-sm transition-all hover:scale-105"
                    aria-label="Direct Email"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-6 sm:p-8 rounded-3xl relative">
              <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
              <p className="text-slate-400 text-sm mb-6">
                Your message is stored securely in MongoDB and notified directly to the admin dashboard.
              </p>

              {/* Success Notification */}
              {successMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3 animate-in fade-in duration-300">
                  <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-white">Message Sent!</p>
                    <p>{successMessage}</p>
                  </div>
                </div>
              )}

              {/* Error Notification */}
              {serverError && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
                  <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-400" />
                  <div>
                    <p className="font-semibold text-white">Submission Error</p>
                    <p>{serverError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className={`w-full px-4 py-3 rounded-xl glass-input text-sm ${
                        errors.name ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      className={`w-full px-4 py-3 rounded-xl glass-input text-sm ${
                        errors.email ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject field */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Project Inquiry / Job Opportunity"
                    className={`w-full px-4 py-3 rounded-xl glass-input text-sm ${
                      errors.subject ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-400 mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message field */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    className={`w-full px-4 py-3 rounded-xl glass-input text-sm resize-none ${
                      errors.message ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400 mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

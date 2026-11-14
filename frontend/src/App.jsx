import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { usePortfolio } from './context/PortfolioContext.jsx';

// Public Portfolio Components
import { Navbar } from './components/Navbar.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { AboutSection } from './components/AboutSection.jsx';
import { SkillsSection } from './components/SkillsSection.jsx';
import { EducationSection } from './components/EducationSection.jsx';
import { ProjectsSection } from './components/ProjectsSection.jsx';
import { ExperienceSection } from './components/ExperienceSection.jsx';
import { CertificationsSection } from './components/CertificationsSection.jsx';
import { ContactSection } from './components/ContactSection.jsx';
import { Footer } from './components/Footer.jsx';

// Admin Components
import { AdminLogin } from './admin/AdminLogin.jsx';
import { AdminLayout } from './admin/AdminLayout.jsx';

// Public Portfolio Full Page Container
const PublicPortfolio = () => {
  const { loading } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-500/20" />
          <p className="text-xs font-mono text-slate-400">Loading Portfolio Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 relative selection:bg-blue-600/30 overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <EducationSection />
        <ProjectsSection />
        <ExperienceSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <Routes>
      {/* Public Portfolio Route */}
      <Route path="/" element={<PublicPortfolio />} />

      {/* Admin Authentication Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Dashboard Route */}
      <Route path="/admin" element={<AdminLayout />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

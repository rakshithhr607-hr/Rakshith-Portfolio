import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        profileRes,
        skillsRes,
        projectsRes,
        educationRes,
        experienceRes,
        certificationsRes,
        resumeRes,
      ] = await Promise.allSettled([
        api.profile.get(),
        api.skills.getAll(),
        api.projects.getAll(),
        api.education.getAll(),
        api.experience.getAll(),
        api.certifications.getAll(),
        api.resume.getActive(),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        setProfile(profileRes.value.data);
      }
      if (skillsRes.status === 'fulfilled' && skillsRes.value?.data) {
        setSkills(skillsRes.value.data);
      }
      if (projectsRes.status === 'fulfilled' && projectsRes.value?.data) {
        setProjects(projectsRes.value.data);
      }
      if (educationRes.status === 'fulfilled' && educationRes.value?.data) {
        setEducation(educationRes.value.data);
      }
      if (experienceRes.status === 'fulfilled' && experienceRes.value?.data) {
        setExperience(experienceRes.value.data);
      }
      if (certificationsRes.status === 'fulfilled' && certificationsRes.value?.data) {
        setCertifications(certificationsRes.value.data);
      }
      if (resumeRes.status === 'fulfilled' && resumeRes.value?.data) {
        setResume(resumeRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load portfolio data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        skills,
        projects,
        education,
        experience,
        certifications,
        resume,
        loading,
        error,
        refreshData: fetchAllData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);

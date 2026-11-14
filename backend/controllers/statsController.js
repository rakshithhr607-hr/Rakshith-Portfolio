import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Message from '../models/Message.js';
import Certification from '../models/Certification.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Resume from '../models/Resume.js';
import { getStore } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

export const getDashboardStats = async (req, res) => {
  try {
    if (isMongoActive()) {
      const [
        totalProjects,
        totalSkills,
        totalMessages,
        unreadMessages,
        totalCertifications,
        totalExperiences,
        totalEducations,
        activeResume,
        recentMessages,
      ] = await Promise.all([
        Project.countDocuments(),
        Skill.countDocuments(),
        Message.countDocuments(),
        Message.countDocuments({ isRead: false }),
        Certification.countDocuments(),
        Experience.countDocuments(),
        Education.countDocuments(),
        Resume.findOne({ isActive: true }).select('title downloadsCount createdAt'),
        Message.find().sort({ createdAt: -1 }).limit(5),
      ]);

      return res.status(200).json({
        success: true,
        stats: {
          totalProjects,
          totalSkills,
          totalMessages,
          unreadMessages,
          totalCertifications,
          totalExperiences,
          totalEducations,
          hasActiveResume: !!activeResume,
          resumeDownloads: activeResume ? activeResume.downloadsCount : 0,
        },
        recentMessages,
      });
    } else {
      const store = getStore();
      const activeResume = store.resumes.find((r) => r.isActive) || store.resumes[0] || null;
      const unreadMessages = store.messages.filter((m) => !m.isRead).length;

      return res.status(200).json({
        success: true,
        stats: {
          totalProjects: store.projects.length,
          totalSkills: store.skills.length,
          totalMessages: store.messages.length,
          unreadMessages,
          totalCertifications: store.certifications.length,
          totalExperiences: store.experience.length,
          totalEducations: store.education.length,
          hasActiveResume: !!activeResume,
          resumeDownloads: activeResume ? activeResume.downloadsCount : 0,
        },
        recentMessages: store.messages.slice(0, 5),
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

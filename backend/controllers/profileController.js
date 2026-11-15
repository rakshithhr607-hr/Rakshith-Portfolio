import mongoose from 'mongoose';
import Profile from '../models/Profile.js';
import { getStore, saveStore } from '../config/fallbackStore.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

export const defaultProfileData = {
  name: 'Rakshith H R',
  title: 'Full Stack Developer & Engineering Student',
  typingRoles: [
    'Full Stack Developer',
    'Software Developer',
    'Engineering Student',
    'AI Enthusiast',
    'Problem Solver',
  ],
  intro:
    'Passionate Information Science and Engineering student with strong hands-on experience in full-stack web development, modern cloud architectures, and scalable software solutions.',
  about:
    'Hello! I am Rakshith H R, an engineering student at AJ Institute of Engineering and Technology, Mangalore, specializing in Information Science and Engineering. I thrive on architecting clean, responsive, and performance-optimized digital experiences. My journey involves crafting modern web applications with cutting-edge technologies like React, Node.js, and MongoDB, while constantly exploring AI integrations and developer tools.',
  profileImage: '',
  resumeUrl: '/uploads/Rakshith_HR_Resume.pdf',
  email: 'rakshith@example.com',
  phone: '+91 9876543210',
  location: 'Mangalore, Karnataka, India',
  careerInterests: [
    'Full Stack Web Development',
    'Distributed Systems & Cloud',
    'Artificial Intelligence & ML',
    'Open Source Software',
  ],
  socialLinks: {
    github: 'https://github.com/rakshithhr607-hr',
    linkedin: 'https://linkedin.com/in/rakshith-hr',
    email: 'mailto:rakshith@example.com',
    twitter: '',
    leetcode: '',
  },
  stats: {
    projectsCount: 10,
    skillsCount: 15,
    yearsExperience: '2+',
    contributions: '150+',
  },
};

export const getProfile = async (req, res) => {
  try {
    if (isMongoActive()) {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = await Profile.create(defaultProfileData);
      }
      return res.status(200).json({ success: true, data: profile });
    } else {
      const store = getStore();
      return res.status(200).json({ success: true, data: store.profile });
    }
  } catch (error) {
    const store = getStore();
    res.status(200).json({ success: true, data: store.profile || defaultProfileData });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (isMongoActive()) {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = new Profile(req.body);
      } else {
        Object.assign(profile, req.body);
      }
      const updatedProfile = await profile.save();
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      });
    } else {
      const store = getStore();
      store.profile = {
        ...store.profile,
        ...req.body,
        socialLinks: {
          ...store.profile.socialLinks,
          ...(req.body.socialLinks || {}),
        },
        stats: {
          ...store.profile.stats,
          ...(req.body.stats || {}),
        },
      };
      saveStore(store);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: store.profile,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    if (isMongoActive()) {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = new Profile({ ...defaultProfileData, profileImage: imageUrl });
      } else {
        profile.profileImage = imageUrl;
      }
      await profile.save();
      return res.status(200).json({
        success: true,
        message: 'Profile picture uploaded and updated successfully',
        imageUrl,
        data: profile,
      });
    } else {
      const store = getStore();
      store.profile.profileImage = imageUrl;
      saveStore(store);
      return res.status(200).json({
        success: true,
        message: 'Profile picture uploaded and updated successfully',
        imageUrl,
        data: store.profile,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

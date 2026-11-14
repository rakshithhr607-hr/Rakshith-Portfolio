import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

import { defaultProfileData } from '../controllers/profileController.js';
import { defaultSkillsList } from '../controllers/skillController.js';
import { defaultProjectsList } from '../controllers/projectController.js';
import { defaultEducationList } from '../controllers/educationController.js';
import { defaultExperienceList } from '../controllers/experienceController.js';
import { defaultCertificationsList } from '../controllers/certificationController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const storeFilePath = path.join(dataDir, 'store.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate unique ID helper
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Initial store state
const getInitialStore = () => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('admin123', salt);

  return {
    admin: {
      _id: 'admin_root_1',
      name: 'Rakshith H R',
      email: 'admin@rakshith.dev',
      password: hashedPassword,
      role: 'admin',
      lastLogin: null,
    },
    profile: {
      _id: 'profile_root_1',
      ...defaultProfileData,
      resumeUrl: '/uploads/Rakshith_HR_Resume.pdf',
    },
    skills: defaultSkillsList.map((s, idx) => ({
      _id: `skill_${idx + 1}`,
      ...s,
      order: idx + 1,
      createdAt: new Date().toISOString(),
    })),
    projects: defaultProjectsList.map((p, idx) => ({
      _id: `proj_${idx + 1}`,
      ...p,
      order: idx + 1,
      createdAt: new Date().toISOString(),
    })),
    education: defaultEducationList.map((e, idx) => ({
      _id: `edu_${idx + 1}`,
      ...e,
      order: idx + 1,
      createdAt: new Date().toISOString(),
    })),
    experience: defaultExperienceList.map((x, idx) => ({
      _id: `exp_${idx + 1}`,
      ...x,
      order: idx + 1,
      createdAt: new Date().toISOString(),
    })),
    certifications: defaultCertificationsList.map((c, idx) => ({
      _id: `cert_${idx + 1}`,
      ...c,
      order: idx + 1,
      createdAt: new Date().toISOString(),
    })),
    messages: [
      {
        _id: 'msg_sample_1',
        name: 'Kavya Sharma',
        email: 'kavya.sharma@example.com',
        subject: 'Exciting Full Stack Opportunity',
        message: 'Hi Rakshith, I saw your portfolio and was very impressed with StudentHub and HumanTwin AI. Would love to discuss a project!',
        isRead: false,
        replied: false,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
    resumes: [
      {
        _id: 'resume_default_1',
        title: 'Rakshith_HR_Resume.pdf',
        filename: 'Rakshith_HR_Resume.pdf',
        filePath: '/uploads/Rakshith_HR_Resume.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        isActive: true,
        downloadsCount: 15,
        createdAt: new Date().toISOString(),
      },
    ],
  };
};

export const getStore = () => {
  if (!fs.existsSync(storeFilePath)) {
    const initial = getInitialStore();
    fs.writeFileSync(storeFilePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const content = fs.readFileSync(storeFilePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading fallback store:', err.message);
    const initial = getInitialStore();
    fs.writeFileSync(storeFilePath, JSON.stringify(initial, null, 2));
    return initial;
  }
};

export const saveStore = (data) => {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving fallback store:', err.message);
  }
};

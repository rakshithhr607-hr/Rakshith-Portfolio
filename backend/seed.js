import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Admin from './models/Admin.js';
import Profile from './models/Profile.js';
import Skill from './models/Skill.js';
import Project from './models/Project.js';
import Education from './models/Education.js';
import Experience from './models/Experience.js';
import Certification from './models/Certification.js';

import { defaultProfileData } from './controllers/profileController.js';
import { defaultSkillsList } from './controllers/skillController.js';
import { defaultProjectsList } from './controllers/projectController.js';
import { defaultEducationList } from './controllers/educationController.js';
import { defaultExperienceList } from './controllers/experienceController.js';
import { defaultCertificationsList } from './controllers/certificationController.js';

dotenv.config();

const seedDatabase = async () => {
  // --- Guard: require credentials from environment ---
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      '[seed] ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file.\n' +
      '       Seeding aborted — no data was changed.'
    );
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rakshith_portfolio';

  try {
    console.log('[seed] Connecting to MongoDB…');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
    console.log('[seed] Connection established.');

    // 1. Admin — create only if no admin exists yet
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('[seed] Admin already exists — skipping admin creation.');
    } else {
      const admin = new Admin({
        name: 'Rakshith H R',
        email: adminEmail,
        password: adminPassword, // hashed by the Admin model pre-save hook
        role: 'admin',
      });
      await admin.save();
      console.log(`[seed] Admin account created for: ${adminEmail}`);
    }

    // 2. Profile — seed only when collection is empty
    const profileCount = await Profile.countDocuments();
    if (profileCount > 0) {
      console.log('[seed] Profile already exists — skipping.');
    } else {
      const profile = await Profile.create({ ...defaultProfileData });
      console.log(`[seed] Profile seeded: ${profile.name}`);
    }

    // 3. Skills — seed only when collection is empty
    const skillCount = await Skill.countDocuments();
    if (skillCount > 0) {
      console.log(`[seed] Skills already exist (${skillCount}) — skipping.`);
    } else {
      await Skill.insertMany(defaultSkillsList);
      console.log(`[seed] Seeded ${defaultSkillsList.length} skills.`);
    }

    // 4. Education — seed only when collection is empty
    const eduCount = await Education.countDocuments();
    if (eduCount > 0) {
      console.log(`[seed] Education already exists (${eduCount}) — skipping.`);
    } else {
      await Education.insertMany(defaultEducationList);
      console.log(`[seed] Seeded ${defaultEducationList.length} education entries.`);
    }

    // 5. Projects — seed only when collection is empty
    const projectCount = await Project.countDocuments();
    if (projectCount > 0) {
      console.log(`[seed] Projects already exist (${projectCount}) — skipping.`);
    } else {
      await Project.insertMany(defaultProjectsList);
      console.log(`[seed] Seeded ${defaultProjectsList.length} projects.`);
    }

    // 6. Experience — seed only when collection is empty
    const expCount = await Experience.countDocuments();
    if (expCount > 0) {
      console.log(`[seed] Experience already exists (${expCount}) — skipping.`);
    } else {
      await Experience.insertMany(defaultExperienceList);
      console.log(`[seed] Seeded ${defaultExperienceList.length} experience entries.`);
    }

    // 7. Certifications — seed only when collection is empty
    const certCount = await Certification.countDocuments();
    if (certCount > 0) {
      console.log(`[seed] Certifications already exist (${certCount}) — skipping.`);
    } else {
      await Certification.insertMany(defaultCertificationsList);
      console.log(`[seed] Seeded ${defaultCertificationsList.length} certifications.`);
    }

    console.log('\n[seed] ✓ Seeding complete.');
  } catch (error) {
    console.error('[seed] ERROR:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[seed] MongoDB connection closed.');
  }
};

seedDatabase();

import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Rakshith H R',
    },
    title: {
      type: String,
      default: 'Full Stack Developer & Engineering Student',
    },
    typingRoles: {
      type: [String],
      default: [
        'Full Stack Developer',
        'Software Developer',
        'Engineering Student',
        'AI Enthusiast',
        'Problem Solver',
      ],
    },
    intro: {
      type: String,
      default:
        'Passionate Information Science and Engineering student with strong hands-on experience in full-stack web development, modern cloud architectures, and scalable software solutions.',
    },
    about: {
      type: String,
      default:
        'Hello! I am Rakshith H R, an engineering student at AJ Institute of Engineering and Technology, Mangalore, specializing in Information Science and Engineering. I thrive on architecting clean, responsive, and performance-optimized digital experiences. My journey involves crafting modern web applications with cutting-edge technologies like React, Node.js, and MongoDB, while constantly exploring AI integrations and developer tools.',
    },
    profileImage: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: 'rakshith@example.com',
    },
    phone: {
      type: String,
      default: '+91 9876543210',
    },
    location: {
      type: String,
      default: 'Mangalore, Karnataka, India',
    },
    careerInterests: {
      type: [String],
      default: [
        'Full Stack Web Development',
        'Distributed Systems & Cloud',
        'Artificial Intelligence & ML',
        'Open Source Software',
      ],
    },
    socialLinks: {
      github: {
        type: String,
        default: 'https://github.com/Rakshith-HR',
      },
      linkedin: {
        type: String,
        default: 'https://linkedin.com/in/rakshith-hr',
      },
      email: {
        type: String,
        default: 'mailto:rakshith@example.com',
      },
      twitter: {
        type: String,
        default: '',
      },
      leetcode: {
        type: String,
        default: '',
      },
    },
    stats: {
      projectsCount: { type: Number, default: 10 },
      skillsCount: { type: Number, default: 15 },
      yearsExperience: { type: String, default: '2+' },
      contributions: { type: String, default: '150+' },
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;

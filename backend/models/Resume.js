import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Rakshith_HR_Resume.pdf',
    },
    filename: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;

import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    startYear: {
      type: String,
      default: '2021',
    },
    endYear: {
      type: String,
      default: '2025',
    },
    grade: {
      type: String,
      default: '8.8 CGPA',
    },
    location: {
      type: String,
      default: 'Mangalore, Karnataka',
    },
    description: {
      type: String,
      default:
        'Focused on Software Engineering, Data Structures & Algorithms, Database Management Systems, Computer Networks, and Full-Stack Development.',
    },
    highlights: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Education = mongoose.model('Education', educationSchema);
export default Education;

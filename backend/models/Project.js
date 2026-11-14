import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      default: 'Full Stack',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;

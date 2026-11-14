import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certification title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuer/Organization is required'],
      trim: true,
    },
    issueDate: {
      type: String,
      default: '',
    },
    expiryDate: {
      type: String,
      default: 'No Expiration',
    },
    credentialId: {
      type: String,
      default: '',
    },
    credentialUrl: {
      type: String,
      default: '',
    },
    certificateImage: {
      type: String,
      default: '',
    },
    skillsCovered: {
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

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;

import mongoose, { Schema, model } from 'mongoose';
import { UserDoc } from '../../types/User.types';

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'viewer', 'user', 'developer'], required: true },
    userType: { type: String, enum: ['internal', 'external'], required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: false },
  },
  { timestamps: true }
);

const UserModel = model<UserDoc>('User', userSchema);
export default UserModel;

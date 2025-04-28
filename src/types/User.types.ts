import { Document, Types } from 'mongoose';

export interface UserDoc extends Document {
  email: string;
  password: string;
  role: 'admin' | 'viewer' | 'user' | 'developer';
  userType: 'internal' | 'external';
  companyId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

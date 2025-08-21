import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'creator' | 'business' | 'student' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatarUrl?: string;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['creator', 'business', 'student', 'admin'], default: 'creator' },
  avatarUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);

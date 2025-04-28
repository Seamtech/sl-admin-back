import { Document, Types } from 'mongoose';

export interface CompanyDoc extends Document {
  name: string;
  industry?: string;
  website?: string;

  contactEmail?: string;
  billingEmail?: string;
  supportEmail?: string;
  phone?: string;

  primaryAddress?: Address;
  billingAddress?: Address;

  status: 'active' | 'inactive' | 'trial' | 'paused' | 'contracted' | 'suspended' | 'archived';
  onboardingComplete: boolean;

  billingEnabled: boolean;
  currency?: string;
  subscriptionStatus?: 'trialing' | 'active' | 'paused' | 'canceled';
  billingMeta?: Record<string, any>;

  isInternal: boolean;
  tags?: string[];
  notes?: string;
  meta?: Record<string, any>;

  createdBy?: Types.ObjectId;
  primaryContact?: Types.ObjectId;
  logoUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

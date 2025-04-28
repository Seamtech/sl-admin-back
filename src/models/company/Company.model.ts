import mongoose, { Schema, model } from 'mongoose';
import { CompanyDoc } from '../../types/Company.types';

const addressSchema = new Schema(
  {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  }
);

const companySchema = new Schema<CompanyDoc>(
  {
    name: { type: String, required: true },
    industry: String,
    website: String,

    contactEmail: String,
    billingEmail: String,
    supportEmail: String,
    phone: String,

    primaryAddress: addressSchema,
    billingAddress: addressSchema,

    status: {
      type: String,
      enum: ['active', 'inactive', 'trial', 'paused', 'contracted', 'suspended', 'archived'],
      default: 'active',
    },
    onboardingComplete: { type: Boolean, default: false },

    billingEnabled: { type: Boolean, default: false },
    currency: String,
    subscriptionStatus: {
      type: String,
      enum: ['trialing', 'active', 'paused', 'canceled'],
    },
    billingMeta: { type: Schema.Types.Mixed },

    isInternal: { type: Boolean, required: true },
    tags: { type: [String], default: [] },
    notes: String,
    meta: { type: Schema.Types.Mixed },

    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    primaryContact: { type: Schema.Types.ObjectId, ref: 'User' },
    logoUrl: String,
  },
  { timestamps: true }
);

const CompanyModel = model<CompanyDoc>('Company', companySchema);
export default CompanyModel;

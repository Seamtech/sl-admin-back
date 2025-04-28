import { Static, Type } from '@sinclair/typebox';

const AddressSchema = Type.Object({
  street: Type.Optional(Type.String()),
  city: Type.Optional(Type.String()),
  state: Type.Optional(Type.String()),
  postalCode: Type.Optional(Type.String()),
  country: Type.Optional(Type.String()),
});

export const CreateCompanySchema = Type.Object({
  name: Type.String(),
  industry: Type.Optional(Type.String()),
  website: Type.Optional(Type.String()),

  contactEmail: Type.Optional(Type.String({ format: 'email' })),
  billingEmail: Type.Optional(Type.String({ format: 'email' })),
  supportEmail: Type.Optional(Type.String({ format: 'email' })),
  phone: Type.Optional(Type.String()),

  primaryAddress: Type.Optional(AddressSchema),
  billingAddress: Type.Optional(AddressSchema),

  status: Type.Optional(Type.Union([
    Type.Literal('active'),
    Type.Literal('inactive'),
    Type.Literal('trial'),
    Type.Literal('paused'),
    Type.Literal('contracted'),
    Type.Literal('suspended'),
    Type.Literal('archived')
  ])),

  onboardingComplete: Type.Optional(Type.Boolean({ default: false })),
  billingEnabled: Type.Optional(Type.Boolean({ default: false })),
  currency: Type.Optional(Type.String()),

  subscriptionStatus: Type.Optional(Type.Union([
    Type.Literal('trialing'),
    Type.Literal('active'),
    Type.Literal('paused'),
    Type.Literal('canceled')
  ])),

  billingMeta: Type.Optional(Type.Record(Type.String(), Type.Any())),
  isInternal: Type.Boolean(),
  tags: Type.Optional(Type.Array(Type.String())),
  notes: Type.Optional(Type.String()),
  meta: Type.Optional(Type.Record(Type.String(), Type.Any())),
  primaryContact: Type.Optional(Type.String()),
  logoUrl: Type.Optional(Type.String({ format: 'uri' })),
  // createdBy is excluded
});

export type CreateCompanyBody = Static<typeof CreateCompanySchema>;

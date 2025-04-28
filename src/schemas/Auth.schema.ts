import { Type, Static } from '@sinclair/typebox';

export const LoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export type LoginBody = Static<typeof LoginSchema>;

export const LoginResponseSchema = Type.Object({
  token: Type.String(),
  user: Type.Object({
    id: Type.String(),
    email: Type.String(),
    role: Type.Optional(Type.String()),
    userType: Type.String(),
  }),
});

export type LoginResponse = Static<typeof LoginResponseSchema>;

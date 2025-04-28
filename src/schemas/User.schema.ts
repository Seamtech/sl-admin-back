import { Static, Type } from '@sinclair/typebox';


export const CreateUserSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  role: Type.Optional(Type.Union([
    Type.Literal('admin'),
    Type.Literal('viewer'),
    Type.Literal('user'),
    Type.Literal('developer')
  ])),
  userType: Type.Union([
    Type.Literal('internal'),
    Type.Literal('external')
  ]),
  companyId: Type.Optional(Type.String()),
});

// 👇 NEW: Response-safe user shape
export const PublicUserSchema = Type.Object({
  _id: Type.String(),
  email: Type.String(),
  role: Type.Optional(Type.String()),
  userType: Type.String(),
  companyId: Type.Optional(Type.String()),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
});

export const GetAllUsersSchema = {
  response: {
    200: Type.Object({
      message: Type.String(),
      users: Type.Array(PublicUserSchema)
    })
  }
};

export type CreateUserBody = Static<typeof CreateUserSchema>;

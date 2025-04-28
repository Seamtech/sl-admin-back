import { Type, Static } from '@sinclair/typebox';
import { CreateUserSchema } from '../User.schema';
import { LoginResponseSchema } from '../Auth.schema';
import { GenericDataResponse } from '../responses/base.response';

// Strip password out of the response schema
export const PublicUserSchema = Type.Omit(CreateUserSchema, ['password']);

export const CreateUserResponse = GenericDataResponse(PublicUserSchema);
export const GetAllUsersResponse = GenericDataResponse(
  Type.Array(PublicUserSchema)
);

  
  export const LoginResponse = GenericDataResponse(LoginResponseSchema);
  export type LoginResponseType = Static<typeof LoginResponse>;

export type CreateUserResponseType = Static<typeof CreateUserResponse>;
export type GetAllUsersResponseType = Static<typeof GetAllUsersResponse>;

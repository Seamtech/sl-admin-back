import { Type, Static, TAnySchema } from '@sinclair/typebox';

export const BaseResponse = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
});

export const ErrorResponse = Type.Intersect([
  BaseResponse,
  Type.Object({
    error: Type.Optional(Type.String()),
  }),
]);

export const GenericDataResponse = <T extends TAnySchema>(schema: T) =>
  Type.Intersect([
    BaseResponse,
    Type.Object({
      data: schema,
    }),
  ]);

export type BaseResponseType = Static<typeof BaseResponse>;
export type ErrorResponseType = Static<typeof ErrorResponse>;

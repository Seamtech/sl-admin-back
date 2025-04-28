import { GenericDataResponse } from './base.response';
import { CreateCompanySchema } from '../Company.schema';
import { Static } from '@sinclair/typebox';

export const CreateCompanyResponse = GenericDataResponse(CreateCompanySchema);
export type CreateCompanyResponseType = Static<typeof CreateCompanyResponse>;

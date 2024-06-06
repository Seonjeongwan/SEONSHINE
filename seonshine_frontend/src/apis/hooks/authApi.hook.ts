import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { LoginSchemaType } from '@/pages/login/schemas';

import { login, LoginResponseType } from '../auth';

export const useLoginApi = (): UseMutationResult<LoginResponseType, unknown, LoginSchemaType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return login(payload.employeeId, payload.password);
    },
  });
};

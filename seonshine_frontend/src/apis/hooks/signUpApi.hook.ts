import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { SignUpSchemaType } from '@/pages/signUp/ProfileRegistration/schema';

import { signUp, SignUpResponseType } from '../signUp';

export const useSignUpApi = (): UseMutationResult<SignUpResponseType, unknown, SignUpSchemaType> => {
  return useMutation({
    mutationFn: signUp,
  });
};

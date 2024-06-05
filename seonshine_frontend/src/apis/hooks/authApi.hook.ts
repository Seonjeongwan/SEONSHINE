import { toast } from 'react-toastify';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { LoginSchemaType } from '@/pages/login/schemas';

import { login, LoginResponseType } from '../auth';
import { useAuth } from '@/hooks/useAuth';

export const useLoginApi = (): UseMutationResult<LoginResponseType, unknown, LoginSchemaType> => {
  const {login: handleSuccessLogin } = useAuth();

  return useMutation({
    mutationFn: async (payload) => {
      return login(payload.employeeId, payload.password);
    },
    onSuccess: (data) => {
      toast.success('Login successfully!');
      handleSuccessLogin(data, data.token, false);
    },
    onError: (error) => {
      toast.error('Login failed!');
    },
  });
};
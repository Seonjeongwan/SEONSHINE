import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { LoginSchemaType } from '@/pages/login/schemas';

import { errorMessages } from '@/constants/errorMessages';

import { login, LoginResponseType } from '../auth';

export const useLoginApi = (): UseMutationResult<LoginResponseType, unknown, LoginSchemaType> => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload) => {
      return login(payload.employeeId, payload.password);
    },
    onSuccess: () => {
      navigate('/test');
    },
    onError: () => {
      toast.error(errorMessages.loginFailed);
    },
  });
};

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { LoginSchemaType } from '@/pages/login/schemas';

import { useAuth } from '@/hooks/useAuth';

import { login, LoginResponseType } from '../auth';

export const useLoginApi = (): UseMutationResult<LoginResponseType, unknown, LoginSchemaType> => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload) => {
      return login(payload.employeeId, payload.password);
    },
    onSuccess: (data) => {
      console.log('Login successful', data);
      toast.success('Login successfully!');
      navigate('/test');
    },
    onError: (error) => {
      console.error('Login failed', error);
      toast.error('Login failed!');
    },
  });
};

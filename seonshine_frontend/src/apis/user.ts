import axiosInstance from '@/configs/axios';

export type BranchResponseType = {
  branch_id: number;
  branch_name: string;
  created_at: string;
  updated_at: string;
};

export const callBranches = async (): Promise<BranchResponseType[]> => {
  const response = await axiosInstance.get<BranchResponseType[]>('/common/branches');
  return response.data;
};

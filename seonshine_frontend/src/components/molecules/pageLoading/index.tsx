import { LoadingPage, SpinLoader } from "./styled";

export const PageLoading = ({ isLoading }: {isLoading: boolean}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <LoadingPage className="bg-gray-600 bg-opacity-50">
      <SpinLoader />
    </LoadingPage>
  );
};

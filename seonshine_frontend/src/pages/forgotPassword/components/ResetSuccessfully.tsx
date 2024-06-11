import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import AccountVerificationLayout from '@/components/organims/accountVerification';

const ResetSuccessfully = () => {
  const navigate = useNavigate();

  const handleClickGoToLogin = () => {
    navigate('/login');
  };

  return (
    <AccountVerificationLayout
      title="Reset Password"
      description="You have successfully changed your password. Please log in to use the service."
      size="small"
    >
      <Box
        sx={{
          width: {
            xs: '240px',
            sm: '300px',
          },
          padding: '24px 0 0 0',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="h-12"
          onClick={handleClickGoToLogin}
        >
          <Typography variant="buttonM">Go to Login</Typography>
        </Button>
      </Box>
    </AccountVerificationLayout>
  );
};

export default ResetSuccessfully;

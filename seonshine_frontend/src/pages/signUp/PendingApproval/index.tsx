import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import AccountVerificationLayout from '@/components/organims/accountVerification/accountVerificationLayout';

import { paths } from '@/routes/paths';

const PendingApprovalPage = () => {
  const navigate = useNavigate();

  const handleClickGoToLogin = () => {
    navigate(paths.login);
  };

  return (
    <AccountVerificationLayout
      title="Account Verification"
      description="Your account is under approval process now.
      Please wait for administrator’s confirmation before using the application"
      size="small"
      className="min-h-[80vh]"
    >
      <Box
        sx={{
          width: {
            xs: '240px',
            sm: '300px',
          },
        }}
        className="p-0 pt-6"
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

export default PendingApprovalPage;

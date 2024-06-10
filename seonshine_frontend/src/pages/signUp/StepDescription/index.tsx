import { Stack, Typography } from '@mui/material';

const StepDescription = ({ title, description }: { title: string; description: string }) => {
  return (
    <Stack flexDirection="column">
      <Typography
        variant="h1"
        mt={10}
        mb={2}
      >
        {title}
      </Typography>
      <Typography variant="h2">{description}</Typography>
    </Stack>
  );
};

export default StepDescription;

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import AccountVerificationLayout from '@/components/organims/accountVerification/accountVerificationLayout';

import { paths } from '@/routes/paths';

import { EmailSchema, EmailSchemaType } from '../schema';
import { EnterEmailPropsType } from '../types';

const EnterEmail = ({ handleSubmitEmail }: EnterEmailPropsType) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: EmailSchemaType) => handleSubmitEmail(data.email);

  return (
    <AccountVerificationLayout
      title="Forgot your password?"
      description="Don’t worry. Please enter your email address to reset your password"
    >
      <Link
        to={paths.login}
        className="text-blue-400 !underline absolute top-4 left-4 font-medium"
      >
        {'< Back to Login'}
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full flex items-center justify-center"
      >
        <Stack
          direction="column"
          gap={6}
          sx={(theme) => ({
            [theme.breakpoints.down(400)]: {
              width: '100%',
            },
            width: {
              xs: '360px',
              sm: '475px',
            },
          })}
          className="p-0 pt-6"
        >
          <FormInput
            name="email"
            size="medium"
            register={register}
            placeholder="Enter your email address"
            error={errors.email}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            className="h-12"
          >
            <Typography variant="buttonM">Send OTP</Typography>
          </Button>
        </Stack>
      </form>
    </AccountVerificationLayout>
  );
};

export default EnterEmail;

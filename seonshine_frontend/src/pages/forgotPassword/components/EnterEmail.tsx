import React from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import AccountVerificationLayout from '@/components/organims/accountVerification/accountVerificationLayout';

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Stack
          direction="column"
          gap={6}
          sx={{
            width: {
              xs: '320px',
              sm: '475px',
            },
          }}
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

import { Close } from '@mui/icons-material';
import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material';

type CommonModalPropsType = {
  open: boolean;
  title: string;
  description: string;
  handleClose: () => void;
  handleConfirm: () => void;
};
const ConfirmModal = ({ open, title, description, handleClose, handleConfirm }: CommonModalPropsType) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="common-modal-title"
      aria-describedby="common-modal-description"
    >
      <Box
        className="bg-white rounded-lg shadow-lg p-12 m-auto"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'max-content',
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="absolute top-2 right-2"
        >
          <Close />
        </IconButton>
        <Stack
          direction="column"
          gap={4}
          className="mt-6"
        >
          <Typography
            id="common-modal-title"
            variant="timer"
            component="h2"
          >
            {title}
          </Typography>
          <Typography
            id="common-modal-description"
            className="text-center text-lg font-normal"
          >
            {description}
          </Typography>
          <Stack
            justifyContent="space-around"
            gap={8}
            className="h-12 mt-12"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              className="w-1/2"
            >
              <Typography
                variant="buttonM"
                className="uppercase"
              >
                yes
              </Typography>
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClose}
              className="w-1/2"
            >
              <Typography
                variant="buttonM"
                className="uppercase"
              >
                No
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;

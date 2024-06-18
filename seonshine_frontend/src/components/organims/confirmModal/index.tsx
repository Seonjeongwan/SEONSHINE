import { Box, Button, Modal, Typography } from '@mui/material';

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
        className="bg-white rounded-lg shadow-lg p-6 m-auto"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
        }}
      >
        <Typography
          id="common-modal-title"
          variant="h6"
          component="h2"
          className="mb-4"
        >
          {title}
        </Typography>
        <Typography
          id="common-modal-description"
          className="mb-6"
        >
          {description}
        </Typography>
        <div className="flex justify-end space-x-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            className="bg-blue-500 text-white"
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClose}
            className="text-blue-500 border-blue-500"
          >
            No
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;

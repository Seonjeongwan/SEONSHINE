import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, EditOutlined, LinkedCamera, RestaurantRounded } from '@mui/icons-material';
import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import ConfirmModal from '@/components/organims/confirmModal';

import { avatarBaseURL } from '@/constants/image';
import { CreateMenuItemPayloadType, GetMenuListResponseType, UpdateMenuItemPayloadType } from '@/types/user';
import { isValidImageFile } from '@/utils/file';

import { useCreateMenuItemApi, useDeleteMenuItemApi, useUpdateMenuItemApi } from '@/apis/hooks/userApi.hook';

import { menuListInfoSchema, MenuListInfoSchemaType } from '../schema';
import { approvalItemDelete, approvalItemleteDescription } from './constant';

type ModalMenuItemPropsType = {
  selectedItem?: GetMenuListResponseType | null;
  onClose: () => void;
  item_id?: number;
  restaurant_id?: string;
};
const ModalMenuItem = ({ selectedItem, onClose, item_id = 0, restaurant_id = '' }: ModalMenuItemPropsType) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      name: selectedItem?.name || '',
      file: null as unknown as File,
    },
    resolver: zodResolver(menuListInfoSchema),
    mode: 'onChange',
  });

  console.log({ getValues: getValues('file') });

  const [imageUrl, setImageUrl] = useState<string | null>(
    selectedItem?.image_url ? `${avatarBaseURL}${selectedItem?.image_url}` : '',
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const { mutate: updateMenuItem, isPending: isLoadingUpdate } = useUpdateMenuItemApi({ item_id });
  const { mutate: deleteMenuItem, isPending: isLoadingDelete } = useDeleteMenuItemApi(item_id);
  const { mutate: createMenuItem, isPending: isLoadingCreate } = useCreateMenuItemApi();

  const queryClient = useQueryClient();

  const handleSave = (data: MenuListInfoSchemaType) => {
    updateMenuItem(data, {
      onSuccess: (res) => {
        console.log({ res });
        queryClient.invalidateQueries({ queryKey: ['getMenuList'] });
        toast.success(res.message);
        setIsEditing(false);
        onClose();
      },
      onError: () => {
        toast.error('Update restaurant failed!');
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const handleClickAction = () => {
    setIsConfirmModalOpen(true);
  };

  const handleDeleteItem = () => {
    deleteMenuItem(undefined, {
      onSuccess: (data) => {
        toast.success(data.message);
        onClose();
        queryClient.invalidateQueries({ queryKey: ['getMenuList'] });
      },
      onError: () => {
        toast.error('Delete menu item failed!');
      },
    });
  };

  const handleCreate = (data: MenuListInfoSchemaType) => {
    const payload: CreateMenuItemPayloadType = {
      ...data,
      restaurant_id: restaurant_id,
    };

    createMenuItem(payload, {
      onSuccess: (response) => {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ['getMenuList'] });
        reset();
        onClose();
      },
      onError: () => {
        toast.error('Create menu item failed!');
      },
    });
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const validationResult = isValidImageFile(file);

      if (!validationResult.isValid) {
        setUploadError(validationResult.messageError || null);
        return;
      }

      setValue('file', file, { shouldDirty: true });

      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      reset();
    }
  }, [selectedItem]);

  return (
    <Modal
      open={true}
      onClose={onClose}
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/5 md:w-1/3 lg:w-1/5 bg-white shadow-xl rounded-lg outline-none">
        <Box className="h-full flex flex-col justify-between">
          <form
            onSubmit={!selectedItem ? handleSubmit(handleCreate) : handleSubmit(handleSave)}
            className="h-full"
          >
            <Stack
              className="rounded-md p-8 box-border cursor-pointer bg-black-100 flex flex-col items-center"
              direction="column"
              gap={2}
            >
              <Box className="w-full h-48 md:h-64 bg-gray-200 flex items-center justify-center overflow-hidden rounded-md">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    className="h-full w-full object-cover"
                    alt={selectedItem?.name}
                  />
                ) : (
                  <Stack className="w-full h-full items-center">
                    <LinkedCamera
                      className="w-full h-1/2 opacity-30"
                      fontSize="large"
                    />
                  </Stack>
                )}
              </Box>
              <Controller
                name="file"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      name="file"
                      accept="image/*"
                      id="upload-photo"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    {error && <p className="text-red-500 text-xs">{error.message}</p>}
                  </>
                )}
              />

              <label htmlFor="upload-photo">
                {isEditing || !selectedItem ? (
                  <Button
                    component="span"
                    className="hover:bg-green-300 hover:text-white hover:outline-green-300 bg-white text-green-200 font-bold outline outline-2 outline-green-200 mx-4 mt-2 md:mt-4 rounded-xl"
                  >
                    Upload Photo
                  </Button>
                ) : null}
              </label>
              {uploadError && <p className="text-red-500 text-xs m-2">{uploadError}</p>}
            </Stack>
            <Box className="font-bold flex flex-col text-center">
              <div className="h-full flex flex-col justify-between">
                {selectedItem && (
                  <IconButton
                    className="absolute right-4"
                    onClick={handleEditToggle}
                  >
                    {isEditing ? <Edit /> : <EditOutlined />}
                  </IconButton>
                )}
                {isEditing || !selectedItem ? (
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        {' '}
                        <input
                          {...field}
                          value={field.value || ''}
                          type="text"
                          className={`mt-6 text-center text-xl mx-auto bg-white w-max outline-none border-b-2 border-black ${errors.name ? 'border-red-500' : 'border-black'}`}
                          placeholder="Menu Item Name"
                        />
                        {error && <p className="text-red-500 text-xs">{error.message}</p>}
                      </>
                    )}
                  />
                ) : (
                  <Typography
                    variant="h6"
                    className="mt-6 font-bold"
                  >
                    {selectedItem?.name}
                  </Typography>
                )}
                <Box className="flex self-end m-4">
                  {!selectedItem ? (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isLoadingCreate}
                    >
                      Create
                    </Button>
                  ) : isEditing ? (
                    <>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isDirty || isLoadingUpdate}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCancel}
                        className="ml-2"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={onClose}
                        className="font-bold"
                      >
                        OK
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleClickAction}
                        className="ml-2"
                        disabled={isLoadingDelete}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
              </div>
            </Box>
          </form>
        </Box>
        <ConfirmModal
          open={isConfirmModalOpen}
          title={approvalItemDelete}
          description={approvalItemleteDescription}
          handleClose={() => setIsConfirmModalOpen(false)}
          handleConfirm={handleDeleteItem}
        />
      </Box>
    </Modal>
  );
};

export default ModalMenuItem;

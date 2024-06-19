export const isValidImageFile = (file: File): { isValid: boolean; messageError?: string } => {
  const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
  const maxFileSize = 5 * 1024 * 1024;

  if (!validExtensions.includes(file.type)) {
    return { isValid: false, messageError: 'Invalid file type. Only PNG, JPG and JPEG are allowed.' };
  }

  if (file.size > maxFileSize) {
    return { isValid: false, messageError: 'File size exceeds 5MB.' };
  }

  return { isValid: true };
};

type FormLabelType = {
  title?: string;
  required?: boolean;
};
export const FormLabel = ({ title, required }: FormLabelType): JSX.Element => {
  return (
    <label className="font-medium">
      {title}&nbsp;
      {required && <span className="text-red-500">*</span>}
    </label>
  );
};

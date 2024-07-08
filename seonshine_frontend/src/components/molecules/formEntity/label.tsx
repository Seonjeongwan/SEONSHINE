type FormLabelType = {
  title?: string;
  required?: boolean;
};
export const FormLabel = ({ title, required }: FormLabelType): JSX.Element => {
  return (
    <label
      className="font-medium"
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        maxWidth: '100%',
      }}
    >
      {title}&nbsp;
      {required && <span className="text-red-500">*</span>}
    </label>
  );
};

import { Field, Input, InputGroup } from '@chakra-ui/react';
import { IMDSInputTypes } from '../FilterTypes';
import { withChildren } from '../../../utils/chakra-slot';

const FieldRoot = withChildren(Field.Root);
const FieldLabel = withChildren(Field.Label);
const FieldHelperText = withChildren(Field.HelperText);
const FieldErrorText = withChildren(Field.ErrorText);



const MDSInput = ({
  icon,
  value,
  onChange,
  placeholder,
  size,
  variant = 'outline',
  width = '100%',
  label,
  helperText,
  isDisabled = false,
  required = false,
  errorText,
}: IMDSInputTypes) => {
  return (
    <FieldRoot>
      {label && <FieldLabel>{label}</FieldLabel>}
      <InputGroup startElement={icon}>
        <Input
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          size={size}
          variant={variant}
          width={width}
          disabled={isDisabled}
          required={required}
        />
      </InputGroup>
      <FieldHelperText>{helperText}</FieldHelperText>
      {errorText && <FieldErrorText>{errorText}</FieldErrorText>}
    </FieldRoot>
  );
};

export default MDSInput;

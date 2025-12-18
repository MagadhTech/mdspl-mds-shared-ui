import { Checkbox } from '@chakra-ui/react';
import { withChildren } from '../../../utils/chakra-slot';
import { IMDSCheckboxTypes } from '../FilterTypes';

const CheckboxRoot = withChildren(Checkbox.Root);
const CheckboxHiddenInput = withChildren(Checkbox.HiddenInput);
const CheckboxControl = withChildren(Checkbox.Control);
const CheckboxLabel = withChildren(Checkbox.Label);

const MDSCheckbox = ({
  value,
  onChange,
  size = 'sm',
  label,
  helperText,
  isDisabled,
  required,
  errorText,
}: IMDSCheckboxTypes) => {
  return (
    <CheckboxRoot value={value} onChange={onChange} size={size}>
      <CheckboxHiddenInput />
      <CheckboxControl
        disabled={isDisabled}
        required={required}
        errorText={errorText}
        helperText={helperText}
      />
      {label && <CheckboxLabel>{label}</CheckboxLabel>}
    </CheckboxRoot>
  );
};

export default MDSCheckbox;

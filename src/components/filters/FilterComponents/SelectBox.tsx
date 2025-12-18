'use client';

import { Field, Portal, Select, createListCollection } from '@chakra-ui/react';
import { withChildren } from '../../../utils/chakra-slot';
import { IMDSSelectBoxTypes } from '../FilterTypes';

const FieldRoot = withChildren(Field.Root);
const FieldHelperText = withChildren(Field.HelperText);
const FieldErrorText = withChildren(Field.ErrorText);

const SelectRoot = withChildren(Select.Root);
const SelectLabel = withChildren(Select.Label);
const SelectControl = withChildren(Select.Control);
const SelectTrigger = withChildren(Select.Trigger);
const SelectValueText = withChildren(Select.ValueText);
const SelectIndicatorGroup = withChildren(Select.IndicatorGroup);
const SelectIndicator = withChildren(Select.Indicator);
const SelectContent = withChildren(Select.Content);
const SelectItem = withChildren(Select.Item);
const SelectItemIndicator = withChildren(Select.ItemIndicator);
const SelectHiddenSelect = withChildren(Select.HiddenSelect);
const SelectPositioner = withChildren(Select.Positioner);


const MDSSelectBox = ({
  options = frameworks.items,
  label,
  value,
  onChange,
  placeholder,
  size = 'sm',
  width = '100%',
  variant = 'outline',
  helperText,
  isDisabled,
  required,
  errorText,
}: IMDSSelectBoxTypes) => {
  return (
    <FieldRoot disabled={isDisabled} required={required}>
      <SelectRoot
        collection={options}
        variant={variant}
        size={size}
        width={width}
        value={value ? [value] : []}
        onValueChange={(value) => onChange && onChange(value[0])}
      >
        <SelectHiddenSelect />
        {label && <SelectLabel>{label}</SelectLabel>}
        <SelectControl>
          <SelectTrigger>
            <SelectValueText placeholder={placeholder} />
          </SelectTrigger>
          <SelectIndicatorGroup>
            <SelectIndicator />
          </SelectIndicatorGroup>
        </SelectControl>
        <Portal>
          <SelectPositioner>
            <SelectContent>
              {options.map((item) => (
                <SelectItem item={item} key={item.value}>
                  {item.label}
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPositioner>
        </Portal>
      </SelectRoot>
      {helperText && <FieldHelperText>{helperText}</FieldHelperText>}
      {errorText && <FieldErrorText>{errorText}</FieldErrorText>}
    </FieldRoot>
  );
};

export default MDSSelectBox;

const frameworks = createListCollection({
  items: [
    { label: 'React.js', value: 'react' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
  ],
});

'use client';

import { CloseButton, Field, Select, createListCollection } from '@chakra-ui/react';
import { useMemo } from 'react';
import { withChildren } from '../../utils/chakra-slot';
import { IMDSSelectBoxTypes } from './compo_types';

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
  options = [],
  label,
  value,
  onChange,
  placeholder,
  size = 'xs',
  width = '100%',
  variant = 'outline',
  helperText,
  isDisabled,
  required,
  errorText,
  visible,
}: IMDSSelectBoxTypes) => {
  // 1. Memoize collection to prevent internal resets
  const collection = useMemo(() => {
    return createListCollection({
      items: options,
    });
  }, [options]);

  const selectedOption = options.find((o) => o.value === value);

  // 2. Aggressive Event Stopping
  const handleClear = (e: React.PointerEvent<HTMLButtonElement> | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stops the menu from toggling
    onChange?.(undefined); // Triggers the clear
  };

  return (
    <FieldRoot disabled={isDisabled} required={required}>
      <SelectRoot
        collection={collection}
        variant={variant}
        size={size}
        width={width}
        value={value ? [value] : []}
        onValueChange={(details) => {
          onChange?.(details.value[0]);
        }}
      >
        <SelectHiddenSelect />

        {visible && <SelectLabel>{label}</SelectLabel>}
        {/* <SelectLabel>{label}</SelectLabel>  */}

        <SelectControl>
          <SelectTrigger>
            <SelectValueText placeholder={placeholder}>
              {selectedOption ? (selectedOption.displayValue ?? selectedOption.label) : ''}
            </SelectValueText>
          </SelectTrigger>

          <SelectIndicatorGroup>
            {value && !isDisabled && (
              // 4. Wrap CloseButton to ensure it has its own layer
              <div
                style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center' }}
                // Stop propagation on the wrapper too
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <CloseButton
                  size="sm"
                  variant="ghost"
                  // 5. Critical: Stop PointerDown (Zag/Ark UI uses this for triggers)
                  onPointerDown={handleClear}
                  onClick={handleClear}
                  position="relative"
                  zIndex={10}
                />
              </div>
            )}
            <SelectIndicator />
          </SelectIndicatorGroup>
        </SelectControl>

        <SelectPositioner>
          <SelectContent>
            {collection.items.map((item, index) => (
              <SelectItem key={index} item={item}>
                {item.label}
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectContent>
        </SelectPositioner>
      </SelectRoot>

      {helperText && <FieldHelperText>{helperText}</FieldHelperText>}
      {errorText && <FieldErrorText>{errorText}</FieldErrorText>}
    </FieldRoot>
  );
};

export default MDSSelectBox;

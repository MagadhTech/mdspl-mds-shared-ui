'use client';

import {
  Combobox,
  createListCollection,
  HStack,
  Portal,
  Spinner,
  Text,
  Box,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { withChildren } from '../../utils/chakra-slot';
import type { IMDSComboboxTypes } from './compo_types';

// Use your MDS wrapper utility to ensure 'children' prop is accepted
const ComboboxRoot = withChildren(Combobox.Root);
const ComboboxInput = withChildren(Combobox.Input);
const ComboboxTrigger = withChildren(Combobox.Trigger);
const ComboboxControl = withChildren(Combobox.Control);
const ComboboxContent = withChildren(Combobox.Content);
const ComboboxPositioner = withChildren(Combobox.Positioner);
const ComboboxItem = withChildren(Combobox.Item);
const ComboboxItemText = withChildren(Combobox.ItemText);

export default function MDSCombobox<T>({
  label = "Select Option",
  size = 'sm',
  width = '200px',
  items = [],
  itemToString = (i: any) => i?.label || '',
  itemToValue = (i: any) => i?.value || '',
  renderItem = (i: any) => i?.label || '',
  value,
  loading,
  placeholder = "Search...",
  onSelect,
  visible = true,
}: IMDSComboboxTypes<T>) {
  const [inputValue, setInputValue] = useState('');

  // 1. DUMMY DATA FOR TESTING (Fallback)
  const dummyItems = useMemo(() => [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ], []);

  const activeItems = items && items.length > 0 ? items : (dummyItems as unknown as T[]);

  // 2. Sync input text with selected value
  useEffect(() => {
    if (value) {
      setInputValue(itemToString(value));
    } else {
      setInputValue('');
    }
  }, [value, itemToString]);

  // 3. Collection source
  const collection = useMemo(() => {
    return createListCollection({
      items: activeItems,
      itemToString,
      itemToValue,
    });
  }, [activeItems, itemToString, itemToValue]);

  if (!visible) return null;

  return (
    <Box minW={width}>
      <ComboboxRoot
        width="100%"
        size={size}
        collection={collection}
        inputValue={inputValue}
        onInputValueChange={(e) => setInputValue(e.inputValue)}
        value={value ? [itemToValue(value)] : []}
        onValueChange={(e) => {
          const nextValue = e.value[0];
          const selected = activeItems.find((item) => itemToValue(item) === nextValue);
          if (selected) onSelect?.(selected);
        }}
      >
        {label && (
          <Text fontSize="xs" fontWeight="medium" mb="1" color="gray.600">
            {label}
          </Text>
        )}

        <ComboboxControl>
          <ComboboxInput
            placeholder={placeholder}
            bg="white"
            px={2}
          />
          <ComboboxTrigger />
        </ComboboxControl>

        <Portal>
          <ComboboxPositioner zIndex="max">
            <ComboboxContent bg="white" boxShadow="md" py={1} borderRadius="md" minW="200px">
              {loading ? (
                <HStack p="3" justify="center">
                  <Spinner size="xs" />
                  <Text fontSize="sm">Loading...</Text>
                </HStack>
              ) : activeItems.length === 0 ? (
                <Text p="3" fontSize="sm" color="gray.500">No results found</Text>
              ) : (
                collection.items.map((item) => (
                  <ComboboxItem
                    key={itemToValue(item)}
                    item={item}
                    px={2}
                    py={1.5}
                    _hover={{ bg: "blue.50", cursor: "pointer" }}
                  >
                    <ComboboxItemText>{renderItem(item)}</ComboboxItemText>
                  </ComboboxItem>
                ))
              )}
            </ComboboxContent>
          </ComboboxPositioner>
        </Portal>
      </ComboboxRoot>
    </Box>
  );
}

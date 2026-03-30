'use client';

import {
  Combobox,
  HStack,
  Portal,
  Span,
  Spinner,
  useListCollection,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { withChildren } from '../../utils/chakra-slot';

const ComboboxRoot = withChildren(Combobox.Root);
const ComboboxTrigger = withChildren(Combobox.Trigger);
const ComboboxInput = withChildren(Combobox.Input);
const ComboboxControl = withChildren(Combobox.Control);
const ComboboxContent = withChildren(Combobox.Content);
const ComboboxPositioner = withChildren(Combobox.Positioner);
const ComboboxItem = withChildren(Combobox.Item);
const ComboboxItemText = withChildren(Combobox.ItemText);
const ComboboxEmpty = withChildren(Combobox.Empty);
const ComboboxIndicatorGroup = withChildren(Combobox.IndicatorGroup);
const ComboboxClearTrigger = withChildren(Combobox.ClearTrigger);
const ComboboxLabel = withChildren(Combobox.Label);

export interface DataItem {
  id: string;
  name?: string;
  cp_code?: string;
  label?: string;
  identifier?: string;
  group_type: 'mo' | 'district' | 'partner';
}

interface ApiResponse {
  success: boolean;
  data: DataItem[];
}

export interface GroupedComboboxProps {
  baseURL: string;
  filterKey?: DataItem['group_type'];
  placeholder?: string;
  label?: string;
}

const VISIBLE_LIMIT = 30; // Max items to show at once

const GroupedDataCombobox = ({
  baseURL,
  filterKey,
  placeholder = 'Type to search...',
  label = 'Select Entry',
}: GroupedComboboxProps) => {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState('');

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        const response: Response = await fetch(baseURL);
        const result: ApiResponse = await response.json();
        if (result.success) {
          setItems(result.data);
        }
      } catch (error: unknown) {
        console.error('Error fetching combobox data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [baseURL]);

  // 2. Initial Grouping & Sorting (Runs once when data is fetched)
  const sortedItems: DataItem[] = useMemo(() => {
    const filtered: DataItem[] = filterKey
      ? items.filter((item: DataItem) => item.group_type === filterKey)
      : items;

    const groupOrder: Record<DataItem['group_type'], number> = {
      partner: 1,
      mo: 2,
      district: 3,
    };

    return [...filtered].sort((a: DataItem, b: DataItem): number => {
      if (groupOrder[a.group_type] !== groupOrder[b.group_type]) {
        return groupOrder[a.group_type] - groupOrder[b.group_type];
      }
      const aName = a.name || a.label || '';
      const bName = b.name || b.label || '';
      return aName.localeCompare(bName);
    });
  }, [items, filterKey]);

  // 3. Search Filter & Data Slicing Logic
  // This filters the 5000+ items locally and takes ONLY the top 30
  const displayData = useMemo(() => {
    let result = sortedItems;

    // If user is searching, filter the list first
    if (inputValue) {
      const query = inputValue.toLowerCase();
      result = sortedItems.filter((item) => {
        const nameMatch = (item.name || item.label || '').toLowerCase().includes(query);
        const codeMatch = (item.cp_code || item.identifier || '').toLowerCase().includes(query);
        return nameMatch || codeMatch;
      });
    }

    // Return an object containing both the sliced array and the total matches found
    return {
      slicedItems: result.slice(0, VISIBLE_LIMIT),
      totalMatches: result.length,
    };
  }, [sortedItems, inputValue]);

  // 4. Collection Setup
  // We don't use Chakra's built-in `useFilter` here because we already did it manually above
  const { collection, set } = useListCollection<DataItem>({
    initialItems: [],
    itemToString: (item: DataItem): string => item.name || item.label || '',
    itemToValue: (item: DataItem): string => item.id,
  });

  // Hydrate collection dynamically based on our manual slice
  useEffect(() => {
    set(displayData.slicedItems);
  }, [displayData.slicedItems, set]);

  return (
    <ComboboxRoot
      collection={collection}
      onInputValueChange={(e: { inputValue: string }) => setInputValue(e.inputValue)}
      width="320px"
      disabled={loading}
    >
      <ComboboxLabel>{label}</ComboboxLabel>
      <ComboboxControl>
        <ComboboxInput placeholder={loading ? 'Loading...' : placeholder} />

        <ComboboxIndicatorGroup>
          {loading ? (
            <Spinner size="sm" color="fg.muted" />
          ) : (
            <>
              <ComboboxClearTrigger />
              <ComboboxTrigger />
            </>
          )}
        </ComboboxIndicatorGroup>
      </ComboboxControl>

      <Portal>
        <ComboboxPositioner>
          <ComboboxContent maxHeight="400px" overflowY="auto">
            {loading ? (
              <HStack p="3" justify="center">
                <Spinner size="sm" borderWidth="2px" />
                <Span fontSize="sm" color="fg.muted">
                  Loading data...
                </Span>
              </HStack>
            ) : collection.items.length === 0 ? (
              <ComboboxEmpty>No results found</ComboboxEmpty>
            ) : (
              <>
                {/* Map over the 30 sliced items */}
                {collection.items.map((item: DataItem, index: number) => {
                  const isFirstOfGroup =
                    index === 0 || collection.items[index - 1].group_type !== item.group_type;

                  const itemName = item.name || item.label;
                  const itemCpCode = item.cp_code || item.identifier;

                  return (
                    <div key={item.id}>
                      {/* INJECT GROUP HEADER */}
                      {isFirstOfGroup && (
                        <Span
                          display="block"
                          px="2"
                          py="1"
                          fontSize="xs"
                          fontWeight="bold"
                          color="fg.muted"
                          textTransform="uppercase"
                          mt={index > 0 ? '2' : '0'}
                        >
                          {item.group_type}
                        </Span>
                      )}

                      <ComboboxItem item={item} px="2" py="1" cursor="pointer">
                        <VStack align="start" gap="0">
                          <ComboboxItemText fontSize="sm" fontWeight="medium">
                            {itemName}
                          </ComboboxItemText>

                          {/* Hide cp_code for districts, show for MO/Partners */}
                          {item.group_type !== 'district' && itemCpCode && (
                            <ComboboxItemText fontSize="xs" color="fg.muted">
                              {itemCpCode}
                            </ComboboxItemText>
                          )}
                        </VStack>
                        <Combobox.ItemIndicator />
                      </ComboboxItem>
                    </div>
                  );
                })}

                {/* Show a helpful message at the bottom if there are more than 30 matches */}
                {displayData.totalMatches > VISIBLE_LIMIT && (
                  <Span display="block" textAlign="center" py="2" fontSize="xs" color="fg.muted">
                    Showing {VISIBLE_LIMIT} of {displayData.totalMatches} results. Type to refine...
                  </Span>
                )}
              </>
            )}
          </ComboboxContent>
        </ComboboxPositioner>
      </Portal>
    </ComboboxRoot>
  );
};

export default GroupedDataCombobox;

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
  selectedId?: string | null;
  setSelectedId?: (id: string | null) => void;
  setFilterType?: (filterType: DataItem['group_type']) => void;
  groupOrder?: DataItem['group_type'][];
}

const VISIBLE_LIMIT_PER_GROUP = 30; // Max items per group

const GroupedDataCombobox = ({
  baseURL,
  filterKey,
  placeholder = 'Type to search...',
  label = 'Select Entry',
  selectedId,
  setSelectedId,
  setFilterType,
  groupOrder = ['partner', 'mo', 'district'],
}: GroupedComboboxProps) => {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState('');

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

  const baseItems: DataItem[] = useMemo(() => {
    return filterKey ? items.filter((item: DataItem) => item.group_type === filterKey) : items;
  }, [items, filterKey]);

  const displayData = useMemo(() => {
    let activeList = baseItems;

    if (inputValue) {
      const query = inputValue.toLowerCase();
      activeList = activeList.filter((item) => {
        const nameMatch = (item.name || item.label || '').toLowerCase().includes(query);
        const codeMatch = (item.cp_code || item.identifier || '').toLowerCase().includes(query);
        return nameMatch || codeMatch;
      });
    }

    const groups: Record<string, DataItem[]> = {
      partner: [],
      mo: [],
      district: [],
    };

    activeList.forEach((item) => {
      if (groups[item.group_type]) {
        groups[item.group_type].push(item);
      }
    });

    const finalSlicedList: DataItem[] = [];
    let hasHiddenResults = false;

    groupOrder.forEach((groupType) => {
      const groupArray = groups[groupType];

      if (groupArray && groupArray.length > 0) {
        groupArray.sort((a, b) => {
          const aName = a.name || a.label || '';
          const bName = b.name || b.label || '';
          return aName.localeCompare(bName);
        });

        if (groupArray.length > VISIBLE_LIMIT_PER_GROUP) {
          hasHiddenResults = true;
        }

        finalSlicedList.push(...groupArray.slice(0, VISIBLE_LIMIT_PER_GROUP));
      }
    });

    return {
      slicedItems: finalSlicedList,
      hasHiddenResults,
      totalMatches: activeList.length,
    };
  }, [baseItems, inputValue, groupOrder]);

  const { collection, set } = useListCollection<DataItem>({
    initialItems: [],
    itemToString: (item: DataItem): string => item.name || item.label || '',
    itemToValue: (item: DataItem): string => item.id,
  });

  useEffect(() => {
    set(displayData.slicedItems);
  }, [displayData.slicedItems, set]);

  return (
    <ComboboxRoot
      collection={collection}
      value={selectedId ? [selectedId] : []}
      onValueChange={(e: { value: string[] }) => {
        const selectedValue = e.value[0] || null;

        // Update the selected ID
        if (setSelectedId) {
          setSelectedId(selectedValue);
        }

        // If a value is selected and setFilterType is provided, update the filter type
        if (setFilterType && selectedValue) {
          const selectedItem = baseItems.find((item) => item.id === selectedValue);
          if (selectedItem) {
            setFilterType(selectedItem.group_type);
          }
        }
      }}
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
                {/* Map over the aggregated sliced items */}
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

                {/* Optional Helper text to show that we are limiting the view per category */}
                {displayData.hasHiddenResults && (
                  <Span display="block" textAlign="center" py="2" fontSize="xs" color="fg.muted">
                    Showing top {VISIBLE_LIMIT_PER_GROUP} per group. Keep typing to refine...
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

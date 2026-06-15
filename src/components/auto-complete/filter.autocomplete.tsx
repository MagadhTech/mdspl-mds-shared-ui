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
  group_type: 'mo' | 'district' | 'partner' | 'mo_group';
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
  visibleLimit?: number;
  size?: 'sm' | 'md' | 'lg' | 'xs';
  width?: string;
}

const VISIBLE_LIMIT_PER_GROUP = 30; // Max items per group
const DEFAULT_GROUP_ORDER: DataItem['group_type'][] = ['partner', 'mo', 'district', 'mo_group'];

const itemToString = (item: DataItem): string => item.name || item.label || '';
const itemToValue = (item: DataItem): string => item.id;

// --- Custom Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const GroupedDataCombobox = ({
  baseURL,
  filterKey,
  placeholder = 'Type to search...',
  label = 'Select Entry',
  selectedId,
  setSelectedId,
  setFilterType,
  visibleLimit = VISIBLE_LIMIT_PER_GROUP,
  groupOrder = DEFAULT_GROUP_ORDER,
  size = 'md',
  width = '320px',
}: GroupedComboboxProps) => {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [cache, setCache] = useState<Record<string, DataItem[]>>({});

  // UI States
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const debouncedSearch = useDebounce(inputValue, 500);

  // --- API Fetch Logic ---
  // useEffect(() => {
  //   // Prevent fetching if component is mounted but never opened or searched
  //   if (!isOpen && !hasFetchedOnce && !debouncedSearch) return;

  //   const fetchData = async (): Promise<void> => {
  //     try {
  //       setLoading(true);

  //       const sessionId = localStorage.getItem('app-session-id');

  //       const url = new URL(baseURL);
  //       url.searchParams.append('page', '1');
  //       url.searchParams.append('limit', visibleLimit.toString());

  //       if (debouncedSearch) {
  //         url.searchParams.append('search', debouncedSearch);
  //       }

  //       if (filterKey) {
  //         url.searchParams.append('group_type', filterKey);
  //       } else if (groupOrder && groupOrder.length > 0) {
  //         url.searchParams.append('group_type', groupOrder.join(','));
  //       }

  //       const response: Response = await fetch(url.toString(), {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           ...(sessionId ? { 'app-session-id': sessionId } : {}),
  //         },
  //       });

  //       const result: ApiResponse = await response.json();
  //       if (result.success) {
  //         setItems(result.data || []);
  //         setHasFetchedOnce(true);
  //       }
  //     } catch (error: unknown) {
  //       console.error('Error fetching combobox data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [baseURL, debouncedSearch, isOpen, filterKey, groupOrder, visibleLimit, hasFetchedOnce]);

  // --- API Fetch Logic ---
  useEffect(() => {
    // don't fetch initially if never opened/searched
    if (!isOpen && !hasFetchedOnce && !debouncedSearch) return;

    const searchKey = `${debouncedSearch || 'default'}-${filterKey || groupOrder.join(',')}`;

    // use cached data
    if (cache[searchKey]) {
      setItems(cache[searchKey]);
      return;
    }

    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);

        const sessionId = localStorage.getItem('app-session-id');

        const url = new URL(baseURL);
        url.searchParams.append('page', '1');
        url.searchParams.append('limit', visibleLimit.toString());

        if (debouncedSearch) {
          url.searchParams.append('search', debouncedSearch);
        }

        if (filterKey) {
          url.searchParams.append('group_type', filterKey);
        } else if (groupOrder?.length) {
          url.searchParams.append('group_type', groupOrder.join(','));
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            ...(sessionId ? { 'app-session-id': sessionId } : {}),
          },
        });

        const result: ApiResponse = await response.json();

        if (result.success) {
          const newData = result.data || [];

          setItems(newData);

          // save in cache
          setCache((prev) => ({
            ...prev,
            [searchKey]: newData,
          }));

          setHasFetchedOnce(true);
        }
      } catch (error) {
        console.error('Error fetching combobox data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseURL, debouncedSearch, filterKey, groupOrder, visibleLimit, isOpen]);

  // --- Data Transformation ---
  const displayData = useMemo(() => {
    const groups: Record<string, DataItem[]> = {
      partner: [],
      mo: [],
      district: [],
    };

    items.forEach((item) => {
      if (groups[item.group_type]) {
        groups[item.group_type].push(item);
      }
    });

    const finalSlicedList: DataItem[] = [];

    groupOrder.forEach((groupType) => {
      const groupArray = groups[groupType];

      if (groupArray && groupArray.length > 0) {
        groupArray.sort((a, b) => {
          const aName = a.name || a.label || '';
          const bName = b.name || b.label || '';
          return aName.localeCompare(bName);
        });

        finalSlicedList.push(...groupArray);
      }
    });

    return finalSlicedList;
  }, [items, groupOrder]);

  const { collection, set } = useListCollection<DataItem>({
    initialItems: [],
    itemToString,
    itemToValue,
  });

  useEffect(() => {
    set(displayData);
  }, [displayData, set]);

  return (
    <ComboboxRoot
      size={size}
      collection={collection}
      value={selectedId ? [selectedId] : []}
      open={isOpen} // Control open state natively
      onOpenChange={(e: { open: boolean }) => setIsOpen(e.open)}
      onValueChange={(e: { value: string[] }) => {
        const selectedValue = e.value[0] || null;

        if (setSelectedId) {
          setSelectedId(selectedValue);
        }

        if (setFilterType && selectedValue) {
          const selectedItem = items.find((item) => item.id === selectedValue);
          if (selectedItem) {
            setFilterType(selectedItem.group_type);
          }
        }
      }}
      onInputValueChange={(e: { inputValue: string }) => setInputValue(e.inputValue)}
      width={width}
      disabled={loading && !hasFetchedOnce} // Only completely disable on first load
    >
      {label && <ComboboxLabel>{label}</ComboboxLabel>}

      {/* Added onClick here to ensure clicking ANYWHERE in the box opens it */}
      <ComboboxControl onClick={() => setIsOpen(true)}>
        <ComboboxInput placeholder={loading && !hasFetchedOnce ? 'Loading...' : placeholder} />

        <ComboboxIndicatorGroup>
          {loading ? (
            <Spinner size="sm" color="fg.muted" />
          ) : (
            <>
              {inputValue && <ComboboxClearTrigger />}
              <ComboboxTrigger />
            </>
          )}
        </ComboboxIndicatorGroup>
      </ComboboxControl>

      <Portal>
        <ComboboxPositioner zIndex="popover">
          <ComboboxContent maxHeight="400px" overflowY="auto">
            {loading && !hasFetchedOnce ? (
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
                {collection.items.map((item: DataItem, index: number) => {
                  const isFirstOfGroup =
                    index === 0 || collection.items[index - 1].group_type !== item.group_type;

                  const itemName = item.name || item.label;
                  const itemCpCode = item.cp_code || item.identifier;

                  return (
                    <div key={item.id}>
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
              </>
            )}
          </ComboboxContent>
        </ComboboxPositioner>
      </Portal>
    </ComboboxRoot>
  );
};

export default GroupedDataCombobox;

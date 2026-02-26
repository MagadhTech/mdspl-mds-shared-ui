import {
  Box,
  Button,
  Grid,
  Group,
  HStack,
  IconButton,
  Input,
  InputAddon,
  Popover,
  Text,
} from '@chakra-ui/react';
import { Calendar, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { withChildren } from '../../../utils/chakra-slot';

// --- Chakra Slot Components ---
const PopoverRoot = withChildren(Popover.Root);
const PopoverContent = withChildren(Popover.Content);
const PopoverArrow = withChildren(Popover.Arrow);
const PopoverTrigger = withChildren(Popover.Trigger);
const PopoverPositioner = withChildren(Popover.Positioner);

// FIX 1: Helper function to strip time components right at the boundaries
const startOfDay = (d: Date | null | undefined) =>
  d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;

function formatDate(date: Date | null) {
  if (!date) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function parseDateRange(value: string) {
  const parts = value.split(/\s+to\s+/i);
  const startStr = parts[0];
  const endStr = parts[1];

  const parseSingle = (str?: string) => {
    if (!str) return null;
    const p = str.trim().split('-');
    if (p.length !== 3) return null;
    const [dd, mm, yyyy] = p;
    const d = parseInt(dd);
    const m = parseInt(mm) - 1;
    const y = parseInt(yyyy);
    if (isNaN(d) || isNaN(m) || isNaN(y) || yyyy.length !== 4) return null;
    const date = new Date(y, m, d);
    return date.getDate() === d && date.getMonth() === m ? date : null;
  };

  const start = parseSingle(startStr);
  const end = parseSingle(endStr);

  return { start, end };
}

export type IMDSDateRangePickerTypes = {
  startDate?: Date;
  endDate?: Date;
  onChange: (start: Date | null, end: Date | null) => void;
  width?: string;
  showLabel?: boolean;
  label?: string;
  visible?: boolean;
};

export default function MDSDateRangePicker({
  startDate,
  endDate,
  onChange,
  width = '280px',
  showLabel = true,
  label = 'Select date range',
  visible = true,
}: IMDSDateRangePickerTypes) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(startDate || new Date());
  const [hoverDay, setHoverDay] = useState<Date | null>(null);

  const [localStart, setLocalStart] = useState<Date | null>(startOfDay(startDate));
  const [localEnd, setLocalEnd] = useState<Date | null>(startOfDay(endDate));

  const getDisplayValue = (s: Date | null, e: Date | null) => {
    if (s && e) return `${formatDate(s)} to ${formatDate(e)}`;
    if (s) return `${formatDate(s)}`;
    return '';
  };

  const [inputValue, setInputValue] = useState(
    getDisplayValue(startOfDay(startDate), startOfDay(endDate)),
  );

  const startMs = startDate?.getTime();
  const endMs = endDate?.getTime();

  useEffect(() => {
    // FIX 2: Always normalize incoming props to midnight so Dayjs time elements don't cause mismatch bugs
    const normStart = startOfDay(startDate);
    const normEnd = startOfDay(endDate);

    setLocalStart(normStart);
    setLocalEnd(normEnd);
    setInputValue(getDisplayValue(normStart, normEnd));

    if (normStart) {
      setCurrent(new Date(normStart.getFullYear(), normStart.getMonth(), 1));
    }
  }, [startMs, endMs]);

  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();

  const handlePrevMonth = () =>
    setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  const handleDayClick = (day: number) => {
    // This is already perfectly normalized to midnight
    const selected = new Date(current.getFullYear(), current.getMonth(), day);

    if (!localStart || (localStart && localEnd)) {
      setLocalStart(selected);
      setLocalEnd(null);
      onChange(selected, null);
      setInputValue(formatDate(selected));
      return;
    }

    if (localStart && !localEnd) {
      // FIX 3: Removed the `if (selected === localStart) return;` block.
      // Now if a user double-clicks the same day, it successfully selects a 1-day range and closes!
      const start = selected < localStart ? selected : localStart;
      const end = selected < localStart ? localStart : selected;

      setLocalStart(start);
      setLocalEnd(end);
      onChange(start, end);
      setInputValue(`${formatDate(start)} to ${formatDate(end)}`);
      setOpen(false);
    }
  };

  const handleInputChange = (e: any) => {
    const val = e.target.value;
    setInputValue(val);

    const { start, end } = parseDateRange(val);

    if (start && end) {
      const newStart = start < end ? start : end;
      const newEnd = start < end ? end : start;
      setLocalStart(newStart);
      setLocalEnd(newEnd);
      onChange(newStart, newEnd);
      setCurrent(newStart);
    } else if (start && !val.toLowerCase().includes('to')) {
      setLocalStart(start);
      setLocalEnd(null);
      onChange(start, null);
    } else if (!val.trim()) {
      setLocalStart(null);
      setLocalEnd(null);
      onChange(null, null);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key !== 'Enter') return;

    const { start, end } = parseDateRange(inputValue);

    if (start && !end && !inputValue.toLowerCase().includes('to')) {
      const next = `${formatDate(start)} to `;
      setInputValue(next);
      setLocalStart(start);
      setLocalEnd(null);
      onChange(start, null);

      requestAnimationFrame(() => {
        const el = e.target;
        el.setSelectionRange(next.length, next.length);
      });
      return;
    }

    if (start && end) {
      const newStart = start < end ? start : end;
      const newEnd = start < end ? end : start;
      setLocalStart(newStart);
      setLocalEnd(newEnd);
      onChange(newStart, newEnd);
      setOpen(false);
    }
  };

  const clearDates = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLocalStart(null);
    setLocalEnd(null);
    setInputValue('');
    onChange(null, null);
  };

  return (
    <Box width={width} onKeyDown={handleKeyDown}>
      {showLabel && !visible && (
        <Text fontSize="xs" color="fg.muted" mb={1} fontWeight="medium">
          {label}
        </Text>
      )}

      <PopoverRoot
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        positioning={{ placement: 'bottom-start', gutter: 4 }}
      >
        <Group attached w="full" position="relative">
          <Input
            placeholder="DD-MM-YYYY to DD-MM-YYYY"
            value={inputValue}
            onChange={handleInputChange}
            size="sm"
            autoComplete="off"
          />
          {inputValue && (
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Clear date"
              type="button"
              onClick={clearDates}
              position="absolute"
              right="32px"
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
            >
              <X size={14} />
            </IconButton>
          )}

          <PopoverTrigger asChild>
            <InputAddon
              cursor="pointer"
              px={2}
              _hover={{ bg: 'gray.100' }}
              transition="background 0.2s"
            >
              <Calendar size={16} />
            </InputAddon>
          </PopoverTrigger>
        </Group>

        <PopoverPositioner>
          <PopoverContent
            width="300px"
            p={4}
            boxShadow="xl"
            zIndex={1000}
            borderRadius="md"
            outline="none"
          >
            <PopoverArrow />

            <HStack justify="space-between" mb={4}>
              <IconButton
                size="xs"
                variant="ghost"
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                ‹
              </IconButton>
              <Text fontWeight="bold" fontSize="sm">
                {current.toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <IconButton
                size="xs"
                variant="ghost"
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                ›
              </IconButton>
            </HStack>

            <Grid templateColumns="repeat(7, 1fr)" gap={1} textAlign="center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <Text key={`${d}-${i}`} fontSize="xs" fontWeight="bold" color="fg.subtle" py={1}>
                  {d}
                </Text>
              ))}

              {Array(firstDay)
                .fill(null)
                .map((_, i) => (
                  <Box key={`empty-${i}`} />
                ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const date = new Date(current.getFullYear(), current.getMonth(), day);

                let effectiveStart = localStart;
                let effectiveEnd = localEnd;
                const normHoverDay = startOfDay(hoverDay);

                if (normHoverDay) {
                  if (effectiveStart && !effectiveEnd) {
                    if (normHoverDay < effectiveStart) {
                      effectiveEnd = effectiveStart;
                      effectiveStart = normHoverDay;
                    } else {
                      effectiveEnd = normHoverDay;
                    }
                  } else if (effectiveStart && effectiveEnd) {
                    const mid =
                      effectiveStart.getTime() +
                      (effectiveEnd.getTime() - effectiveStart.getTime()) / 2;
                    if (normHoverDay.getTime() <= mid) {
                      effectiveStart = normHoverDay;
                    } else {
                      effectiveEnd = normHoverDay;
                    }
                    if (effectiveStart > effectiveEnd) {
                      [effectiveStart, effectiveEnd] = [effectiveEnd, effectiveStart];
                    }
                  }
                }

                const isStart = effectiveStart && date.getTime() === effectiveStart.getTime();
                const isEnd = effectiveEnd && date.getTime() === effectiveEnd.getTime();
                const inRange =
                  effectiveStart && effectiveEnd && date > effectiveStart && date < effectiveEnd;

                let bg = 'transparent';
                let colorPalette = 'gray';
                let variant = 'ghost';

                if (isStart || isEnd) {
                  variant = 'solid';
                  colorPalette = 'blue';
                } else if (inRange) {
                  bg = 'blue.100';
                }

                let borderRadius = 'md';
                if (inRange) borderRadius = '0';
                if (isStart && effectiveEnd) {
                  borderRadius = isEnd ? 'md' : 'md 0 0 md';
                }
                if (isEnd && effectiveStart) {
                  borderRadius = isStart ? 'md' : '0 md md 0';
                }

                return (
                  <Button
                    key={day}
                    size="xs"
                    variant={variant as any}
                    colorPalette={colorPalette}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => setHoverDay(date)}
                    onMouseLeave={() => setHoverDay(null)}
                    minW="32px"
                    h="32px"
                    fontSize="xs"
                    borderRadius={borderRadius}
                    _hover={{
                      bg: isStart || isEnd ? undefined : 'gray.100',
                    }}
                  >
                    {day}
                  </Button>
                );
              })}
            </Grid>
            <Text fontSize="10px" color="fg.muted" mt={3} textAlign="center">
              Select Start Date then End Date
            </Text>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverRoot>
    </Box>
  );
}

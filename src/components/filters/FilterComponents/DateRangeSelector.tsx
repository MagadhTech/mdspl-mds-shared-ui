'use client';

import {
  HStack,
  IconButton,
  Input,
  InputElement,
  InputGroup,
  Kbd,
  Popover,
  PopoverArrow,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { withChildren } from '../../../utils/chakra-slot';
import {
  DATE_SEPARATOR,
  formatDatePart,
  formatForDisplay,
  getTodayFormatted,
  getTodayISO,
  parsePartialDate,
} from '../shared/dateUtils';

const PopoverRoot = withChildren(Popover.Root);
const PopoverTrigger = withChildren(Popover.Trigger);
const PopoverContent = withChildren(Popover.Content);
const PopoverPositioner = withChildren(Popover.Positioner);

export default function DateRangeFilter({
  value,
  onChange,
  disabled = false,
}: {
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
}) {
  const [startDate = '', endDate = ''] = value ? value.split('|') : [];

  const [input, setInput] = useState(() => {
    if (startDate && endDate) {
      return `${formatForDisplay(startDate)}${DATE_SEPARATOR}${formatForDisplay(endDate)}`;
    }
    if (startDate) return formatForDisplay(startDate);
    return '';
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl + D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd' && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (rawInput: string) => {
    let sanitized = rawInput;

    if (sanitized.includes(DATE_SEPARATOR)) {
      const [startPart, endPart = ''] = sanitized.split(DATE_SEPARATOR);
      sanitized = `${formatDatePart(startPart.trim())}${DATE_SEPARATOR}${formatDatePart(
        endPart.trim(),
      )}`;
    } else if (sanitized.toLowerCase().includes(' to ')) {
      const [startPart, rest = ''] = sanitized.split(/\s+to\s+/i);
      sanitized = `${formatDatePart(startPart.trim())} to ${formatDatePart(rest.trim())}`;
    } else {
      sanitized = formatDatePart(sanitized);
    }

    setInput(sanitized);
  };

  const handleBlur = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      onChange(undefined);
      return;
    }

    if (trimmed.includes(DATE_SEPARATOR)) {
      const [startPart, endPart = ''] = trimmed.split(DATE_SEPARATOR).map((p) => p.trim());
      const startParsed = parsePartialDate(startPart);
      const endParsed = endPart ? parsePartialDate(endPart) : null;

      if (startParsed && endParsed) {
        const [finalStart, finalEnd] =
          endParsed < startParsed ? [endParsed, startParsed] : [startParsed, endParsed];
        const display = `${formatForDisplay(finalStart)}${DATE_SEPARATOR}${formatForDisplay(
          finalEnd,
        )}`;
        setInput(display);
        onChange(`${finalStart}|${finalEnd}`);
      } else if (startParsed && !endPart) {
        setInput(`${formatForDisplay(startParsed)}${DATE_SEPARATOR}`);
        onChange(undefined); // incomplete range
      } else if (startParsed && endPart) {
        const todayISO = getTodayISO();
        const [finalStart, finalEnd] =
          todayISO < startParsed ? [todayISO, startParsed] : [startParsed, todayISO];
        const display = `${formatForDisplay(finalStart)}${DATE_SEPARATOR}${formatForDisplay(
          finalEnd,
        )}`;
        setInput(display);
        onChange(`${finalStart}|${finalEnd}`);
      } else {
        setInput('');
        onChange(undefined);
      }
    } else {
      const parsed = parsePartialDate(trimmed);
      if (parsed) {
        setInput(`${formatForDisplay(parsed)}${DATE_SEPARATOR}`);
        onChange(undefined);
      } else {
        setInput('');
        onChange(undefined);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const cursorPos = inputRef.current?.selectionStart || 0;
    const separatorIndex = input.indexOf(DATE_SEPARATOR);

    if (!input.trim()) {
      setInput(`${getTodayFormatted()}${DATE_SEPARATOR}`);
      return;
    }

    if (separatorIndex === -1) {
      const parsed = parsePartialDate(input.trim());
      if (parsed) {
        setInput(`${formatForDisplay(parsed)}${DATE_SEPARATOR}`);
      }
      return;
    }

    // If cursor is in or before the separator, try to finalize start date
    if (cursorPos <= separatorIndex + DATE_SEPARATOR.length) {
      const startPart = input.substring(0, separatorIndex).trim();
      const endPart = input.substring(separatorIndex + DATE_SEPARATOR.length);
      const startParsed = parsePartialDate(startPart);
      if (startParsed) {
        setInput(`${formatForDisplay(startParsed)}${DATE_SEPARATOR}${endPart}`);
      }
      return;
    }

    // Cursor in end part
    const endPart = input.substring(separatorIndex + DATE_SEPARATOR.length).trim();
    if (!endPart) {
      const newInput =
        input.substring(0, separatorIndex + DATE_SEPARATOR.length) + getTodayFormatted();
      setInput(newInput);
      setTimeout(() => {
        handleBlur();
        inputRef.current?.blur();
      }, 0);
    } else {
      handleBlur();
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setInput('');
    onChange(undefined);
  };

  return (
    <InputGroup>
      <>
        <InputElement position={'revert'}>
          <PopoverRoot
            open={isPopoverOpen}
            onEscapeKeyDown={() => {
              setIsPopoverOpen(false);
            }}
          >
            <PopoverTrigger asChild>
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="Date range help"
                onClick={() => setIsPopoverOpen((prev) => !prev)}
              >
                <Calendar size={16} />
              </IconButton>
            </PopoverTrigger>

            <Portal>
              <PopoverPositioner>
                <PopoverContent p={4}>
                  <PopoverArrow />
                  <VStack align="start" gap={4}>
                    <HStack>
                      <Calendar size={16} />
                      <Text fontWeight="semibold" fontSize="sm">
                        Date Range Filter
                      </Text>
                    </HStack>

                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        Format:
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        DD-MM-YYYY{DATE_SEPARATOR}DD-MM-YYYY
                      </Text>
                    </VStack>

                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        Tips:
                      </Text>
                      <Text fontSize="xs">• "15 to 20" → assumes current month/year</Text>
                      <Text fontSize="xs">• Leave end blank → up to today</Text>
                      <Text fontSize="xs">• Dates auto-swapped if reversed</Text>
                      <Text fontSize="xs">• Press Enter on empty end → fills today</Text>
                    </VStack>

                    <VStack align="start" gap={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        Shortcut:
                      </Text>
                      <HStack>
                        <Kbd>Ctrl</Kbd>
                        <Text>+</Text>
                        <Kbd>D</Kbd>
                      </HStack>
                    </VStack>
                  </VStack>
                </PopoverContent>
              </PopoverPositioner>
            </Portal>
          </PopoverRoot>

          <Input
            ref={inputRef}
            placeholder="15-06-2025 to 20-06-2025"
            value={input}
            size="sm"
            disabled={disabled}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            pr={input ? '10' : undefined} // make room for clear button
            w="100%"
          />

          {input && (
            <InputElement>
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="Clear date range"
                onClick={handleClear}
                w="100%"
              />
            </InputElement>
          )}
        </InputElement>
      </>
    </InputGroup>
  );
}

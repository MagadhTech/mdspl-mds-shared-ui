import { Checkbox, HStack, Slider, Text, VStack } from '@chakra-ui/react';

import { useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { withChildren } from '../../utils/chakra-slot';

const CheckboxRoot = withChildren(Checkbox.Root);
const CheckboxHiddenInput = withChildren(Checkbox.HiddenInput);
const CheckboxControl = withChildren(Checkbox.Control);
const SliderRoot = withChildren(Slider.Root);
const SliderTrack = withChildren(Slider.Track);
const SliderRange = withChildren(Slider.Range);
const SliderThumbs = withChildren(Slider.Thumbs);
const SliderControl = withChildren(Slider.Control);

const SortableFilterItem = ({ filter, onVisibilityChange, onSizeChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: filter.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <VStack
      ref={setNodeRef}
      style={style}
      align="stretch"
      border="1px solid"
      borderColor="gray.200"
      rounded="md"
      p={3}
      mb={3}
      {...attributes}
      {...listeners}
    >
      <Text fontWeight="bold">{filter.label}</Text>

      {/* VISIBILITY */}
      <HStack justify="space-between">
        <Text fontSize="sm">Visible</Text>
        <CheckboxRoot
          checked={filter.visible}
          onCheckedChange={(val) => onVisibilityChange && onVisibilityChange(filter.id, !!val)}
          size="sm"
        >
          <CheckboxHiddenInput />
          <CheckboxControl />
        </CheckboxRoot>
      </HStack>

      {/* SIZE */}
      <VStack align="stretch" gap={1}>
        <Text fontSize="sm">Size</Text>
        <SliderRoot
          width="200px"
          min={1}
          max={5}
          step={0.5}
          value={[filter.size ?? 1]}
          onChange={(val) => onSizeChange && onSizeChange(filter.id, val[0])}
        >
          <SliderControl>
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumbs />
          </SliderControl>
        </SliderRoot>
      </VStack>
    </VStack>
  );
};

export default SortableFilterItem;

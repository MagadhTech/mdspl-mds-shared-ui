import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import * as React from 'react';
import { withChildren } from '../../utils/chakra-slot';

export interface MDSTooltipProps extends Omit<ChakraTooltip.RootProps, 'content' | 'children'> {
  /** The text or element to display inside the tooltip */
  content: React.ReactNode;
  /** The element that triggers the tooltip when hovered/focused */
  children: React.ReactNode;
  /** Whether to show the tooltip arrow (default: true) */
  showArrow?: boolean;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
  /** Whether to render the tooltip in a portal to avoid overflow clipping (default: true) */
  portalled?: boolean;
  /** Additional props to pass directly to the tooltip content container */
  contentProps?: ChakraTooltip.ContentProps;
}

const ChakraTooltipRoot = withChildren(ChakraTooltip.Root);
const ChakraTooltipTrigger = withChildren(ChakraTooltip.Trigger);
const ChakraTooltipPositioner = withChildren(ChakraTooltip.Positioner);
const ChakraTooltipContent = withChildren(ChakraTooltip.Content);
const ChakraTooltipArrow = withChildren(ChakraTooltip.Arrow);
const ChakraTooltipArrowTip = withChildren(ChakraTooltip.ArrowTip);

export const MDSTooltip = React.forwardRef<HTMLDivElement, MDSTooltipProps>(
  function MDSTooltip(props, ref) {
    const {
      showArrow = true,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      ...rest
    } = props;

    // If disabled, just render the child element without the tooltip wrapper
    if (disabled) return <>{children}</>;

    return (
      <ChakraTooltipRoot {...rest}>
        {/* asChild ensures the Trigger doesn't render an extra span/div and passes refs down */}
        <ChakraTooltipTrigger asChild>{children}</ChakraTooltipTrigger>

        <Portal disabled={!portalled}>
          <ChakraTooltipPositioner>
            <ChakraTooltipContent ref={ref} {...contentProps}>
              {showArrow && (
                <ChakraTooltipArrow>
                  <ChakraTooltipArrowTip />
                </ChakraTooltipArrow>
              )}
              {content}
            </ChakraTooltipContent>
          </ChakraTooltipPositioner>
        </Portal>
      </ChakraTooltipRoot>
    );
  },
);

export default MDSTooltip;

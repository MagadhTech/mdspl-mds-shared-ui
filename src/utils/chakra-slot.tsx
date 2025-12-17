import * as React from 'react';
import { forwardRef } from 'react';

/**
 * Chakra v3 / Ark UI slot components do NOT expose `children` in their typings.
 * This wrapper intentionally loosens typing to make them library-safe.
 */
export function withChildren(Component: any) {
  return forwardRef<any, any>((props, ref) => {
    const { children, ...rest } = props;

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Component ref={ref} {...(rest as any)}>
        {children}
      </Component>
    );
  });
}

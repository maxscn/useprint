import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconChevronLeft = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
        fill="currentColor"
      />
    </IconBase>
  ),
);

IconChevronLeft.displayName = 'IconChevronLeft';


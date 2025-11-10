import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconChevronRight = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z"
        fill="currentColor"
      />
    </IconBase>
  ),
);

IconChevronRight.displayName = 'IconChevronRight';


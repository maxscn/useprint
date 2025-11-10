import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconSkipPrevious = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M6 6H8V18H6V6ZM9.5 12L18 18V6L9.5 12Z"
        fill="currentColor"
      />
    </IconBase>
  ),
);

IconSkipPrevious.displayName = 'IconSkipPrevious';


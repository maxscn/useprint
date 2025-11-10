import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconSkipNext = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M6 18L14.5 12L6 6V18ZM16 6V18H18V6H16Z"
        fill="currentColor"
      />
    </IconBase>
  ),
);

IconSkipNext.displayName = 'IconSkipNext';


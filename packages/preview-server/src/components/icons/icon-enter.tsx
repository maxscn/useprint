import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconEnter = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M19 7V11H5.83L9.41 7.41L8 6L2 12L8 18L9.41 16.59L5.83 13H21V7H19Z"
        fill="currentColor"
      />
    </IconBase>
  ),
);

IconEnter.displayName = 'IconEnter';


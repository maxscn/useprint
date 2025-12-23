import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconOrientation = React.forwardRef<IconElement, Readonly<IconProps>>(
	({ ...props }, forwardedRef) => (
		<IconBase ref={forwardedRef} {...props}>
			<rect
				height="16"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.5"
				width="12"
				x="6"
				y="4"
			/>
		</IconBase>
	),
);

IconOrientation.displayName = 'IconOrientation';

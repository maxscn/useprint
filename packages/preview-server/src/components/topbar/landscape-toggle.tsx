import * as Toggle from '@radix-ui/react-toggle';
import { cn } from '../../utils';
import { IconOrientation } from '../icons/icon-orientation';
import { Tooltip } from '../tooltip';

interface LandscapeToggleProps {
	isLandscape: boolean;
	onToggle: () => void;
}

export const LandscapeToggle = ({ isLandscape, onToggle }: LandscapeToggleProps) => {
	return (
		<Toggle.Root
			aria-label="Toggle landscape mode"
			className={cn(
				'inline-flex items-center justify-center bg-slate-2 border border-slate-6 rounded-md h-[36px] w-[36px]',
				'hover:bg-slate-3 transition-colors',
				'data-[state=on]:bg-slate-4',
			)}
			onPressedChange={onToggle}
			pressed={isLandscape}
		>
			<Tooltip>
				<Tooltip.Trigger asChild>
					<div
						className={cn(
							'flex items-center justify-center transition-transform duration-300 ease-in-out',
							isLandscape && 'rotate-90',
						)}
					>
						<IconOrientation className="text-slate-11 hover:text-slate-12 transition-colors" size={18} />
					</div>
				</Tooltip.Trigger>
				<Tooltip.Content>
					{isLandscape ? 'Portrait' : 'Landscape'}
				</Tooltip.Content>
			</Tooltip>
		</Toggle.Root>
	);
};

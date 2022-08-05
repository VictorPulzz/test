import React from 'react';

interface Props {
	name: string;
	className?: string;
	width?: string | number;
	height?: string | number;
	size?: number;
	raw?: boolean;
}

export const Icon: React.FC<Props> = ({
	name,
	className,
	width = '100%',
	height = '100%',
	raw,
	size,
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		width={size !== undefined ? size : width}
		height={size !== undefined ? size : height}
		className={className}
	>
		<use
			xlinkHref={
				raw ? `/icons/raw-spritemap.svg#sprite-${name}` : `/icons/spritemap.svg#sprite-${name}`
			}
		/>
	</svg>
);

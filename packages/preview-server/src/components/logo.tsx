import Image from "next/image";
import * as React from "react";
import logo from "../app/logo.png";

export const Logo = () => {
	return (
		<div className="flex flex-col items-center justify-center py-4">
			<Image
				src={logo}
				alt="Skrift Logo"
				width={200}
				height={50}
				className="object-contain"
				priority
			/>
		</div>
	);
};

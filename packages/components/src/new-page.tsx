import type React from "react";

export const NewPage: React.FC = () => {
	const unbreakableStyle: React.CSSProperties = {
		breakAfter: "all",
	};

	return <div style={unbreakableStyle} />;
};

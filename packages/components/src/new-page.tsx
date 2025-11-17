import type React from "react";

export const NewPage: React.FC = () => {
	const unbreakableStyle: React.CSSProperties = {
		breakAfter: "all",
		pageBreakAfter: "always"
	};

	return <div style={unbreakableStyle} />;
};

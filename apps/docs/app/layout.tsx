import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import type { ComponentProps } from "react";
import "./global.css";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

type RootProviderChildren = ComponentProps<typeof RootProvider>["children"];

export const metadata: Metadata = {
  title: "UsePrint",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-[family-name:var(--font-body)]">
        <RootProvider>{children as RootProviderChildren}</RootProvider>
      </body>
    </html>
  );
}

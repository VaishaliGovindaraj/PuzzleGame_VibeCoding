import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillSprout - Kids Puzzle Game",
  description: "Educational puzzle games for kids aged 3-6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

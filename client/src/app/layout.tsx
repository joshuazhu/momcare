import type { Metadata } from "next";
import { Providers } from "../components/providers";
import { Navigation } from '../components/navigation'

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Navigation />
      </body>
    </html>
  );
}

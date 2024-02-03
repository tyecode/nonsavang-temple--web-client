import { ThemeProvider } from "@/components/providers/theme-provider";

import "./globals.css";

export const metadata = {
  title: "Abbeyard",
  description: "The fastest and easiest way to manage your ledger",
};
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

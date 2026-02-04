import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { I18nProvider } from "@/lib/i18n/I18nContext";

export const metadata: Metadata = {
  title: "Arcane Markdown",
  description: "A powerful block-based Markdown editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        <I18nProvider>
            <main className="min-h-screen bg-gray-50">{children}</main>
            <Toaster position="top-right" richColors />
        </I18nProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LENNY | הצ׳אט של סוכני הביטוח",
  description: "צ׳אט חכם אחד שמחליף את כל מערכות הבק-אופיס. תיקון ליקויים בלחיצה.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-lenny-bg text-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}

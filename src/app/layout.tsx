import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AuthHeader from "@/components/AuthHeader";
import ThemeProvider from "@/components/theme-provider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "UOL CGPA Calculator",
  description: "Calculate your CGPA with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${fraunces.variable} ${manrope.variable}`}
        suppressHydrationWarning={true}
      >
        <body
          className="min-h-screen bg-[#f7f3ec] text-slate-900 antialiased font-sans dark:bg-slate-950 dark:text-slate-100"
          suppressHydrationWarning={true}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange={true}
          >
            <AuthHeader />
            <main>{children}</main>
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

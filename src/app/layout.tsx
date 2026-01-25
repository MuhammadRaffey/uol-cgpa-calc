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
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorBackground: 'hsl(222 47% 8%)',
          colorInputBackground: 'hsl(222 47% 10%)',
          colorInputText: 'hsl(210 40% 96%)',
          colorText: 'hsl(210 40% 96%)',
          colorTextSecondary: 'hsl(215 16% 65%)',
          colorPrimary: 'hsl(167 80% 42%)',
          colorDanger: 'hsl(0 72% 52%)',
          borderRadius: '0.75rem',
        },
        elements: {
          rootBox: 'dark:bg-slate-950',
          card: 'dark:bg-slate-900/90 dark:border-white/10 backdrop-blur-xl',
          headerTitle: 'dark:text-slate-100',
          headerSubtitle: 'dark:text-slate-400',
          socialButtonsBlockButton: 'dark:bg-white/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10',
          formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700',
          footerActionLink: 'dark:text-emerald-400 hover:dark:text-emerald-300',
          formFieldInput: 'dark:bg-slate-950/60 dark:border-white/10 dark:text-slate-100',
          formFieldLabel: 'dark:text-slate-300',
          dividerLine: 'dark:bg-white/10',
          dividerText: 'dark:text-slate-400',
          footer: 'dark:bg-slate-900/90 dark:border-white/10',
          footerAction: 'dark:bg-slate-900/90',
          footerActionText: 'dark:text-slate-400',
          identityPreviewText: 'dark:text-slate-200',
          identityPreviewEditButton: 'dark:text-emerald-400',
          formResendCodeLink: 'dark:text-emerald-400',
          otpCodeFieldInput: 'dark:bg-slate-950/60 dark:border-white/10 dark:text-slate-100',
        },
      }}
    >
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

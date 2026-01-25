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
        variables: {
          colorBackground: "hsl(var(--background))",
          colorInputBackground: "hsl(var(--background))",
          colorInputText: "hsl(var(--foreground))",
          colorText: "hsl(var(--foreground))",
          colorTextSecondary: "hsl(var(--muted-foreground))",
          colorPrimary: "hsl(var(--primary))",
          colorDanger: "hsl(var(--destructive))",
          borderRadius: "var(--radius)",
        },
        elements: {
          rootBox: "bg-transparent",
          card: "bg-card/80 border border-border/60 shadow-lg backdrop-blur-xl",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton:
            "bg-secondary/60 border border-border text-foreground hover:bg-secondary/80",
          formButtonPrimary:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/80",
          formFieldInput:
            "bg-background/60 border border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary/30",
          formFieldLabel: "text-foreground",
          dividerLine: "bg-border/70",
          dividerText: "text-muted-foreground",
          footer: "bg-transparent",
          footerAction: "bg-transparent",
          footerActionText: "text-muted-foreground",
          identityPreviewText: "text-foreground",
          identityPreviewEditButton: "text-primary",
          formResendCodeLink: "text-primary",
          otpCodeFieldInput:
            "bg-background/60 border border-border text-foreground",
        },
      }}
    >
      <html
        lang="en"
        className={`${fraunces.variable} ${manrope.variable}`}
        suppressHydrationWarning={true}
      >
        <body
          className="min-h-screen bg-background text-foreground antialiased font-sans"
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

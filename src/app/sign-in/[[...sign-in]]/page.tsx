import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            baseTheme: undefined,
            elements: {
              rootBox: "mx-auto",
              card: {
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                borderRadius: "12px",
              },
              headerTitle: {
                color: "#f9fafb",
                fontSize: "24px",
                fontWeight: "600",
              },
              headerSubtitle: {
                color: "#d1d5db",
                fontSize: "14px",
              },
              formFieldLabel: {
                color: "#f9fafb",
                fontSize: "14px",
                fontWeight: "500",
              },
              formFieldInput: {
                backgroundColor: "#374151",
                borderColor: "#4b5563",
                color: "#f9fafb",
                fontSize: "16px",
                borderRadius: "8px",
                padding: "12px 16px",
                "&:focus": {
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 3px rgb(59 130 246 / 0.1)",
                },
                "&::placeholder": {
                  color: "#9ca3af",
                },
              },
              formButtonPrimary: {
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "500",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
                "&:focus": {
                  boxShadow: "0 0 0 3px rgb(59 130 246 / 0.1)",
                },
              },
              footerActionLink: {
                color: "#60a5fa",
                fontSize: "14px",
                "&:hover": {
                  color: "#93c5fd",
                  textDecoration: "underline",
                },
              },
              dividerLine: {
                backgroundColor: "#4b5563",
              },
              dividerText: {
                color: "#9ca3af",
                fontSize: "14px",
              },
              socialButtonsBlockButton: {
                backgroundColor: "#374151",
                borderColor: "#4b5563",
                color: "#f9fafb",
                fontSize: "16px",
                fontWeight: "500",
                padding: "12px 24px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#4b5563",
                  borderColor: "#6b7280",
                },
              },
              formFieldInputShowPasswordButton: {
                color: "#9ca3af",
                "&:hover": {
                  color: "#d1d5db",
                },
              },
              formFieldRow: {
                marginBottom: "16px",
              },
              formButtonReset: {
                color: "#9ca3af",
                fontSize: "14px",
                "&:hover": {
                  color: "#d1d5db",
                },
              },
              headerBackRow: {
                display: "none",
              },
              headerBackLink: {
                display: "none",
              },
            },
            variables: {
              colorPrimary: "#3b82f6",
              colorText: "#f9fafb",
              colorTextSecondary: "#d1d5db",
              colorBackground: "#1f2937",
              colorInputBackground: "#374151",
              colorInputText: "#f9fafb",
              borderRadius: "8px",
            },
          }}
          afterSignInUrl="/"
        />
      </div>
    </div>
  );
}

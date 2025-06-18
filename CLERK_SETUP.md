# Clerk Authentication Setup

This project has been integrated with Clerk for authentication. Follow these steps to complete the setup:

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3BsZW5kaWQtZWxmLTUuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_AEEgL2fH1hyQwIMp9xfK8M5X1kyguNezefg4KzG1Mn
```

## What's Been Added

1. **Middleware** (`src/middleware.ts`): Uses `clerkMiddleware()` to handle authentication routing
2. **Layout** (`src/app/layout.tsx`): Wrapped with `<ClerkProvider>` and includes authentication UI with dark theme
3. **Sign-In Page** (`src/app/sign-in/[[...sign-in]]/page.tsx`): Custom sign-in page with dark theme styling
4. **Page** (`src/app/page.tsx`): Updated with authentication redirect logic

## Features

- **Authentication Required**: Users must sign in to access the CGPA calculator
- **Automatic Redirect**: Unauthenticated users are redirected to sign-in page
- **Dark Theme**: All UI components match the existing dark theme
- **Modal Sign-Up**: Quick sign-up process via modal
- **User Button**: Shows user profile and sign-out option when signed in
- **Responsive Design**: Authentication UI is styled with Tailwind CSS

## Running the Application

1. Create the `.env.local` file with the provided keys
2. Run the development server: `pnpm dev`
3. Visit `http://localhost:3000`
4. You'll be redirected to sign-in if not authenticated
5. Test the authentication flow by signing up or signing in

## Clerk Dashboard

You can manage your application settings, users, and authentication flows through the [Clerk Dashboard](https://dashboard.clerk.com/).

## Next Steps

- Customize the authentication UI styling further
- Add user profile management
- Implement role-based access control
- Add user data persistence for CGPA calculations
- Set up webhooks for user management events

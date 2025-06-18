# Neon Database Setup Guide

This guide will help you set up Neon database for your CGPA calculator application.

## 🚀 **Step 1: Create Neon Account**

1. Go to [neon.com](https://neon.com)
2. Sign up for a free account
3. Create a new project

## 🔧 **Step 2: Get Database Connection String**

1. In your Neon dashboard, go to your project
2. Click on "Connection Details"
3. Copy the connection string (it looks like: `postgresql://user:password@host/database`)

## 📝 **Step 3: Environment Variables**

Add these to your `.env.local` file:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3BsZW5kaWQtZWxmLTUuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_AEEgL2fH1hyQwIMp9xfK8M5X1kyguNezefg4KzG1Mn

# Neon Database
DATABASE_URL="your_neon_connection_string_here"
```

## 🗄️ **Step 4: Database Migration**

Run these commands to set up your database:

```bash
# Generate Prisma client
pnpx prisma generate

# Push the schema to your database
pnpx prisma db push

# (Optional) View your database in Prisma Studio
pnpx prisma studio
```

## ✅ **Step 5: Verify Setup**

1. Start your development server: `pnpm dev`
2. Sign in to your application
3. Try saving a CGPA calculation
4. Check if it appears in the "Saved Calculations" panel

## 🔍 **Database Schema**

Your database will have two tables:

### **Users Table**

- `id`: Unique identifier
- `clerkId`: Clerk user ID
- `email`: User's email
- `createdAt`: Account creation date
- `updatedAt`: Last update date

### **CGPA Calculations Table**

- `id`: Unique identifier
- `userId`: Reference to user
- `calculationName`: Name given to the calculation
- `totalCredits`: Total credit hours
- `totalGradePoints`: Total grade points
- `cgpa`: Calculated CGPA
- `courses`: JSON array of course details
- `createdAt`: Calculation date
- `updatedAt`: Last update date

## 🎯 **Features Available**

- ✅ **Save Calculations**: Save your CGPA calculations with custom names
- ✅ **View History**: See all your saved calculations
- ✅ **Load Calculations**: Restore previous calculations
- ✅ **Delete Calculations**: Remove unwanted calculations
- ✅ **Real-time Updates**: Changes reflect immediately
- ✅ **User Isolation**: Each user only sees their own calculations

## 🛠️ **Troubleshooting**

### **Connection Issues**

- Verify your `DATABASE_URL` is correct
- Check if your Neon project is active
- Ensure your IP is not blocked

### **Migration Issues**

- Run `pnpx prisma generate` first
- Then run `pnpx prisma db push`
- Check the console for error messages

### **Authentication Issues**

- Verify Clerk keys are correct
- Check if user is properly signed in
- Look for CORS issues in browser console

## 📊 **Database Management**

### **View Data**

```bash
pnpx prisma studio
```

### **Reset Database**

```bash
pnpx prisma db push --force-reset
```

### **Generate Types**

```bash
pnpx prisma generate
```

## 🚀 **Production Deployment**

When deploying to production:

1. **Update Environment Variables**: Use production Clerk and Neon keys
2. **Database Migration**: Run `pnpx prisma db push` on your production database
3. **Build**: Run `pnpm build` to generate production build
4. **Deploy**: Deploy to your hosting platform (Vercel, Netlify, etc.)

## 💡 **Next Steps**

- Add data export functionality
- Implement calculation sharing
- Add calculation templates
- Create detailed analytics
- Add backup/restore features

Your CGPA calculator is now fully functional with database persistence! 🎉

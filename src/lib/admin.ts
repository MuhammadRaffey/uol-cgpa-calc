import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const parseCsv = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

export const requireAdmin = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const adminIds = new Set(parseCsv(process.env.ADMIN_CLERK_USER_IDS));
  const adminEmails = new Set(parseCsv(process.env.ADMIN_EMAILS));
  const primaryEmail = user.emailAddresses[0]?.emailAddress ?? "";

  const isAdmin = adminIds.has(userId) || adminEmails.has(primaryEmail);
  if (!isAdmin) {
    redirect("/");
  }

  return {
    userId,
    email: primaryEmail,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
  };
};

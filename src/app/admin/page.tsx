import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import Link from "next/link";
import AdminUserList, {
  type AdminUserListItem,
} from "@/components/admin/user-list";
import {
  AnimatedHeader,
  AnimatedBadge,
  AnimatedStatCard,
  AnimatedPanel,
  AnimatedUserDetail,
  AnimatedListItem,
} from "@/components/admin/animated-elements";
import AdminNavbar from "@/components/admin/AdminNavbar";

const toDateString = (value: Date | string | number | null) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const parseCourses = (courses: unknown) => {
  if (!Array.isArray(courses)) return [];
  return courses
    .map((course) => {
      const record = course as {
        name?: string;
        credits?: number;
        grade?: string;
      };
      return {
        name: record.name ?? "Untitled",
        credits: typeof record.credits === "number" ? record.credits : 0,
        grade: record.grade ?? "—",
      };
    })
    .filter((course) => course.name || course.credits || course.grade);
};

type CalculationRecord = {
  id: string;
  calculationName: string;
  totalCredits: number;
  totalGradePoints: number;
  cgpa: number;
  courses: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type AdminPageProps = {
  searchParams?: Promise<{ userId?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireAdmin();
  const resolvedSearchParams = (await searchParams) ?? {};

  const client = await clerkClient();
  type UserListResponse = Awaited<
    ReturnType<(typeof client)["users"]["getUserList"]>
  >;

  const fetchAllUsers = async () => {
    const limit = 100;
    let offset = 0;
    let totalCount = 0;
    let users: UserListResponse["data"] = [];

    while (true) {
      const page = await client.users.getUserList({
        limit,
        offset,
        orderBy: "-created_at",
      });
      if (totalCount === 0) {
        totalCount = page.totalCount;
      }
      users = users.concat(page.data);
      offset += page.data.length;
      if (page.data.length < limit || offset >= page.totalCount) {
        break;
      }
    }

    return { users, totalCount };
  };

  const { users: allUsers } = await fetchAllUsers();

  const dbUsers = await prisma.user.findMany({
    select: {
      clerkId: true,
      email: true,
      createdAt: true,
      _count: { select: { calculations: true } },
    },
  });

  const clerkUserIds = new Set(allUsers.map((user) => user.id));
  const calculationCounts = new Map(
    dbUsers.map((user) => [user.clerkId, user._count.calculations])
  );

  const legacyUsers = dbUsers.filter((user) => !clerkUserIds.has(user.clerkId));

  const toClerkListItem = (
    user: UserListResponse["data"][number]
  ): AdminUserListItem => {
    const displayName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.emailAddresses[0]?.emailAddress ||
      "Unnamed user";

    return {
      id: user.id,
      name: displayName,
      email: user.emailAddresses[0]?.emailAddress ?? "—",
      calculationCount: calculationCounts.get(user.id) ?? 0,
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
      source: "clerk",
    };
  };

  const toLegacyListItem = (user: (typeof dbUsers)[number]): AdminUserListItem => ({
    id: user.clerkId,
    name: user.email ?? "Legacy user",
    email: user.email ?? "No email",
    calculationCount: user._count.calculations,
    createdAt: user.createdAt.toISOString(),
    source: "legacy",
  });

  const mergedUsers: AdminUserListItem[] = [
    ...allUsers.map(toClerkListItem),
    ...legacyUsers.map(toLegacyListItem),
  ].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const totalCalculations = mergedUsers.reduce(
    (sum, user) => sum + user.calculationCount,
    0
  );

  const activeUsers = mergedUsers.filter(
    (user) => user.calculationCount > 0
  ).length;

  const totalUsers = mergedUsers.length;

  const selectedUserId = resolvedSearchParams.userId;
  const selectedDbUser = selectedUserId
    ? await prisma.user.findUnique({
        where: { clerkId: selectedUserId },
        include: {
          calculations: {
            orderBy: { updatedAt: "desc" },
          },
        },
      })
    : null;

  const selectedClerkUser = selectedUserId
    ? await client.users.getUser(selectedUserId).catch(() => null)
    : null;

  const toCalculationRecord = (
    calculation: NonNullable<typeof selectedDbUser>["calculations"][number]
  ): CalculationRecord => ({
    id: calculation.id,
    calculationName: calculation.calculationName,
    totalCredits: Number(calculation.totalCredits),
    totalGradePoints: Number(calculation.totalGradePoints),
    cgpa: Number(calculation.cgpa),
    courses: calculation.courses,
    createdAt: calculation.createdAt,
    updatedAt: calculation.updatedAt,
  });

  const selectedCalculations = (selectedDbUser?.calculations ?? []).map(
    toCalculationRecord
  );

  const selectedDisplayName =
    selectedClerkUser &&
    ([selectedClerkUser.firstName, selectedClerkUser.lastName]
      .filter(Boolean)
      .join(" ") ||
      selectedClerkUser.emailAddresses[0]?.emailAddress);

  const selectedEmail =
    selectedClerkUser?.emailAddresses[0]?.emailAddress ??
    selectedDbUser?.email ??
    "No email on record";

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 px-4 pt-24 pb-12 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-[2.5rem] opacity-10 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
          <div className="relative rounded-[2.5rem] border-2 border-slate-200/80 glass-strong p-10 shadow-custom-2xl dark:border-white/10">
            <AnimatedBadge className="inline-flex items-center gap-2 rounded-full border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-700 shadow-sm dark:border-purple-400/30 dark:from-purple-400/10 dark:to-pink-400/10 dark:text-purple-200">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Console
            </AnimatedBadge>
            <h1 className="mt-5 text-4xl font-black text-slate-900 font-display dark:text-slate-100">
              User activity
              <span className="gradient-text"> overview</span>
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
              Track Clerk signups and review every saved CGPA calculation.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { label: "Total users", value: totalUsers, gradient: "from-blue-400 to-cyan-400" },
            { label: "Active users", value: activeUsers, gradient: "from-emerald-400 to-teal-400" },
            { label: "Saved calculations", value: totalCalculations, gradient: "from-purple-400 to-pink-400" },
          ].map((stat, index) => (
            <AnimatedStatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              gradient={stat.gradient}
              index={index}
            />
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_2fr]">
          {/* User List - Hidden on mobile when user is selected */}
          <div className={`group relative ${selectedUserId ? 'hidden lg:block' : ''}`}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-[2rem] opacity-0 group-hover:opacity-10 blur transition-opacity duration-500"></div>
            <div className="relative rounded-[2rem] border-2 border-slate-200/80 glass p-8 shadow-custom-lg dark:border-white/10">
              <AdminUserList users={mergedUsers} selectedUserId={selectedUserId} />
            </div>
          </div>

          {/* User Detail Panel - Full width on mobile when user is selected */}
          <div className={`group relative ${selectedUserId ? 'lg:col-start-2' : ''}`}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-[2rem] opacity-0 group-hover:opacity-10 blur transition-opacity duration-500"></div>
            <div className="relative rounded-[2rem] border-2 border-slate-200/80 glass p-8 shadow-custom-lg dark:border-white/10">
              {!selectedUserId && (
                <div className="text-center text-slate-500 dark:text-slate-400 py-20">
                  <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-lg font-semibold">Select a user to view their saved CGPA activity.</p>
                </div>
              )}

              {selectedUserId && (
              <AnimatedUserDetail className="space-y-6">
                {/* Back to Users button - visible only on mobile */}
                <Link 
                  href="/admin" 
                  className="lg:hidden inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Users
                </Link>
                
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    User detail
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 break-all">
                    {selectedDisplayName ?? selectedEmail}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 break-words">
                    {selectedEmail}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950/60">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                        Clerk joined
                      </p>
                      <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                        {toDateString(
                          selectedClerkUser?.createdAt ?? selectedDbUser?.createdAt ?? null
                        )}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950/60">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                        Saved sessions
                      </p>
                      <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                        {selectedCalculations.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedCalculations.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200/80 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                      No saved CGPA calculations for this user yet.
                    </div>
                  )}

                  {selectedCalculations.map((calculation, calcIndex) => {
                    const courses = parseCourses(calculation.courses);
                    const isAuto =
                      calculation.calculationName === "Auto-saved";

                    return (
                      <AnimatedListItem
                        key={calculation.id}
                        index={calcIndex}
                        className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/60"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {calculation.calculationName}
                              </h3>
                              {isAuto && (
                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                                  Auto-saved
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Updated {toDateString(calculation.updatedAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                CGPA
                              </p>
                              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                {Number(calculation.cgpa).toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                Credits
                              </p>
                              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                {Number(calculation.totalCredits)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900/70">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                              Grade Points
                            </p>
                            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                              {Number(calculation.totalGradePoints).toFixed(2)}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900/70">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                              Courses
                            </p>
                            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                              {courses.length}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900/70">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                              Created
                            </p>
                            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
                              {toDateString(calculation.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10">
                          <div className="grid grid-cols-3 gap-4 bg-slate-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                            <span>Course</span>
                            <span>Credits</span>
                            <span>Grade</span>
                          </div>
                          <div className="divide-y divide-slate-200/80 dark:divide-white/10">
                            {courses.length === 0 && (
                              <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                                No course details available.
                              </div>
                            )}
                            {courses.map((course, index) => (
                              <div
                                key={`${calculation.id}-${index}`}
                                className="grid grid-cols-3 gap-4 px-4 py-3 text-sm text-slate-700 dark:text-slate-200"
                              >
                                <span>{course.name}</span>
                                <span>{course.credits}</span>
                                <span>{course.grade}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AnimatedListItem>
                    );
                  })}
                </div>
              </AnimatedUserDetail>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
    </>
  );
}

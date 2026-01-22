import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import AdminUserList, {
  type AdminUserListItem,
} from "@/components/admin/user-list";

const toDateString = (value: Date | string | null) => {
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

  const mergedUsers: AdminUserListItem[] = [
    ...allUsers.map((user) => {
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
    }),
    ...legacyUsers.map((user) => ({
      id: user.clerkId,
      name: user.email ?? "Legacy user",
      email: user.email ?? "No email",
      calculationCount: user._count.calculations,
      createdAt: user.createdAt.toISOString(),
      source: "legacy",
    })),
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

  const selectedCalculations =
    (selectedDbUser?.calculations as CalculationRecord[]) ?? [];

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
    <div className="min-h-screen bg-[#f7f3ec] px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-8 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Admin Console
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 font-display dark:text-slate-100">
            User activity overview
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Track Clerk signups and review every saved CGPA calculation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { label: "Total users", value: totalUsers },
            { label: "Active users", value: activeUsers },
            { label: "Saved calculations", value: totalCalculations },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
            <AdminUserList users={mergedUsers} selectedUserId={selectedUserId} />
          </div>

          <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
            {!selectedUserId && (
              <div className="text-center text-slate-500 dark:text-slate-400 py-20">
                Select a user to view their saved CGPA activity.
              </div>
            )}

            {selectedUserId && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    User detail
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {selectedDisplayName ?? selectedEmail}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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

                  {selectedCalculations.map((calculation) => {
                    const courses = parseCourses(calculation.courses);
                    const isAuto =
                      calculation.calculationName === "Auto-saved";

                    return (
                      <div
                        key={calculation.id}
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
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

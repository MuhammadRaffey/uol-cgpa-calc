import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { calculationName, totalCredits, totalGradePoints, cgpa, courses } =
      body;

    // Get or create user
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || null,
        },
      });
    }

    // Create calculation
    const calculation = await prisma.cGPACalculation.create({
      data: {
        userId: dbUser.id,
        calculationName,
        totalCredits: parseFloat(totalCredits),
        totalGradePoints: parseFloat(totalGradePoints),
        cgpa: parseFloat(cgpa),
        courses,
      },
    });

    return NextResponse.json(calculation);
  } catch (error) {
    console.error("Error saving calculation:", error);
    return NextResponse.json(
      { error: "Failed to save calculation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json([]);
    }

    // Get all calculations for user
    const calculations = await prisma.cGPACalculation.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(calculations);
  } catch (error) {
    console.error("Error fetching calculations:", error);
    return NextResponse.json(
      { error: "Failed to fetch calculations" },
      { status: 500 }
    );
  }
}

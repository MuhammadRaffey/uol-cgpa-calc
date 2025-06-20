import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else {
      // Handle sendBeacon data (plain text)
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse request body:", parseError);
        return NextResponse.json(
          { error: "Invalid request body" },
          { status: 400 }
        );
      }
    }

    const { totalCredits, totalGradePoints, cgpa, courses } = body;

    // Validate that we have meaningful data to save
    if (totalCredits === 0 && courses.length === 0) {
      return NextResponse.json({ message: "No data to save" }, { status: 200 });
    }

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

    // Check if there's already an auto-saved calculation for this user
    const existingAutoSave = await prisma.cGPACalculation.findFirst({
      where: {
        userId: dbUser.id,
        calculationName: "Auto-saved",
      },
      orderBy: { updatedAt: "desc" },
    });

    if (existingAutoSave) {
      // Update existing auto-save
      const updatedCalculation = await prisma.cGPACalculation.update({
        where: { id: existingAutoSave.id },
        data: {
          totalCredits: parseFloat(totalCredits),
          totalGradePoints: parseFloat(totalGradePoints),
          cgpa: parseFloat(cgpa),
          courses,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(updatedCalculation);
    } else {
      // Create new auto-save
      const calculation = await prisma.cGPACalculation.create({
        data: {
          userId: dbUser.id,
          calculationName: "Auto-saved",
          totalCredits: parseFloat(totalCredits),
          totalGradePoints: parseFloat(totalGradePoints),
          cgpa: parseFloat(cgpa),
          courses,
        },
      });

      return NextResponse.json(calculation);
    }
  } catch (error) {
    console.error("Error auto-saving calculation:", error);
    return NextResponse.json(
      { error: "Failed to auto-save calculation" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { calculationName } = body;

    if (!calculationName || typeof calculationName !== "string") {
      return NextResponse.json(
        { error: "Calculation name is required" },
        { status: 400 }
      );
    }

    // Get user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update calculation (only if it belongs to the user)
    const updatedCalculation = await prisma.cGPACalculation.updateMany({
      where: {
        id: id,
        userId: dbUser.id,
      },
      data: {
        calculationName: calculationName,
      },
    });

    if (updatedCalculation.count === 0) {
      return NextResponse.json(
        { error: "Calculation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating calculation:", error);
    return NextResponse.json(
      { error: "Failed to update calculation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete calculation (only if it belongs to the user)
    const deletedCalculation = await prisma.cGPACalculation.deleteMany({
      where: {
        id: id,
        userId: dbUser.id,
      },
    });

    if (deletedCalculation.count === 0) {
      return NextResponse.json(
        { error: "Calculation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting calculation:", error);
    return NextResponse.json(
      { error: "Failed to delete calculation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { calculationName, totalCredits, totalGradePoints, cgpa, courses } =
      body;

    if (!calculationName || typeof calculationName !== "string") {
      return NextResponse.json(
        { error: "Calculation name is required" },
        { status: 400 }
      );
    }

    if (
      typeof totalCredits !== "number" ||
      typeof totalGradePoints !== "number" ||
      typeof cgpa !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid numeric values" },
        { status: 400 }
      );
    }

    if (!Array.isArray(courses)) {
      return NextResponse.json(
        { error: "Courses must be an array" },
        { status: 400 }
      );
    }

    // Get user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update calculation (only if it belongs to the user)
    const updatedCalculation = await prisma.cGPACalculation.updateMany({
      where: {
        id: id,
        userId: dbUser.id,
      },
      data: {
        calculationName,
        totalCredits: parseFloat(totalCredits.toString()),
        totalGradePoints: parseFloat(totalGradePoints.toString()),
        cgpa: parseFloat(cgpa.toString()),
        courses,
      },
    });

    if (updatedCalculation.count === 0) {
      return NextResponse.json(
        { error: "Calculation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating calculation:", error);
    return NextResponse.json(
      { error: "Failed to update calculation" },
      { status: 500 }
    );
  }
}

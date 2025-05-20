import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(NextRequest: Request) {
  try {

   const { title, location, description, isPublic, startDate, endDate } = await NextRequest.json();
   console.log("Received data:", isPublic)
    const event = await prisma.event.create({
      data: {
        title : title,
        location: location,
        description: description,
        isPublic: isPublic,
       startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        creator: {
          connect: { id: 1 }, 
        },
      },
    });
    console.log("Event created:", event);


    return NextResponse.json(event);
  }catch (error) {
  console.error("Error creating event:", error);
  return NextResponse.json({ error: "Error creating event" }, { status: 500 });
  } 
}


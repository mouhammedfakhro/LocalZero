import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST() {
  let events = await prisma.event.findMany();

  if (events.length === 0) {
    try {
      const user = await prisma.user.findFirst();
      
      if (!user) {
        const newUser = await prisma.user.create({
          data: {
            username: "mockuser",
            password: "mockpassword",
            email: "mockuser@example.com",
            role: "RESIDENT",
            neighborhoodId: 1, 
          },
        });
        
        await prisma.event.createMany({
          data: [
            {
              title: "Dev Conference",
              location: "Remote",
              category: "Tech",
              isPublic: true,
              creatorId: newUser.id,
            },
            {
              title: "Art Fair",
              location: "Berlin",
              category: "Art",
              isPublic: false,
              creatorId: newUser.id,
            },
          ],
        });
      } else {

        await prisma.event.createMany({
          data: [
            {
              title: "Dev Conference",
              location: "Remote",
              category: "Tech",
              isPublic: true,
              creatorId: user.id,
            },
            {
              title: "Art Fair",
              location: "Berlin",
              category: "Art",
              isPublic: false,
              creatorId: user.id,
            },
          ],
        });
      }

      events = await prisma.event.findMany();
    } catch (error) {
      console.error("Error creating mock data:", error);
      return NextResponse.json({ error: "Failed to create mock data" }, { status: 500 });
    }
  }

  return NextResponse.json(events);
}
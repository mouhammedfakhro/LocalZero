import prisma from "../../../../lib/prisma";

export default async function GET() {
  const events = await prisma.event.findMany();

  console.log(events);
}

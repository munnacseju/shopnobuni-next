import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const adminId = parseInt(searchParams.get('adminId') || '0')

  try {
    // Find unique users who have messaged the admin or been messaged by the admin
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: adminId },
          { receiverId: adminId },
        ]
      },
      select: {
        senderId: true,
        receiverId: true,
      }
    })

    const userIds = new Set<number>()
    messages.forEach(m => {
      if (m.senderId !== adminId) userIds.add(m.senderId)
      if (m.receiverId !== adminId) userIds.add(m.receiverId)
    })

    const users = await prisma.user.findMany({
      where: {
        id: { in: Array.from(userIds) }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

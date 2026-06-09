import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const message = await prisma.chatMessage.create({
      data: {
        senderId: data.sender.id,
        receiverId: data.receiver.id,
        content: data.content,
        timestamp: new Date(),
        isRead: false
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      }
    })
    return NextResponse.json(message)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

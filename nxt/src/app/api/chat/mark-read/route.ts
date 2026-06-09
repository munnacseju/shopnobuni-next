import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const receiverId = parseInt(searchParams.get('receiverId') || '0')
  const senderId = parseInt(searchParams.get('senderId') || '0')

  try {
    await prisma.chatMessage.updateMany({
      where: {
        receiverId,
        senderId,
        isRead: false
      },
      data: { isRead: true }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

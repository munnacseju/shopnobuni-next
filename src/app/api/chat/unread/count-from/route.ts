import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const receiverId = parseInt(searchParams.get('receiverId') || '0')
  const senderId = parseInt(searchParams.get('senderId') || '0')

  try {
    const count = await prisma.chatMessage.count({
      where: {
        receiverId,
        senderId,
        isRead: false
      }
    })
    return NextResponse.json(count)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

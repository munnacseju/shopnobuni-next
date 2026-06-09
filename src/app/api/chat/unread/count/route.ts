import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = parseInt(searchParams.get('userId') || '0')

  try {
    const count = await prisma.chatMessage.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    })
    return NextResponse.json(count)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

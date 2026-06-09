import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const review = await prisma.review.create({
      data: {
        productId: data.product.id,
        userId: data.user.id,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: { select: { name: true } }
      }
    })
    return NextResponse.json(review)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

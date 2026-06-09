import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: {
        user: { select: { name: true } }
      }
    })
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

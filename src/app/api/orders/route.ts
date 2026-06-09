import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: {
          include: { product: true }
        }
      }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    // data.items is expected to be an array of { productId, quantity, price }
    
    const order = await prisma.order.create({
      data: {
        userId: data.user.id,
        totalAmount: data.totalAmount,
        status: 'PENDING',
        items: {
          create: data.items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: {
        items: true
      }
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

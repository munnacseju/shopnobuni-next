import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user && user.password === password) {
      // In a real app, don't return the password
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword)
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

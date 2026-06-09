import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopnobuni.com' },
    update: {},
    create: {
      email: 'admin@shopnobuni.com',
      name: 'Admin User',
      password: 'admin',
      role: 'ROLE_ADMIN',
      address: 'Shopno Buni HQ, Dhaka'
    },
  })
  console.log(`Created admin: ${admin.email} / password: admin`)

  // Create User
  const customer = await prisma.user.upsert({
    where: { email: 'customer@shopnobuni.com' },
    update: {},
    create: {
      email: 'customer@shopnobuni.com',
      name: 'Test Customer',
      password: 'password',
      role: 'ROLE_USER',
      address: '123 Test Street, Dhaka'
    },
  })
  console.log(`Created customer: ${customer.email} / password: password`)

  // Create Products
  const products = [
    {
      name: 'Elegant Gold Necklace',
      description: 'A beautiful 24k gold necklace for special occasions. Features intricate detailing and a brilliant shine.',
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1599643478514-4a4e0a4f5b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      stock: 10,
      category: 'Premium Jewelry',
      discountPercentage: 10,
      type: 'NECKLACE' as const,
    },
    {
      name: 'Diamond Finger Ring',
      description: 'A stunning diamond ring with a classic cut, perfect for engagements or special gifts.',
      price: 45000,
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f6612d55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      stock: 5,
      category: 'Bridal Collection',
      discountPercentage: 0,
      type: 'FINGER_RING' as const,
    },
    {
      name: 'Silver Bangles Set',
      description: 'Handcrafted silver bangles perfect for everyday wear. Lightweight and durable.',
      price: 8500,
      imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      stock: 20,
      category: 'Daily Wear',
      discountPercentage: 5,
      type: 'BANGLE' as const,
    },
    {
      name: 'Pearl Drop Earrings',
      description: 'Elegant pearl earrings that match any outfit. Sourced from the finest freshwater pearls.',
      price: 12000,
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      stock: 15,
      category: 'Classic Collection',
      discountPercentage: 15,
      type: 'EARRING' as const,
    },
    {
      name: 'Traditional Gold Chain',
      description: 'A traditional 22k gold chain with a timeless design. Suitable for both men and women.',
      price: 32000,
      imageUrl: 'https://images.unsplash.com/photo-1622398925373-3f9eba0e46fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      stock: 8,
      category: 'Premium Jewelry',
      discountPercentage: 0,
      type: 'GOLD_CHAIN' as const,
    }
  ]

  for (const p of products) {
    const exists = await prisma.product.findFirst({ where: { name: p.name } })
    if (!exists) {
      await prisma.product.create({ data: p })
      console.log(`Created product: ${p.name}`)
    }
  }

  console.log('Seeding finished successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

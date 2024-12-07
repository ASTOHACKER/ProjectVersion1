// นำเข้า PrismaClient จาก @prisma/client
import { PrismaClient } from '@prisma/client'

// สร้างตัวแปร globalForPrisma และกำหนดให้เท่ากับ global
const globalForPrisma = global

// สร้างและส่งออกตัวแปร prisma
// ถ้า globalForPrisma.prisma มีค่า ให้ใช้ค่านั้น ถ้าไม่มีให้สร้าง PrismaClient ใหม่
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// ถ้าไม่ได้อยู่ในโหมด production ให้กำหนด globalForPrisma.prisma เป็น prisma
// เพื่อป้องกันการสร้าง PrismaClient ใหม่ทุกครั้งที่ hot-reload
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// ส่งออก prisma เป็นค่าเริ่มต้น
export default { prisma }

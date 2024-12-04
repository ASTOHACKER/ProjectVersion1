// นำเข้าโมดูลที่จำเป็นสำหรับการทำระบบ Authentication
import NextAuth from "next-auth";  // ใช้สำหรับระบบ authentication หลัก
import GoogleProvider from "next-auth/providers/google";  // สำหรับการ login ด้วย Google
import CredentialsProvider from "next-auth/providers/credentials";  // สำหรับการ login ด้วยอีเมลและรหัสผ่าน
import clientPromise from "@/libs/mongoConnect";  // การเชื่อมต่อกับ MongoDB
import { MongoDBAdapter } from "@auth/mongodb-adapter";  // Adapter สำหรับเก็บข้อมูล session ใน MongoDB
import mongoose from "mongoose";  // ODM สำหรับจัดการฐานข้อมูล MongoDB
import User from "@/app/models/User";  // โมเดลผู้ใช้งาน

// ฟังก์ชันสำหรับเชื่อมต่อ MongoDB
async function connectToMongoDB() {
  if (mongoose.connection.readyState !== 1) {  // ตรวจสอบว่าเชื่อมต่อแล้วหรือยัง
    await mongoose.connect(process.env.MONGODB_URI);  // เชื่อมต่อ MongoDB
  }
}

// กำหนดค่า NextAuth
export const authOptions = {
  // กำหนด adapter เป็น MongoDB สำหรับเก็บข้อมูล session
  adapter: MongoDBAdapter(clientPromise),

  // กำหนดวิธีการ login ที่รองรับ
  providers: [
    // การ login ด้วย Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // การ login ด้วยอีเมลและรหัสผ่าน
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "อีเมล", type: "email" },
        password: { label: "รหัสผ่าน", type: "password" }
      },
      // ฟังก์ชันตรวจสอบข้อมูลผู้ใช้
      async authorize(credentials, req) {
        const { email, password } = credentials;
        
        try {
          await connectToMongoDB();  // เชื่อมต่อ MongoDB

          // ค้นหาผู้ใช้จากอีเมล
          const user = await User.findOne({ email });
          
          if (!user) {
            throw new Error('ไม่พบบัญชีผู้ใช้');
          }

          // ตรวจสอบรหัสผ่าน
          const isPasswordValid = await user.comparePassword(password);
          
          if (!isPasswordValid) {
            throw new Error('รหัสผ่านไม่ถูกต้อง');
          }

          // ส่งข้อมูลผู้ใช้กลับไป
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          throw new Error(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        }
      }
    }),
  ],

  // กำหนดหน้าที่เกี่ยวข้องกับ authentication
  pages: {
    signIn: '/login',  // หน้า login
    error: '/login',   // หน้าแสดงข้อผิดพลาด
  },

  // กำหนดการจัดการ session
  session: {
    strategy: 'jwt',  // ใช้ JWT สำหรับจัดการ session
  },

  // กำหนดการจัดการ callbacks
  callbacks: {
    // ปรับแต่ง JWT token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;  // เพิ่มข้อมูลผู้ใช้ลงใน token
      }
      return token;
    },
    // ปรับแต่ง session
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;  // เพิ่มข้อมูลผู้ใช้ลงใน session
      }
      return session;
    }
  },

  // กำหนดค่าความปลอดภัยและการ debug
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// สร้าง handler สำหรับ NextAuth
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
export default User;  // ต้องมีบรรทัดนี้ที่ท้ายไฟล์
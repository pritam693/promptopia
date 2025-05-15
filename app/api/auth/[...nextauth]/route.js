// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { connectToDB } from "@/utils/database"
import User from "@/models/user"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // on sign in, ensure user exists in DB
    async signIn({ profile }) {
      try {
        await connectToDB()
        const userExists = await User.findOne({ email: profile.email })
        if (!userExists) {
          await User.create({
            email:    profile.email,
            username: profile.name.replace(/\s+/g, "").toLowerCase(),
            image:    profile.picture,
          })
        }
        return true
      } catch (err) {
        console.error("Error in signIn callback:", err)
        return false
      }
    },
    // attach the MongoDB _id onto the session
    async session({ session }) {
      await connectToDB()
      const sessionUser = await User.findOne({ email: session.user.email })
      session.user.id = sessionUser._id.toString()
      return session
    },
    // optional: also stick id on the JWT so you could use token.id if you prefer
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

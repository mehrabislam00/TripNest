import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.BETTER_AUTH_MONGO_URI as string)
const db = client.db("auth")

export const auth = betterAuth({
  plugins: [
    // Add any plugins you want to use here
    jwt(),
  ],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  database: mongodbAdapter(db, {
    client,
  }),
})

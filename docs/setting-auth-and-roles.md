---
sidebar_position: 100
---

# Setting up Auth and User Roles

After generating the routes with **AutoApi**! You will probably want to add authentication and some user roles in your server api.
I order to do this with **AutoApi** you must setup some models such as:

- User
- PublicProfile
- StaffProfile
- AuthRole
- AuthPermission
- UserRole

Even though you can set this models yourself (if you do not want to use auto-api built in auth), when using using auto-api built-in auth there are some fields that must be present on those models, remembering you can add some fields if you want.

## User model

```ts
model User {
   id String @id @default(uuid())
   name String
   email String @unique
   isStaff Boolean @default(false)

   password String
   passwordChangedAt DateTime?
   passwordResetOtp String?
   passwordResetOtpExpiresAt DateTime?
   verificationOtp String?
   verificationOptExpiresAt DateTime?
   isVerified Boolean @default(false)
   deletedSelfAccount Boolean @default(false)
   active Boolean @default(true)

   publicProfile PublicProfile?
   staffProfile StaffProfile? // to hold specifc data related to app staff people.
}
```

Make sure you have **Node.js 18+** installed before proceeding.

## 🛠 Setting Up Prisma

AutoApi requires **Prisma** for database management. If you haven't set up Prisma yet, follow these steps:

1. **Initialize Prisma in your project**:

   ```bash
   npx prisma init
   ```

2. **Configure your database**:
   Open `.env` and set up your database connection:

   ```env
   DATABASE_URL="your-database-connection-string"
   ```

3. **Define the User model** in `prisma/schema/user.prisma` (required for authentication):

   ```prisma


    model PublicProfile {
        id        String    @id @default(uuid())
        userId String @unique
        user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
    }
    // You can add other fields for users that must not acess admin page.
    // users that can make signup to join the app.


    model StaffProfile {
        id        String    @id @default(uuid())
        userId String @unique
        user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
    }
    // You can add other fields for users that will acess admin page.
   ```

4. **Apply the schema to your database**:

   ```bash
   npx prisma migrate dev --name init
   ```

## 🚀 Running AutoApi

Once Prisma is set up, create an app.ts or .js under src folder in root dir:

```ts
# src/app.ts

import { initApp } from "auto-api"
import express from "express"

const app = express()

initApp(app)
```

This will automatically generate API routes based on your **Prisma models name**.

## 🔍 Verify the API

After starting the server, open your browser or use a tool like **Postman** to test the API:

```bash
GET http://localhost:3000/api/users
```

You should see an empty list of users, which means your API is working!

## 📖 Next Steps

- [Configuration](./configuration) → Customize authentication, middleware, and more.
- [Features](./features/routes) → Learn about AutoApi's powerful features.
- [API Reference](./api-reference/overview) → Explore available endpoints.

---

Your API is now set up and running. Happy coding! 🚀

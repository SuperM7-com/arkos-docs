---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Introduction to Arkos

**Arkos** is a powerful, lightweight backend framework built on top of Express.js and Prisma that revolutionizes API development. It automates common backend tasks while providing the flexibility developers need for custom solutions.

### Key Features

- 🚀 **Automatic API Generation** – Create RESTful endpoints instantly from your Prisma models
- 🔐 **Built-in Authentication** – JWT-based auth with role-based access control
- ⚡ **Express Middlewares** – Pre-configured security and request handling
- 🛡️ **Data Validation** – Support for both class-validator and Zod
- ⬆️ **File Upload & Optimization** – Efficient handling of images, videos, and documents
- 💠 **Prisma Integration** – Seamless database management with relation handling
- 👨‍💻 **Interceptors** – Flexible request/response modification
- ✉️ **Nodemailer Integration** – Built-in email functionality

### Why Arkos?

Arkos eliminates repetitive setup tasks and boilerplate code, allowing developers to focus on building features rather than infrastructure. It's perfect for:

- Full-Stack Applications
- Enterprise Solutions
- Rapid API Development
- MVPs and Prototypes

### Origin of the Name

The name "Arkos" comes from the Greek word "ἀρχή" (Arkhē), meaning "beginning" or "foundation". This reflects our goal of providing a solid foundation for backend development.

## Quick Start

<Tabs>
  <TabItem value="js" label="JavaScript" >

    ```js
    // src/app.js
    const arkos = require("arkos");

    arkos.init({ port: 8000 });
    ```

  </TabItem>
  <TabItem value="ts" label="TypeScript" default>

    ```ts
    // src/app.ts
    import arkos from "arkos";

    arkos.init({ port: 8000 });
    ```

  </TabItem>
</Tabs>

## Next Steps

- [Getting Started](/docs/getting-started) - Set up your first Arkos project
- [Project Structure](/docs/project-structure) - See the the **Arkos** project structure
- [How Does It Works](/docs/how-does-arkos-works) - Learn about **Arkos** behind the scene work
- [Core Concepts](/docs/category/core-concepts) - Catch up with arkos core

---

Ready to build your API? Let's get started! 🚀

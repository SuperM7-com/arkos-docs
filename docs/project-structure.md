---
sidebar_position: 3
---

# Project Structure

This framework uses a thoughtfully organized structure that balances clarity and flexibility, drawing some inspiration from NestJS while emphasizing a file-based approach to reduce complexity for developers.

## Overview

The project structure follows these key principles:

- **File-based approach** for most cases, reducing the need to worry about complex folder hierarchies
- **Module-based organization** for clear separation of concerns
- **Consistent naming conventions** for special files (.middlewares.ts, .auth-configs.ts, etc.)
- **Prisma integration** for database operations with clear schema organization

## Root Structure

```
/
├── prisma/
|   └── schema/
│       └── schema.prisma  # Prisma schema folder
├── src/                   # Application source code
│   ├── modules/           # Feature modules
│   └── utils/             # Shared utilities
├── uploads/               # File storage
├── .env.development       # Env for development (Optional Or .env)
├── .env.production        # Env for production (Or .env)
```

This approach keeps each model definition separate, making them easier to manage and maintain.

## Source Directory

The `/src` directory contains the application logic organized into modules:

```
/src/
├── modules/
│   ├── auth/                           # Authentication module
│   │   ├── dtos/                       # Class Validator Dtos
│   │   ├── schemas/                    # Zod schemas
│   │   └── utils/                      # Auth utilities
│   └── model-name/                     # Prisma Model module
│       ├── model-name.auth-configs.ts
│       ├── model-name.middlewares.ts
│       ├── model-name.prisma-query-options.ts
│       ├── model-name.service.ts
│       ├── model-name.service.ts
│       ├── schemas/
│       ├── dtos/
|       └── utils/         # some model utils
├── utils/
│    └── prisma.ts         # Prisma Instance
├── app.ts
```

:::tip
Under the `src/modules` folder you can create model-name-in-kebab folders in order to customize and harness **Arkos** built-in features.
:::

## Special File Types

The framework uses consistent naming conventions for special-purpose files:

### Middleware Files (\*.middlewares.ts)

Contain request processing logic that executes before or after arkos built-in controllers.

```typescript
// src/modules/user/user.middlewares.ts
import { ArkosRequest, ArkosResponse, ArkosNextFunction } from "arkos";

export const beforeCreateOne = catchAsync(
  async (req: ArkosRequest, res: ArkosResponse, next: ArkosNextFunction) => {
    // Validation logic
    next();
  }
);
```

### Authentication Configuration (\*.auth-configs.ts)

Define authentication strategies and requirements for generated api endpoints.

```ts
// src/modules/post/post.auth-configs.ts
import { AuthConfigs } from "arkos/auth";

const postAuthConfigs: AuthConfigs = {
  authenticationControl: {
    view: false, // Public endpoint
  },
  accessControl: {
    create: ["author", "admin"],
    update: ["author", "admin"],
    delete: ["admin"],
  },
};

export default postAuthConfigs;
```

### Prisma Query Options (\*.prisma-query-options.ts)

Configure reusable Prisma query parameters.

```ts
// src/modules/user/user.prisma-query-options.ts
import { Prisma } from "@prisma/client";
import { PrismaQueryOptions } from "arkos/prisma";

const userPrismaQueryOptions: PrismaQueryOptions<Prisma.UserDelegate> = {
  findOne: {
    include: {
      profile: true,
      orders: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  },
};

export default userPrismaQueryOptions;
```

### Data Transfer Objects (dtos/\*.dto.ts)

Define data validation using class-validator for input processing.

```typescript
// src/modules/post/dtos/create-post.dto.ts
export default class CreatePostDto {
  // Your fields here
}
```

### Schemas (schemas/\*.schema.ts)

Define validation rules using Zod for request data.

```ts
// src/modules/post/schemas/create-post.schema.ts
import { z } from "zod";

const CreatePostSchema = z.object({
  // Your fields here
});

export default CreatePostSchema;
```

## Uploads Directory

The `/uploads` directory stores application uploaded files:

```
/uploads/
├── documents/            # Document files (PDF, DOC, etc.)
├── images/               # Image files
├── videos/               # Video files
└── Other files
```

## Environment Configuration

The project uses separate environment files for different deployment scenarios:

```
/.env.development         # Development environment variables
/.env.production          # Production environment variables
/.env.staging             # Staging environment variables
/.env
/.env.local
```

:::info
Other common .env patterns will be added soon. you can even open an issue for a specific one or may become a contributor on [Github](https://github.com/Uanela/arkos).
:::

## Best Practices

1. **Module Organization**: Create new modules for distinct prisma model
2. **File Naming**: Follow the established naming conventions for special files
3. **DTOs vs Schemas**: Both approach are supported choose according to your application requirements.
4. **Middleware Usage**: Route-specific middleware to intercept request on generated api routes should be defined in model-name.middlewares.ts files
5. **Utility Functions**: Shared helpers should go in the /utils directory, module-specific helpers in the module's utils folder

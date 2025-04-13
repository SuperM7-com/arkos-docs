---
sidebar_position: 12
---

# Customizing Prisma Models Routers

Arkos automatically generates RESTful API endpoints for all your Prisma models. However, you might need to customize these endpoints for specific business requirements. This guide explains how to configure, disable, or extend the built-in Prisma model routers.

## Router Configuration

The Prisma model router configuration allows you to customize how endpoints are generated for each model. You can configure nested routes, disable specific endpoints, or completely replace them with custom implementations.

### Configuration File

For each Prisma model you want to customize, create a router configuration file:

```typescript
// src/modules/post/post.router.ts
import { PrismaModelRouterConfig } from "arkos";
import { Router } from "express";

// Export the configuration with the exact naming convention: modelNameRouterConfig
export const postRouterConfig: PrismaModelRouterConfig = {
  // Configuration options here
};

// If you need custom implementations, export a router as default
const router = Router();
// Custom implementations here...
export default router;
```

:::danger Important naming conventions
The router configuration **must** be exported as `modelNameRouterConfig` (camelCase) and your custom router **must** be exported as the default export. If these naming conventions aren't followed, Arkos won't recognize your customizations.
:::

### Disabling Endpoints

You can disable specific endpoints or an entire model's router:

```typescript
// src/modules/post/post.router.ts
import { PrismaModelRouterConfig } from "arkos";

export const postRouterConfig: PrismaModelRouterConfig = {
  // Disable all endpoints for this model
  disable: true,

  // Or disable specific endpoints
  disable: {
    createMany: true,
    deleteMany: true,
  },
};

// Export an empty router if you're disabling all endpoints
export default Router();
```

When `disable: true` is set, Arkos will not generate any of the following endpoints:

- `POST /api/posts`
- `GET /api/posts/:id`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/many`
- `GET /api/posts`
- `PATCH /api/posts/many`
- `DELETE /api/posts/many`

### Nested Routes

Arkos can generate nested routes for related models, making it easier to work with relationships:

```typescript
// src/modules/post/post.router.ts
import { PrismaModelRouterConfig } from "arkos";

export const postRouterConfig: PrismaModelRouterConfig = {
  parent: {
    model: "author",
    // Optional: specify the foreign key field if different from 'authorId'
    referenceField: "authorId",
    // Optional: specify which endpoints to generate
    endpoints: "*", // Generate all endpoints
  },
};

export default Router(); // Empty router if you're not customizing implementations
```

This configuration will generate nested routes like:

- `GET /api/authors/:id/posts`
- `GET /api/authors/:id/posts/:id`
- `POST /api/authors/:id/posts`
- `PATCH /api/authors/:id/posts/:id`
- `DELETE /api/authors/:id/posts/:id`
- `POST /api/authors/:id/posts/many`
- `PATCH /api/authors/:id/posts/many`
- `DELETE /api/authors/:id/posts/many`

You can also specify which nested endpoints to generate:

```typescript
// src/modules/post/post.router.ts
import { Router } from "express";
import { PrismaModelRouterConfig } from "arkos";

export const postRouterConfig: PrismaModelRouterConfig = {
  parent: {
    model: "author",
    // Only generate these specific nested endpoints
    endpoints: ["findMany", "findOne", "createOne"],
  },
};

export default Router();
```

## Custom Router Endpoints Implementation

For more complex customization, you can create a completely custom router endpoints implementation:

:::danger
By writing your own custom router endpoint implementation you will lose built-in things like authentication and access control (must implement on your own) and interceptor middlewares also.
:::

Based on what was stated on the warning above you may want check the following guides, that will help you customize and add your business logic without losing **Arkos** built-in features:

### Recommended Alternatives

- [Interceptor Middlewares Guide](/docs/core-concepts/interceptor-middlewares)
- [Overriding Default Controller Handler](/docs/api-reference/the-base-controller-class#overriding-default-handlers)
- [Extending BaseService with Custom Services](/docs/api-reference/the-base-service-class#extending-baseservice-with-custom-services)

```typescript
// src/modules/post/post.router.ts
import { Router } from "express";
import { PrismaModelRouterConfig } from "arkos";
import { prisma } from "../../utils/prisma";

// Export configuration first
export const postRouterConfig: PrismaModelRouterConfig = {
  // No need to disable endpoints you're overriding - Arkos will use your implementation
};

// Create your custom router
const router: Router = Router();

// Custom implementation for GET /api/posts
router.get("/api/posts", async (req, res) => {
  // Custom handling logic
  const posts = await prisma.post.findMany({
    // Custom query options
    include: {
      author: true,
      comments: true,
    },
  });

  res.json(posts);
});

// Export the custom router as default
export default router;
```

When you provide a custom implementation for an endpoint (like `/api/posts`), Arkos will automatically use your implementation instead of generating its own for the given endpoint. There's no need to explicitly disable the auto-generated endpoint.

:::tip Understanding router override behavior
When you provide a custom route implementation for an endpoint, Arkos automatically prioritizes your implementation over its auto-generated one endpoint. You don't need to disable endpoints that you're overriding with custom implementations.
:::

## Selective Endpoint Overriding

You can selectively override specific endpoints while keeping the auto-generated behavior for others:

```typescript
// src/modules/post/post.router.ts
import { Router } from "express";
import { PrismaModelRouterConfig } from "arkos";
import { prisma } from "../../utils/prisma";

// Export configuration first for clarity
export const postRouterConfig: PrismaModelRouterConfig = {
  // No need to disable the endpoint you're implementing below
};

const router: Router = Router();

// Only override the list endpoint with custom logic
router.get("/api/posts", async (req, res) => {
  // Custom implementation for listing posts
  const publishedPosts = await prisma.post.findMany({
    where: { published: true },
  });

  res.json(publishedPosts);
});

// Export the router as default
export default router;
```

## Advanced Example: Comprehensive Router Customization

Here's a more comprehensive example showing various customization techniques:

```typescript
// src/modules/post/post.router.ts
import { Router } from "express";
import { PrismaModelRouterConfig } from "arkos";
import { prisma } from "../../utils/prisma";
import { authenticate } from "../../middlewares/auth";

// Export configuration first
export const postRouterConfig: PrismaModelRouterConfig = {
  // Configure nested routes under authors
  parent: {
    model: "author",
    // Only generate these nested endpoints
    endpoints: ["findMany", "findOne"],
  },
  // No need to disable endpoints you're implementing below
};

const router: Router = Router();

// Custom GET implementation with authentication
router.get("/api/posts", authenticate, async (req, res) => {
  const { userId } = req.user;

  const posts = await prisma.post.findMany({
    where: {
      OR: [{ authorId: userId }, { published: true }],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.json(posts);
});

// Custom nested route implementation
router.get("/api/authors/:authorId/featured-posts", async (req, res) => {
  const { authorId } = req.params;

  const featuredPosts = await prisma.post.findMany({
    where: {
      authorId,
      featured: true,
    },
  });

  res.json(featuredPosts);
});

// Export router as default
export default router;
```

## Configuration Type Reference

Here's the complete type definition for `PrismaModelRouterConfig`:

```typescript
export type AvailableEndpoints =
  | "createOne"
  | "findOne"
  | "updateOne"
  | "deleteOne"
  | "findMany"
  | "createMany"
  | "updateMany"
  | "deleteMany";

export type PrismaModelRouterConfig = {
  parent?: {
    // Parent model name in kebab-case and singular
    model?: string;

    // Field that stores the parent ID relation (defaults to `${modelName}Id`)
    referenceField?: string;

    // Which nested endpoints to generate
    endpoints?: "*" | AvailableEndpoints | AvailableEndpoints[];
  };

  // Disable specific endpoints or all endpoints
  disable?:
    | boolean
    | {
        createOne?: boolean;
        findOne?: boolean;
        updateOne?: boolean;
        deleteOne?: boolean;
        createMany?: boolean;
        findMany?: boolean;
        updateMany?: boolean;
        deleteMany?: boolean;
      };
};
```

## Best Practices

1. **Start Simple**: Begin with the auto-generated endpoints and only customize when necessary. See more about [Arkos's auto-generated endpoints](#nested-routes) above.

2. **Modular Approach**: Keep router customizations in their respective model modules to maintain a clean project structure.

3. **Reuse Middleware**: Create reusable middleware for common operations across multiple routes to avoid code duplication.

4. **Document Custom Behavior**: Add comments to explain custom implementation details, especially for complex business logic.

5. **Consistent Naming**: Follow the established naming conventions (like `modelNameRouterConfig`) to ensure Arkos recognizes your customizations.

By following these patterns and guidelines, you can effectively customize Arkos's generated routers to fit your specific application needs.

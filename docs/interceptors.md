---
sidebar_position: 6
---

# Interceptors & Middleware

Arkos provides a simple interceptor system that allows you to modify requests and responses at various points in the request lifecycle.

## Basic Structure

Create interceptors in your module's middleware file:

```typescript
// src/modules/post/post.middlewares.ts
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "arkos/error-handler";

export const beforeCreateOne = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Your logic here
    next();
  }
);

export const afterCreateOne = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Your logic here
    next();
  }
);
```

## Available Interceptor Points

For each model, you can intercept:

```typescript
// Before operations
export const beforeCreateOne = catchAsync(async (req, res, next) => {});
export const beforeUpdateOne = catchAsync(async (req, res, next) => {});
export const beforeDeleteOne = catchAsync(async (req, res, next) => {});
export const beforeFindOne = catchAsync(async (req, res, next) => {});
export const beforeFindMany = catchAsync(async (req, res, next) => {});

// After operations
export const afterCreateOne = catchAsync(async (req, res, next) => {});
export const afterUpdateOne = catchAsync(async (req, res, next) => {});
export const afterDeleteOne = catchAsync(async (req, res, next) => {});
export const afterFindOne = catchAsync(async (req, res, next) => {});
export const afterFindMany = catchAsync(async (req, res, next) => {});
```

## Common Use Cases

### Adding User Context

```typescript
// src/modules/post/post.middlewares.ts
export const beforeCreateOne = catchAsync(async (req, res, next) => {
  // Add user ID from JWT token
  req.body.authorId = req.user.id;
  next();
});
```

### Modifying Response Data

```typescript
export const afterFindMany = catchAsync(async (req, res, next) => {
  // Add computed field to each item
  res.locals.data = res.locals.data.map((item) => ({
    ...item,
    computedField: someComputation(item),
  }));
  next();
});
```

### Validation and Authorization

```typescript
export const beforeUpdateOne = catchAsync(async (req, res, next) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
  });

  if (post.authorId !== req.user.id) {
    throw new AppError("Not authorized to update this post", 403);
  }

  next();
});
```

## Error Handling

Arkos provides a `catchAsync` utility to handle errors in interceptors:

```typescript
import { catchAsync } from "arkos/error-handler";
import { AppError } from "arkos/error-handler";

export const beforeCreateOne = catchAsync(async (req, res, next) => {
  if (someCondition) {
    throw new AppError("Custom error message", 400);
  }
  next();
});
```

## Best Practices

1. **Use TypeScript**: Leverage type safety for request and response objects
2. **Keep it Simple**: Each interceptor should have a single responsibility
3. **Error Handling**: Always use `catchAsync` and proper error objects
4. **Performance**: Be mindful of expensive operations in interceptors

## Examples

### Complete Post Module Example

```typescript
// src/modules/post/post.middlewares.ts
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "arkos/error-handler";
import { prisma } from "../../utils/prisma";
import { AppError } from "arkos/error-handler";

// Before Create
export const beforeCreateOne = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Add author
    req.body.authorId = req.user.id;

    // Check for duplicate titles
    const existing = await prisma.post.findFirst({
      where: { title: req.body.title },
    });

    if (existing) {
      throw new AppError("A post with this title already exists", 400);
    }

    next();
  }
);

// After Create
export const afterCreateOne = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Send notification
    await sendNotification({
      type: "new_post",
      postId: res.locals.data.id,
    });

    next();
  }
);

// Before Update
export const beforeUpdateOne = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== req.user.id) {
      throw new AppError("Not authorized to update this post", 403);
    }

    next();
  }
);

// After Find Many
export const afterFindMany = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Add computed fields
    res.locals.data = res.locals.data.map((post) => ({
      ...post,
      readingTime: calculateReadingTime(post.content),
    }));

    next();
  }
);
```

## Next Steps

- [Error Handling](./error-handling.md) - Learn about error handling
- [Validation](./validation.md) - Implement data validation

---
sidebar_position: 7
---

# Error Handling

Arkos provides a simple error handling system that helps you manage and respond to errors consistently across your application.

## Built-in Error Handler

Arkos comes with a built-in error handler that catches and formats errors appropriately:

```typescript
import { AppError } from "arkos/error-handler";
import { catchAsync } from "arkos/error-handler";

// Using catchAsync for async functions
export const someAsyncFunction = catchAsync(async (req, res, next) => {
  if (someCondition) {
    throw new AppError("Something went wrong", 400);
  }
  // ... rest of your code
});

// Using AppError directly
if (someCondition) {
  throw new AppError("Invalid input", 400);
}
```

## Error Types

### AppError Class

The `AppError` class is the base error class in Arkos:

```typescript
import { AppError } from "arkos/error-handler";

// Basic usage
throw new AppError("Error message", 400);

// With additional details
throw new AppError("Error message", 400, {
  field: "email",
  code: "INVALID_FORMAT",
});
```

## Error Response Format

Arkos formats all errors consistently:

```json
{
  "status": "error",
  "message": "Error message",
  "code": 400,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Best Practices

1. **Use AppError**: Always extend from AppError for custom errors
2. **Consistent Status Codes**: Use standard HTTP status codes
3. **Meaningful Messages**: Provide clear error messages
4. **Security**: Don't expose sensitive information in errors

## Examples

### Complete Error Handling Example

```typescript
// src/modules/user/user.controller.ts
import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "arkos/error-handler";
import { prisma } from "../../utils/prisma";

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.isActive) {
      throw new AppError("User account is deactivated", 403);
    }

    res.json({
      status: "success",
      data: user,
    });
  }
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new AppError("Email already exists", 400);
      }
      throw error;
    }
  }
);
```

## Next Steps

- [Validation](./validation) - Learn about data validation
- [Interceptors](./interceptors) - Use middleware and interceptors

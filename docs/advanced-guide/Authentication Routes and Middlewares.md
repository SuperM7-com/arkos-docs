# Authentication Routes and Middlewares

## Overview

Arkos provides a comprehensive Built-in Auth System with pre-defined routes and a powerful middleware interceptor mechanism that allows for extensive customization of authentication processes.

## Available Authentication Routes

### User Profile Management

| Route       | Method | Description                     |
| ----------- | ------ | ------------------------------- |
| `/users/me` | GET    | Retrieve current user's profile |
| `/users/me` | PATCH  | Update current user's profile   |
| `/users/me` | DELETE | Delete current user's account   |

### Authentication Endpoints

| Route                   | Method | Description          |
| ----------------------- | ------ | -------------------- |
| `/auth/login`           | POST   | User authentication  |
| `/auth/logout`          | DELETE | End user session     |
| `/auth/signup`          | POST   | User registration    |
| `/auth/update-password` | POST   | Change user password |

## Interceptor Middlewares

### What are Interceptor Middlewares?

Interceptor middlewares provide hooks to customize the authentication flow. They allow you to:

- Add custom logic before or after authentication operations
- Modify request or response data
- Implement additional security checks
- Log authentication events
- Perform side operations during authentication processes

### Types of Interceptor Middlewares

For each authentication route, you can create two types of middlewares:

1. **Before Middlewares**: Execute before the main handler
2. **After Middlewares**: Execute after the main handler

### Middleware Examples

#### Creating Interceptor Middlewares

```typescript
// src/modules/auth/auth.middlewares.ts
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "arkos/error-handler";

// Before Login Middleware
export const beforeLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Custom pre-login logic
    // Example: Additional validation, logging, or request modification
    console.log("Login attempt:", req.body.username);

    // Optional: Additional checks
    if (someCondition) {
      throw new AppError("Custom login validation failed", 400);
    }

    next();
  }
);

// After Login Middleware
export const afterLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Custom post-login logic
    // Example: Log successful login, trigger additional actions
    await logLoginEvent(req.user);

    next();
  }
);
```

### Available Interceptor Middleware Types

- `beforeLogin`
- `afterLogin`
- `beforeSignup`
- `afterSignup`
- `beforeLogout`
- `afterLogout`
- `beforeUpdatePassword`
- `afterUpdatePassword`
- `beforeGetMe`
- `afterGetMe`

### Middleware Placement

Place your middleware files in the following structure:

```
my-arkos-project/
└── src/
    └── modules/
        └── auth/
            └── auth.middlewares.ts
```

### Middleware Execution Flow

1. Arkos checks for a `before` middleware
2. Executes the main handler if no `before` middleware or if `next()` is called
3. Checks for an `after` middleware
4. Sends the response

### Best Practices

- Always use `catchAsync` to handle async operations
- Use `AppError` for custom error handling
- Keep middlewares focused and performant
- Avoid heavy processing in middlewares

## Customization Capabilities

The interceptor middleware system allows you to:

- Add custom validation
- Implement additional logging
- Modify request or response data
- Perform side operations
- Extend authentication logic without modifying core system

:::tip
Interceptor middlewares provide a flexible way to customize authentication processes while maintaining the core security and functionality of the Arkos Auth System.
:::

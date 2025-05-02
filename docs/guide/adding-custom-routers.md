---
sidebar_position: 4
---

# Adding Custom Routers

Arkos provides powerful built-in routers that handle common API functionalities, but there are often cases when you need to create custom routers for specific business logic or unique features. This guide walks you through creating and implementing custom routers in your Arkos application.

## Introduction

Custom routers in Arkos allow you to define specific API endpoints that may not fit into the auto-generated model endpoints pattern. They're perfect for:

- Complex business logic operations
- Cross-model operations that don't map to a single Prisma model
- Custom authentication flows
- Specialized API endpoints with unique requirements

**Important note:** Unlike auto-generated Prisma model routers, custom routers **do not** automatically include:

- Authentication checks
- Access control
- Request validation
- Error handling

This guide will show you how to add these features manually when needed.

## Basic Custom Router

Let's start with a simple custom router:

```typescript
// src/routers/product-stats.router.ts
import { Router } from "express";
import productStatsController from "../controllers/product-stats.controller";

// Create a new router instance
const productStatsRouter = Router();

// Define routes
productStatsRouter.get(
  "/api/products-stats",
  productStatsController.getProductStats
);
productStatsRouter.get(
  "api/admin/top-sellers",
  productStatsController.getTopSellingProducts
);

// Export the router
export default productStatsRouter;
```

:::danger
See that even though these routers are to be added in **Arkos** they will not be prefixed with `/api` automatically.
:::

:::warning important
Note that even though **Arkos** requires file and folder name conventions is some scenarios, those does not apply here when defining custom routers unless you want to modify some auto generated endpoint created by **Arkos** for your prisma models, for more details about this see [`Customizing Prisma Models Routers Guide`](/docs/advanced-guide/customizing-prisma-models-routers).
:::

## Registering Custom Routers

To add your custom router to Arkos:

```typescript
// src/app.ts
import arkos from "arkos";
import productStatsRouter from "./routers/product-stats.router";
import adminRouter from "./routers/admin.router";

arkos.init({
  routers: {
    // Add your custom routers here
    additional: [productStatsRouter, adminRouter],
  },
  // other configs
});
```

**Important:** Custom routers will be added after all built-in Arkos routers in the middleware stack. They will not overwrite any built-in routes. If you need to replace or disable built-in routers, see the [Modifying Built-in Routers Guide](/docs/api-reference/built-in-routers#modifying-built-in-routers).

## Adding Request Validation

Arkos provides built-in validation through either Zod or class-validator. To use this in your custom routers:

1. First, make sure validation is enabled in your Arkos config:

```typescript
// src/app.ts
import arkos from "arkos";

arkos.init({
  validation: {
    resolver: "zod", // or "class-validator"
    // other validation options...
  },
  // other configs
});
```

2. Create your validation schema or DTO:

For details on creating validation schemas and DTOs, refer to the [Request Data Validation Guide](/docs/core-concepts/request-data-validation).

3. Add validation to your router:

```typescript
// src/routers/order.router.ts
import { Router } from "express";
import { handleRequestBodyValidationAndTransformation } from "arkos/middlewares";
import orderController from "../controllers/order.controller";
import { CreateOrderSchema } from "../validations/create-order.schema";

const orderRouter = Router();

// Use validation middleware before your controller
orderRouter.post(
  "/",
  handleRequestBodyValidationAndTransformation(CreateOrderSchema),
  orderController.createOrder
);

export default orderRouter;
```

**Important:** Make sure the validation schema type matches your `validation.resolver` configuration. Don't pass a Zod schema when using class-validator or vice versa.

## Adding Authentication to Custom Routers

### Static RBAC Authentication

For Static RBAC (config-based) authentication:

```typescript
// src/routers/admin.router.ts
import { Router } from "express";
import { authService } from "arkos/services";
import adminController from "../controllers/admin.controller";

const adminRouter = Router();

// Define authentication configs for Static RBAC
const authConfigs = {
  accessControl: {
    View: ["Admin", "Manager"],
    Create: ["Admin"],
    Update: ["Admin"],
    Delete: ["Admin"],
  },
};

// Protected admin route with access control
adminRouter.get(
  "/dashboard",
  authService.authenticate,
  authService.handleAccessControl(
    "View",
    "admin-dashboard" // resource name
    authConfigs.accessControl,
  ),
  adminController.getDashboardData
);

export default adminRouter;
```

:::danger
When wanting to add `authService.handleAccessControl` remember to call `authService.authenticate` before so that the user gets first authenticated by **Arkos** so that the user will be added to `req.user` for `handleAccessControl` to use it.
:::

### Dynamic RBAC Authentication

For Dynamic RBAC (database-based) authentication:

```typescript
// src/routers/report.router.ts
import { Router } from "express";
import { authService } from "arkos/services";
import reportController from "../controllers/report.controller";

const reportRouter = Router();

// Dynamic RBAC relies on database permissions
// You only need to specify the action and resource name
reportRouter.post(
  "/generate",
  authService.authenticate,
  authService.handleAccessControl(
    "GenerateReport", // custom action
    "report" // resource name
  ),
  reportController.generateReport
);

export default reportRouter;
```

In Dynamic RBAC mode, the permissions are checked against the database rather than config files. The `resource` and `action` parameters are used to look up the corresponding permission in the database.

### Custom

```ts
import { authService } from "arkos/services";
import invoiceController from "../controllers/invoice.controller";

const invoiceRouter = Router();

// Static RBAC with custom actions
const authConfigs = {
  accessControl: {
    View: ["Accountant", "Admin"],
    Create: ["Accountant", "Admin"],
    GeneratePdf: ["Accountant", "Admin"],
    SendEmail: ["Admin"],
  },
};

// Custom action: generate PDF
invoiceRouter.get(
  "/:id/pdf",
  authService.authenticate,
  authService.handleAccessControl(
    "GeneratePdf", // custom action
    "invoice",
    authConfigs.accessControl
  ),
  invoiceController.generateInvoicePdf
);

// Custom action: send email
invoiceRouter.post(
  "/:id/send",
  authService.authenticate,
  authService.handleAccessControl(
    "SendEmail", // custom action
    "invoice",
    authConfigs.accessControl
  ),
  invoiceController.sendInvoiceEmail
);

export default invoiceRouter;
```

When using Dynamic RBAC, make sure to add these custom actions to your `AuthPermissionAction` enum in your Prisma schema:

```prisma
enum AuthPermissionAction {
  View
  Create
  Update
  Delete
  GeneratePdf  // custom action
  SendEmail    // custom action
}
```

## Complex Router Example

Here's a more comprehensive example combining validation and authentication:

```typescript
// src/routers/analytics.router.ts
import { Router } from "express";
import { authService } from "arkos/services";
import { handleRequestBodyValidationAndTransformation } from "arkos/middlewares";
import analyticsController from "../controllers/analytics.controller";
import { GenerateReportSchema } from "../validations/analytics.schema";

const analyticsRouter = Router();

// Static RBAC configs
const authConfigs = {
  accessControl: {
    View: ["analyst", "Admin"],
    ExportData: ["Admin"],
    GenerateReport: ["analyst", "Admin"],
  },
};

// View analytics dashboard
analyticsRouter.get(
  "/dashboard",
  authService.authenticate,
  authService.handleAccessControl(
    "View",
    "analytics",
    authConfigs.accessControl
  ),
  analyticsController.getDashboard
);

// Generate custom report with validation
analyticsRouter.post(
  "/reports",
  authService.authenticate,
  authService.handleAccessControl(
    "GenerateReport", // action
    "analytics", // route resource name
    authConfigs.accessControl
  ),
  handleRequestBodyValidationAndTransformation(GenerateReportSchema),
  analyticsController.generateReport
);

// Export data (admin only)
analyticsRouter.get(
  "/export",
  authService.authenticate,
  authService.handleAccessControl(
    "ExportData",
    "analytics",
    authConfigs.accessControl
  ),
  analyticsController.exportData
);

export default analyticsRouter;
```

## Route Parameters and Query Handling

You can define routes with parameters and handle query parameters as usual with Express:

```typescript
// src/routers/product.router.ts
import { Router } from "express";
import productController from "../controllers/product.controller";

const productRouter = Router();

// Route with parameters
productRouter.get("/api/:id/reviews", productController.getProductReviews);

// Route with query parameters
productRouter.get("/api/search", productController.searchProducts);

export default productRouter;
```

## Best Practices

When creating custom routers:

1. **Organize by Feature**: Group related endpoints in the same router
2. **Keep Controllers Thin**: Move business logic to separate service classes
3. **Always Add Validation**: Validate request data to prevent security issues and bugs
4. **Secure Routes Properly**: Apply authentication and access control checks as needed
5. **Use Descriptive Names**: Choose clear, descriptive route and action names
6. **Document APIs**: Add comments or use tools like Swagger for API documentation
7. **Consider Error Handling**: Wrap controller methods with error handling where needed

## Authentication Types Reference

When using `authService.handleAccessControl`, understand these key types:

```typescript
/**
 * Base set of controller actions available to all controllers.
 *
 * @example
 * const action: AccessAction = "Create";
 * const customAction: AccessAction = "Export"; // Custom action
 */
export type AccessAction = "Create" | "Update" | "Delete" | "View" | string;

/**
 * Rules defining access control for different controller actions.
 * The array contains role names that are allowed to perform the action.
 *
 * @example
 * const rules: AccessControlRules = {
 *   Create: ["Admin", "Manager"],
 *   Update: ["Admin"],
 *   Delete: ["Admin"],
 *   View: ["Admin", "User", "Guest"]
 * };
 */
export type AccessControlRules = {
  [key in AccessAction]: string[];
};

/**
 * Configuration for access control.
 *
 * @example
 * // All actions allowed for these roles
 * const config1: AccessControlConfig = ["Admin", "Manager"];
 *
 * // Specific rules per action
 * const config2: AccessControlConfig = {
 *   Create: ["Admin"],
 *   View: ["User", "Admin"]
 * };
 */
export type AccessControlConfig = string[] | Partial<AccessControlRules>;
```

You can also read more about the `authService` object itself on [clicking here](/docs/api-reference/auth-service-object)

## Built-in Routers for Reference

For reference, Arkos provides these built-in routers:

- **Welcome Endpoint Router**: A simple welcome endpoint
- **File Uploader Router**: Handles file uploads, serving static files, and file deletion
- **Authentication Router**: Provides authentication endpoints for user management
- **Prisma Models Router**: Automatically generates RESTful API endpoints for all your Prisma models
- **Available Resources & Routes Router**: Provides endpoints to discover available API resources and routes

For more details on built-in routers, see the [Built-in Routers Guide](/docs/api-reference/built-in-routers).

## Next Steps

- Learn about [Built-in Middlewares](/docs/guide/built-in-middlewares)
- Explore the [Authentication System](/docs/core-concepts/built-in-authentication-system)
- Read about [Request Data Validation](/docs/core-concepts/request-data-validation)
- Discover [Static RBAC Authentication](/docs/advanced-guide/static-rbac-authentication)
- Learn about [Dynamic RBAC Authentication](/docs/advanced-guide/dynamic-rbac-authentication)

---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Customizing Prisma Query Options

## How Arkos Generates API Routes

Arkos automatically generates a complete RESTful API for each model defined in your Prisma schema, eliminating the need to manually create routes, controllers, and services. Let's look at how this powerful feature works behind the scenes.

### 1. Core Concepts

The auto-generation process happens through several key components:

1. **Reading Prisma Schema**: Arkos analyzes your Prisma models to understand your data structure, including fields and relationships
2. **Route Generation**: Creates standardized REST endpoints for each model
3. **Controller Logic**: Implements standard CRUD operations that follow best practices
4. **Middleware Support**: Allows for customization at various points in the request lifecycle
5. **Authentication & Authorization**: Integrates security controls automatically

### 2. The Generation Pipeline

In the following steps we can see how Arkos generates these endpoints, for each model in your Prisma schema:

1. Arkos converts the model name to kebab-case (e.g., `UserProfile` becomes `user-profile`, `OrderItem` - `order-item`, `User` - `user`).
2. It loads any custom modules you've defined for that model under `src/modules/{model-name-in-kebab-and-singular}`.
3. It pluralizes the model name for RESTful route naming (e.g., `user-profile` becomes `user-profiles`).
4. It uses the `handlerFactory` to create controller functions for all CRUD operations.

### 3. Generated Endpoints

For each model, Arkos creates the following endpoints :

:::tip
Arkos converts the model names to kebab-case and to plural e.g UserProfile to user-profiles, user to users. The pluralization of the model names happens only on the api endpoints.
:::

| HTTP Method | Endpoint                 | Description                                       |
| ----------- | ------------------------ | ------------------------------------------------- |
| GET         | `/api/{model-name}`      | List all records with filtering, pagination, etc. |
| POST        | `/api/{model-name}`      | Create a single record                            |
| GET         | `/api/{model-name}/:id`  | Retrieve a specific record by ID                  |
| PATCH       | `/api/{model-name}/:id`  | Update a specific record                          |
| DELETE      | `/api/{model-name}/:id`  | Delete a specific record                          |
| POST        | `/api/{model-name}/many` | Create multiple records                           |
| PATCH       | `/api/{model-name}/many` | Update multiple records based on filter           |
| DELETE      | `/api/{model-name}/many` | Delete multiple records based on filter           |

### 4. Custom Prisma Query Options

The `prismaQueryOptions` configuration allows you to customize how Prisma queries are executed by arkos:

```ts
// src/modules/user/user.prisma-query-options.ts
import { Prisma } from "@prisma/client";
import { PrismaQueryOptions } from "arkos/prisma";

const userPrismaQueryOptions: PrismaQueryOptions<Prisma.UserDelegate> = {
  queryOptions: {
    // Used to manage custom prisma query options across all operations
    include: {
      password: false,
      passwordChangedAt: false,
      passwordResetOtp: false,
      passwordResetOtpExpiresAt: false,
      verificationOtp: false,
      verificationOptExpiresAt: false,
      isVerified: false,
      deletedSelfAccount: false,
      active: false,
      phones: true,
      roles: {
        select: {
          role: {
            select: { id: true, name: true },
          },
        },
      },
    } as any,
  },
  findMany: {
    // Only applies for findMany operations, it will be merged with the queryOptions above
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      // Excluded sensitive data, etc.
    },
  },
  createOne: {
    // Only on createOne operations
    include: {
      postsLiked: true,
    },
  },
};

export default userPrismaQueryOptions;
```

This way you Arkos renforces one of it's biggest strength which is abstraction but still allowing the developer to customize basically everything he wants.

## Behind the Scenes: The BaseService Class

Arkos uses a powerful `BaseService` class to handle operations across all models:

```typescript
export class BaseService {
  // Class implementation...

  async createOne(
    body: Record<string, any>,
    queryOptions: string = "{}"
  ): Promise<any> {
    // Handle validation if enabled
    if (modelModules.dtos.create && getInitConfigs()?.validation !== false) {
      body = await validateDto(modelModules.dtos.create, body);
    }

    // Handle password hashing for users
    if (kebabCase(this.modelName) === "user" && body.password)
      body.password = await authService.hashPassword(body.password);

    // Handle relationships automatically
    const bodyWithRelationFieldsHandled = handleRelationFieldsInBody(
      body,
      { ...this.relationFields },
      ["delete", "disconnect", "update"]
    );

    // Execute Prisma query with all options merged
    return await prisma[this.modelName].create(/* ... */);
  }

  // Other methods...
}
```

This class intelligently:

- Validates incoming data against your DTOs
- Handles Prisma relationships automatically
- Manages special cases like password hashing
- Applies your custom query options

## The Controller Factory

The `handlerFactory` function creates standardized controllers that:

1. Pass request data to the appropriate service method
2. Handle response formatting consistently
3. Manage error handling through the `catchAsync` wrapper
4. Support middleware hooks for customization

```typescript
export async function handlerFactory(modelName: string, modelModules: any) {
  const baseService = new BaseService(modelName);
  // Create controller methods for all operations...

  return {
    createOne: catchAsync(async (req, res, next) => {
      // Controller implementation...
    }),
    // Other controller methods...
  };
}
```

## Handling Query Parameters in Prisma Requests

**Arkos** handles the query parameters of Express requests for the developers, providing built-in things like

- **Filtering**
- **Searching** \*only for string fields.
- **Sorting**
- **Pagination** - with limit of results also.
- **Fields Selection**

The `APIFeatures` class is an internal utility designed by in **Arkos** to parse and transform query parameters from an incoming HTTP request into a structured Prisma query object. This allows the developer to dynamically apply filters, sorting, pagination, field selection, and search functionality when querying the database.

---

### How It Works

[See More](/docs/advanced-guide/request-query-parameters)

When an HTTP request is made with query parameters, `APIFeatures` processes those parameters and constructs a Prisma query. The class does **not** execute the query itself but provides a structured query object (`filters`) that can be used with Prisma’s `findMany()` method.

### **Processing Steps**

1. **Initialize the Class**

   - The constructor receives:
     - The `req` object (containing query parameters).
     - The `modelName` (representing the Prisma model being queried).
     - (Optional) `relationFields` to include related models.
   - The query parameters are parsed using `parseQueryParamsWithModifiers`.

2. **Filtering (`filter()`)**

   - Extracts all valid filter parameters and applies them using Prisma’s `where` clause.
   - Supports logical filters like `gte`, `lte`, `gt`, `lt`.
   - Supports custom `filterMode` (defaulting to `OR`).

3. **Search (`search()`)**

   - If a `search` parameter exists, the method identifies string fields in the model and applies an `OR` condition using `contains` (case-insensitive).

4. **Sorting (`sort()`)**

   - Parses the `sort` parameter and constructs an `orderBy` clause.
   - Supports descending (`-field`) and ascending (`field`) sorting.

5. **Field Selection (`limitFields()`)**

   - Handles field selection through `fields`, `addFields`, and `removeFields`.
   - Ensures conflicts (e.g., using `fields` and `addFields` together) throw an error.

6. **Pagination (`paginate()`)**

   - Uses `page` and `limit` parameters to determine `skip` and `take` values.
   - Defaults to `page=1` and `limit=30` if not provided.

7. **Executing the Query (`exec()`)**
   - Returns the final structured query to be executed with `Prisma.findMany()`.

---

## **Example Query Handling**

### **Request URL**

```
GET /api/items?page=2&limit=10&sort=-createdAt&search=phone&fields=name,price
```

### **Transformed Prisma Query**

```json
{
  "where": {
    "OR": [
      { "name": { "contains": "phone", "mode": "insensitive" } },
      { "description": { "contains": "phone", "mode": "insensitive" } }
    ]
  },
  "orderBy": [{ "createdAt": "desc" }],
  "select": { "name": true, "price": true },
  "skip": 10,
  "take": 10
}
```

This allows us to dynamically filter, search, and paginate data while keeping our API flexible and efficient.

## Summary

Arkos's auto-generation system provides:

1. **Zero-configuration API**: Get a complete REST API with just your Prisma schema
2. **Consistent patterns**: All endpoints follow the same design patterns and best practices
3. **Flexible customization**: Middleware, auth configs, and DTOs let you customize any aspect
4. **Relationship handling**: Automatic handling of complex Prisma relationships
5. **Performance optimized**: Built-in pagination, filtering, and field selection

By understanding how Arkos generates these APIs, you can leverage its full power while customizing only the parts that need special behavior for your application.

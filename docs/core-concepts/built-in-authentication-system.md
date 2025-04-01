---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Built-in Authentication System

## How To Setup And Use Arkos Built-in Auth System

**Arkos** uses the world standard and first most used auth system AKA JWT authentication in conjunction with the `RBAC (Role-Based Access Control)`, allowing you to customize whether you want the JWT through `secure cookie only`, `send as response in JSON`, or `both approaches`. As stated all over **Arkos** documentation and basically over anything you can find about it, **Arkos** aims to simplify developers' lives by providing tools to write less code yet not taking the show and art of pure software development.

With this said, **Arkos** allows you to choose between two types of **RBAC (Role-Based Access Control)**:

1. **Static RBAC (Config-Based)**: This approach defines roles and permissions in code or configuration files. It is ideal for applications with well-defined access control rules that do not require frequent updates. Since roles are predefined and assigned manually, changes require code modifications or configuration updates.

2. **Dynamic RBAC (Database-Level)**: This approach stores roles and permissions in the database, allowing dynamic updates at runtime. Roles can be assigned or changed as needed, enabling greater flexibility. This method is commonly used in large-scale applications where access control needs to evolve dynamically. In some implementations, Dynamic RBAC can be extended with **Attribute-Based Access Control (ABAC)**, where roles and permissions are influenced by user attributes, conditions, or context.

Both **Static RBAC** and **Dynamic RBAC** are fully supported in **Arkos**. However, **the Attribute-Based Access Control (ABAC) extension within Dynamic RBAC is not yet implemented**. **Arkos** is an `open-source project and welcomes developer contributions` to bring support for ABAC integration. If you are interested in contributing, check out the [Arkos repository](https://github.com/superm7/arkos) and join the community discussions to help shape this feature.

## Activating Authentication With Default Behavior

```ts
// src/app.ts
import arkos from "arkos";

arkos.init({
  authentication: true,
});
```

:::tip
Read more about to understand how the whole Arkos Built-in Auth System.
:::

## How It Works

In order to use the Built-in Auth System in **Arkos** there are some things that you must setup and those things differs slightly between the both approaches (Static RBAC and Dynamic RBAC), below you have an overview in form of key points to setup and use the Built-in Auth System. Or if you want, you can also dive directly to a full detail documentation on how to set this up in your project using the Static RBAC approach [Clicking Here](/docs/advanced-guide/static-rbac-authentication).

1. **User Model Required Fields**: To use **Arkos** Built-in Auth System you must define a Userl model and it must contain some required fields and as stated before they differ sligthly when using Static RBAC and Dynamic RBAC, [see more](/docs/advanced-guide/implementing-built-in-auth-system#defining-the-user-model).
2. **User Roles**: The `role` or `roles` fields in the **User** model can be a string, list of strings, enums in Static RBAC or a `UserRole` model when using Dynamic RBAC, representing a single role (e.g., `admin`) or multiple roles (e.g., `admin`, `editor`), [see more](/docs/advanced-guide/static-rbac-authentication#role-userrole).
3. **Auth Config**: For handling the RBAC properly you must setup some auth configuration, in Static RBAC those are made through static files in your code ([see here](/docs/advanced-guide/static-rbac-authentication#using-auth-config-to-customize-endpoint-behavior)). While in Dynamic RBAC these auth configs are made in database models such as `AuthRole`, `AuthPermission` and `UserRole` which you can you will see how to setup and use them by [clicking here](/docs/advanced-guide/implementing-built-in-auth-system#models-required-for-dynamic-rbac).

## Features Provided by Arkos Built-in Auth System

By default, **Arkos Built-in Auth System** provides various authentication and authorization features, including:

**1. Login -** Users can authenticate themselves using their credentials to access the system.

**2.Logout -** Users can securely end their session and log out from the system.

**3. Signup -** New users can register an account in the system.

**4. User Profile Manipulation-** Users can update their profile details, such as name, email, and other personal information.

**5. Update Password -** Users can change their passwords for security purposes.

**6. Access Control -** Arkos will automatically handle resources access control whether in Static RBAC (trough your configs) or Dynamic RBAC (database permissions).

## Pre-Defined Authentication Routes

Arkos Built-in Auth System provides pre-defined routes and a powerful middleware interceptor mechanism that allows for extensive customization of authentication processes.

### User Profile Management

| Route           | Method | Description                     |
| --------------- | ------ | ------------------------------- |
| `/api/users/me` | GET    | Retrieve current user's profile |
| `/api/users/me` | PATCH  | Update current user's profile   |
| `/api/users/me` | DELETE | Delete current user's account   |

### Authentication Endpoints

| Route                       | Method | Description          |
| --------------------------- | ------ | -------------------- |
| `/api/auth/login`           | POST   | User authentication  |
| `/api/auth/logout`          | DELETE | End user session     |
| `/api/auth/signup`          | POST   | User registration    |
| `/api/auth/update-password` | POST   | Change user password |

### Roles And Permissions Manipulation (Dynamic RBAC Only)

| Route                   | Operations | Description              |
| ----------------------- | ---------- | ------------------------ |
| `/api/auth-roles`       | CRUD       | Roles Manipulation       |
| `/api/auth-permissions` | CRUD       | Permissions Manipulation |
| `/api/user-roles`       | CRUD       | User Roles Manipulation  |

You can explore on how these auth route endpoints works [clicking here](/docs/advanced-guide/authentication-route-endpoints).

:::info
In the beggining **Arkos** was implemenented with features like `Forgot Password`, `Reset Password`, `Email Verification` all of those was made through sending emails with otp verification code, but was later removed so that the framework could be `Less Opinionated`, and also not all applications will use email verification although the majority will, hence arkos provides `Built-in Email Service` so that developer can setup the same thing with easy.

By the way you can find a code snippet where these things are implemeted using `Arkos Built-in Auth System` together with `Arkos Built-in Email Service`, if you want to use them. [`Got To Repository`](https://github.com/superm7/arkos).

In future maybe it be added again or made available through some npm packages from **Arkos** because this is very helpfull feature, but it is all up to the community and remember you can one of those who can vote to it to come back by opening an issue [`Community`](https://github.com/uanela/arkos/issues).
:::

---

## 1. Static RBAC (Config-Based)

Arkos offers a **Static RBAC (Config-Based)** system, ideal for predefined roles and permissions where access control is managed through configuration files. It’s a simple yet flexible approach for setting up authentication and role-based access in your application.

### Key Concepts

- **Roles & Permissions**: Users can be assigned one or more roles (strings or enums) within the User model through the `role` field for single role or `roles` for multiple roles. Each role determines what actions the user is allowed to perform.
- **Model-Specific Auth Config**: Each model can have its own access control and authentication configuration, allowing granular control over which actions require authentication and which roles can perform them.

### How It Works

1. **User Model Required Fields**: To use **Arkos** Built-in Auth System (ABAS) you must define a Userl model and it must contain some required fields, [see more](/docs/advanced-guide/how-to-setup-and-use-static-rbac#defining-user-the-model).
2. **User Roles**: The `role` or `roles` fields in the **User** model can be a string or an enum, representing a single role (e.g., `admin`) or multiple roles (e.g., `admin`, `editor`).
3. **Auth Config Files**: Each model can have a custom authentication configuration file. This file defines which actions require authentication and which roles can perform them, [see more](/docs/advanced-guide/static-rbac-authentication#creating-an-auth-config-for-a-post-model).

### Setting Up Authentication Mode To Static

```ts
// src/app.ts
import arkos from "arkos";

arkos.init({
  authentication: {
    mode: "static", // default behavior
  },
});
```

### When to Use Static RBAC:

Static RBAC is perfect for applications with a well-defined set of roles that don’t change often. It’s ideal for systems where access control is based on preconfigured roles and permissions, offering simplicity and clarity in managing authentication.

### More Information

For further details on how to setup and use RBAC in Arkos, check out the [Here](/docs/advanced-guide/static-rbac-authentication).

---

## 2. Dynamic RBAC (Database-Level)

Arkos also provides a way of defining Dynamic RBAC on Database-Level so that you can provide the ability to add new roles and assign them permissions and than assign those roles to users in your applications, this approach is more used on large-scale application where roles can vary and suffer updates constantly to suite the business changes, such as new employers, new departaments and anything else where requires there to be an given user or set of user that must only do some specific things on the system.

Having this in mind **Arkos** provides this out-of-box because at end of day most of these Dynamic RBAC System are implemented in the same way and also you once again **Arkos** aims to faithful to his mission allowing developers to focus on what really matters, the `Customer Business Logic`.

In Arkos, dynamic RBAC is centered around four key entities:

- **AuthRole**: Defines a role in the system.
- **AuthPermission**: Represents specific actions that can be granted to roles.
- **UserRole**: Establishes a many-to-many relationship between users and auth roles and these are the ones that the users can be assigned.
- **User**: Represents the system user who is assigned roles dynamically.

:::info
Unlike static role-based access control (RBAC), where roles and permissions are predefined and fixed, **Dynamic RBAC** allows roles and permissions to be modified at runtime. This approach provides greater flexibility, enabling permission adjustments based on changing requirements without redeploying the system.
:::

### How It Works

With dynamic RBAC, roles and permissions are stored in the database and can be modified through an admin panel or API. This means new roles can be created, permissions adjusted, and user access updated in real time without requiring code changes.

### Changing Authentication Mode To Dynamic

```ts
// src/app.ts
import arkos from "arkos";

arkos.init({
  authentication: {
    mode: "dynamic",
  },
});
```

### Example Of Dynamic RBAC Prisma Models

```ts
model AuthRole {
  id          String   @id @default(uuid())
  name        String   @unique
  permissions AuthPermission[]
  users       UserRole[]
}

// This enum options must be in lower-case as Arkos expects
enum AuthPermissionAction {
  view
  create
  update
  delete
}

model AuthPermission {
  id        String               @id @default(uuid())
  resource  String // Database models name in kebabCase
  action    AuthPermissionAction @default(view) // When using sqlite these can be plain String
  roles     AuthRole[]
  @@unique([resource, action, roleId])
}

model UserRole {
  id      String    @id @default(uuid())
  userId  String
  user    User      @relation(fields: [userId], references: [id])
  roleId  String
  role    AuthRole  @relation(fields: [roleId], references: [id])
  @@unique([userId, roleId])
}

model User {
  id                 String    @id @default(uuid())
  username           String    @unique
  password           String
  passwordChangedAt  DateTime?
  isSuperUser        Boolean   @default(false)
  deletedSelfAccount Boolean   @default(false)
  active             Boolean   @default(true)
  roles              UserRole[] // Can be changed to role and UserRole to single role.
}
```

:::tip
Bear in mind that you can change this to single role based authentication by modifying the `roles` field in user to `role` and the `UserRole[]` to `UserRole` if want to each user have a single role.
:::

### Benefits

- **Assigning roles dynamically**: Users can be assigned multiple roles, which allows fine-grained control over access.
- **Updating permissions on-the-fly**: Roles can have their permissions updated without requiring application restarts.
- **Checking access at runtime**: The system checks user roles and permissions dynamically when evaluating access requests.

This approach provides a more scalable and maintainable solution compared to static RBAC, ensuring that access control remains flexible as the system evolves.

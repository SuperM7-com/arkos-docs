---
sidebar_position: 3
title: Static Authentication
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# `Static` RBAC Authentication

**Arkos** offers a **Static RBAC (Config-Based)** system, ideal for predefined roles and permissions where access control is managed through configuration files. It’s a simple yet flexible approach for setting up authentication and role-based access in your application.

### Key Concepts

- **Roles & Permissions**: Users can be assigned one or more roles (strings or enums) within the User model through the `role` field for single role or `roles` for multiple roles. Each role determines what actions the user is allowed to perform.
- **Model-Specific Auth Config**: Each model can have its own access control and authentication configuration, allowing granular control over which actions require authentication and which roles can perform them.

### How It Works

1. **User Model Required Fields**: To use **Arkos** Built-in Auth System (ABAS) you must define a Userl model and it must contain some required fields, [see here](/docs/advanced-guide/static-rbac-authentication#defining-the-user-model-for-static-authentication).
2. **User Roles**: The `role` or `roles` fields in the **User** model can be a string or an enum, representing a single role (e.g., `admin`) or multiple roles (e.g., `admin`, `editor`).
3. **Auth Config Files**: Each model can have a custom authentication configuration file. This file defines which actions require authentication and which roles can perform them.

## Setting Up Authentication Mode To Static

```ts
// src/app.ts
import arkos from "arkos";

arkos.init({
  authentication: {
    mode: "dynamic",
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      cookie: {
        secure: process.env.JWT_COOKIE_SECURE === "true",
        httpOnly: process.env.JWT_COOKIE_HTTP_ONLY !== "false",
        sameSite:
          (process.env.JWT_COOKIE_SAME_SITE as "lax" | "strict" | "none") ||
          undefined,
      },
    },
  },
});
```

:::tip
You can pass these values directly in your configuration, but it's a best practice to use environment variables. Arkos will automatically pick up the environment variables even without explicit configuration.
:::

### JWT Configuration Options

You can pass these options in your configuration (they override environment variables if both are set):

| Option            | Description                                                      | Env Variable           | Default                          |
| ----------------- | ---------------------------------------------------------------- | ---------------------- | -------------------------------- |
| `secret`          | The key used to sign and verify JWT tokens. **Required in prod** | `JWT_SECRET`           | —                                |
| `expiresIn`       | How long the JWT token stays valid (e.g., `'30d'`, `'1h'`)       | `JWT_EXPIRES_IN`       | `'30d'`                          |
| `cookie.secure`   | If `true`, the cookie is only sent over HTTPS                    | `JWT_COOKIE_SECURE`    | `true` in production             |
| `cookie.httpOnly` | If `true`, prevents JavaScript access to the cookie              | `JWT_COOKIE_HTTP_ONLY` | `true`                           |
| `cookie.sameSite` | Controls the SameSite attribute of the cookie                    | `JWT_COOKIE_SAME_SITE` | `"lax"` in dev, `"none"` in prod |

## Using Env Variables Instead

```ts
// src/app.ts
import arkos from "arkos";

arkos.init({
  authentication: {
    mode: "dynamic",
  },
});
```

```env
JWT_SECRET=my-jwt-secret
JWT_EXPIRES_IN=30d
JWT_COOKIE_SECURE=true
JWT_COOKIE_HTTP_ONLY=true
JWT_COOKIE_SAME_SITE=none
```

:::danger
Only activate authentication after defining your user model and at least create one user with `isSuperUser` set to `true`, because **Arkos** by default will required authentication for all endpoints routes and only allowing super users to operate unless you define it using auth configs mentioned above.
:::

### Defining The User Model For Static Authentication

As stated before, to use the **Arkos Built-in Auth System** in Static RBAC mode you must defined a User model with some pre-defined and required fields in order for it work.

```ts
enum UserRole { // Change to your own roles
  admin
  user
}

model User {
  id                    String    @id @default(uuid())
  username              String    @unique
  password              String
  passwordChangedAt     DateTime?
  lastLoginAt           DateTime?
  isSuperUser           Boolean   @default(false)
  isStaff               Boolean   @default(false)
  deletedSelfAccounAt   DateTime?
  isActive              Boolean   @default(true)
  role                  UserRole  @default(user)
  // add more user fields if needed
}
```

### Understanding The User Model

#### `id: String`

- Uses UUID generation for unique user identification
- `@id` marks it as the primary identifier
- `@default(uuid())` automatically generates a unique identifier
- Is up to the prisma provider use are using

#### `username: String`

- Serves as the primary login identifier
- `@unique` constraint ensures no duplicate usernames
- Flexible design allows customization to email, phone, or other identifiers. by passing usernameField in `arkos.init()` under authentication field.

```ts
// src/app.ts
import arkos from "arkos";

arkos.init({
  authentication: {
    mode: "static",
    usernameField: "email", // If wants to use User email field for
    // authentication or even on the fly by passing ?usernameField=phone
    // for example when POST /api/auth/login
    // other configs
  },
});
```

#### `password: String`

- Stores the user's authentication credential
- Is hashed by default with bcrypt (implicit for security reasons)
- Critical for user authentication process

#### `passwordChangedAt: DateTime?`

- Used to invalidated a JWT Token after user changes password
- Useful for:
  - Security audits
  - Forcing password resets
  - Tracking recent password modifications

#### `lastLoginAt: DateTime?`

- Optional timestamp tracking user's most recent login
- Allows tracking of user authentication events

#### `isSuperUser: Boolean`

- Provides a global override for access controls
- When `true`, grants full system access regardless of role
- Typically reserved for system administrators
- Default is `false` for standard security

#### `isStaff: Boolean`

- Is just a way to differantiate people who can acess admin area in your frontend as nothing to do with the backend
- When `true`, you can handle your frontend acess control
- `true` Typically reserved for staff people that can acess admin area

#### `deletedSelfAccounAt: DateTime`

- Tracks if a user has voluntarily deleted their account and when
- Provides soft account deletion mechanism
- Default is `null`

#### `isActive: Boolean`

- Determines overall account accessibility
- When `false`, completely prevents user from performing any API actions
- Provides an administrative disable mechanism
- Default is `true` for normal account operation

#### `role: UserRole`

- Defines user's permission level
- Uses an enum for predefined role categories or can be a string
- You can any role based on your application
- Supports potential expansion to multiple roles.

```ts
enum UserRole { // Change to your own roles
  admin
  user
}

model User {
  // other user fields
  roles               UserRole[]  @default(user)
  // more user fields
}
```

### Design Considerations

- Flexible authentication approach
- Comprehensive access control mechanisms
- Built-in security features
- Supports various authentication scenarios

### Potential Enhancements (Make On Your Own)

- Add last login timestamp
- Implement account lockout mechanisms
- Create detailed audit logging
- Support multi-factor authentication fields

:::tip
For the potential enhancements you can implement on your own into your applications as suggested above, or if you would like to see this inside **Arkos** just drop an issue explaining this or open an PR if you want to implement the code inside **Arkos**. [Github Issues](https://github.com/uanela/arkos/issues)
:::

Now that you have authentication and authorization all set up, you can explore the available auth route endpoints when using `Static RBAC` [here](/docs/core-concepts/built-in-authentication-system#pre-defined-authentication-routes). And also check about sending requests to these endpoints [here](/docs/authentication-system/sending-authentication-requests).

## Using Auth Config To Customize Endpoint Behavior

By default in **Static-RBAC Auth** **Arkos** will require authentication in all endpoints and will only allow the user with the field `isSuperUser` set to `true` be able to operate on the API, and in most of the scenarios will want to customize your endpoint access control using the role.

Hence **Arkos** provides a simple and intuitive way to customize access control through Static Role-Based Acess Control using `model-name.auth-configs.ts` files.

<Tabs>
<TabItem value="ts" label="TypeScript" default>

    ```ts
    // src/modules/post/post.auth-configs.ts
    import { AuthConfigs } from "arkos/auth";

    const postAuthConfigs: AuthConfigs = {
      authenticationControl: {
        view: false, // Public endpoint: no authentication required to view
        create: true, // Authenticated users can create posts (default behavior)
      },
      accessControl: {
        delete: ["admin"], // Only 'admin' role can delete a post
      },
    };

    export default postAuthConfigs;
    ```

  </TabItem>
  <TabItem value="js" label="JavaScript" >

    ```js
    // src/modules/post/post.auth-configs.ts
    const postAuthConfigs = {
      authenticationControl: {
        view: false, // Public endpoint: no authentication required to view
        create: true, // Authenticated users can create posts (default behavior)
      },
      accessControl: {
        delete: ["admin"], // Only 'admin' role can delete a post
      },
    };

    module.exports = postAuthConfigs;
    ```

</TabItem></Tabs>

### Explanation:

- **authenticationControl**: Specifies whether authentication is required for each action. For example, the `view` action is publicly accessible (no authentication required), while `create` requires authentication (this is the default behavior).
- **accessControl**: Defines which roles can perform specific actions. The `delete` action is restricted to users with the `admin` role. You can specify multiple roles, for example, `['admin', 'moderator']`, to grant permissions to more than one role.

### Benefits:

- **Single and Multiple Roles**: Static RBAC can handle both single roles (e.g., just `admin`) and multiple roles (e.g., `admin`, `moderator`, `editor`), providing flexibility in access control.
- **Simple Configuration**: No need for a complex setup—just configure the roles and permissions directly in the configuration files.
- **Customizable Access**: Define different authentication and access rules for each model in your application.

### When to Use Static RBAC:

Static RBAC is perfect for applications with a well-defined set of roles that don’t change often. It’s ideal for systems where access control is based on preconfigured roles and permissions, offering simplicity and clarity in managing authentication.

### Alternatives

See [Dynamic Role-Based Acess Control Authentication Guide](/docs/advanced-guide/dynamic-rbac-authentication).

Now you can start sending request to the authentication endpoints, read [Sending Authentication Requests Guide](/docs/authentication-system/sending-authentication-requests) to learn more.

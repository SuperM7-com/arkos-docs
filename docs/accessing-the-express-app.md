---
sidebar_position: 10
---

# Accessing The Express App

**Arkos** provides a streamlined API development experience while still giving you full access to the underlying Express.js application. This guide explains the various ways you can access and customize the Express app instance in your Arkos projects.

## Why Access the Express App?

While **Arkos** provides a robust set of built-in features, there are scenarios where you might need direct access to the Express app:

- Applying Express-specific configurations
- Using middleware that requires direct app registration
- Setting Express application properties
- Adding custom view engines
- Configuring specific Express settings not covered by Arkos's abstractions

## Methods for Accessing the Express App

### 1. Using the `configureApp` Hook

The most straightforward method to access the Express app is through the `configureApp` hook in your Arkos configuration:

```ts
// src/app.ts

import arkos from "arkos";
import helmet from "helmet";

arkos.init({
  configureApp: async (app) => {
    // Direct access to Express app before any Arkos middleware is applied
    app.set("trust proxy", true);
    app.use(helmet());

    // Set Express-specific properties
    app.locals.title = "My Arkos Application";
    app.set("view engine", "ejs");

    // Register early middleware
    app.use((req, res, next) => {
      // Custom middleware logic
      next();
    });
  },
  // Other Arkos configurations
});
```

The `configureApp` function runs before any Arkos middleware is applied, giving you a chance to set up configurations that need to be in place early in the application lifecycle.

:::warning
You do not need to call `app.listen` inside `configureApp` because this is function that gives you acess to add custom configurations beyond **Arkos** features on the top-level of the middleware/configuration stack. In the end everything will go down until **Arkos** call `app.listen`.
:::

As mentioned on the warning above, is not recommended to call `app.listen` inside `configureApp`. If you would like to call `app.listen` on your own, for example to add websockets see [Calling app.listen By Yourself Section](/docs/accessing-the-express-app#calling-applisten-by-yourself)

### 2. Through the Arkos Instance

You can also access the Express app through the Arkos instance after initialization:

```ts
// src/app.ts
import arkos from "arkos";

// Initialize Arkos
const app = await arkos.init({
  port: undefined, // so that Arkos won't call app.listen [recommended]
  // Arkos configurations
});

// Access the Express app instance

// Now you can use the Express app
app.set("view engine", "pug");
app.use("/special-route", specialMiddleware);
app.listen(8000, () => {
  console.info(`App running on port 8000`);
});
```

This approach is useful when you need to perform configurations after Arkos has been fully initialized but server not started yet.

## Timing Considerations

Understanding when your code executes in relation to the Arkos middleware stack is crucial:

1. **Using `configureApp`**: Code runs before any Arkos middleware is applied
2. **After `arkos.init()`**: Code runs after all Arkos configuration is complete

Here's a diagram of the execution order:

```
┌───────────────────────────────────────┐
│ Application Startup                   │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────┴───────────────────────┐
│ configureApp hook executes            │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────┴───────────────────────┐
│ Arkos built-in middlewares applied    │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────┴───────────────────────┐
│ Arkos additional middlewares applied  │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────┴───────────────────────┐
│ Arkos routes registered               │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────┴───────────────────────┐
│ arkos.init() completes                │
└───────────────┬───────────────────────┘
                │
                ▼
┌───────────────┴───────────────────────┐
│ Code after arkos.init() executes      │
└───────────────────────────────────────┘
```

## Common Use Cases

### Setting Up View Engines

```ts
arkos.init({
  configureApp: async (app) => {
    app.set("views", "./views");
    app.set("view engine", "ejs");

    // Register a template engine
    app.engine("html", require("ejs").renderFile);
  },
});
```

### Configuring Server-Sent Events (SSE)

```ts
arkos.init({
  configureApp: async (app) => {
    // Create an SSE endpoint
    app.get("/events", (req, res) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Send periodic updates
      const intervalId = setInterval(() => {
        res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`);
      }, 1000);

      // Clean up on connection close
      req.on("close", () => {
        clearInterval(intervalId);
      });
    });
  },
});
```

### Calling `app.listen` By Yourself

#### Adding WebSocket Support

```ts
// src/app.ts
import arkos from "arkos";
import { Server } from "socket.io";
import http from "http";

const startServer = async () => {
  // Initialize Arkos but don't let it start listening
  const app = await arkos.init({
    // Important: Prevent Arkos from automatically listening
    port: undefined,
    // Other Arkos configurations
  });

  // Create HTTP server with the Express app
  const server = http.createServer(app);

  // Attach Socket.IO to the same HTTP server
  const io = new Server(server);

  // Configure Socket.IO
  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("message", (data) => {
      io.emit("broadcast", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Start the server manually
  const port = process.env.PORT || 8000;
  server.listen(port, () => {
    console.log(`Server with Socket.IO listening on port ${port}`);
  });
};

startServer();
```

### Setting Express Trust Proxy

If your application runs behind a proxy like Nginx or is deployed to some cloud platforms:

```ts
arkos.init({
  configureApp: async (app) => {
    // Enable trust proxy for accurate IP detection behind proxy
    app.set("trust proxy", true);
  },
});
```

### Adding Custom Express Settings

```typescript
arkos.init({
  configureApp: async (app) => {
    // Increase the maximum request body size
    app.set("json limit", "50mb");

    // Set custom response headers for all routes
    app.use((req, res, next) => {
      res.setHeader("X-Powered-By", "Arkos");
      res.setHeader("X-Frame-Options", "DENY");
      next();
    });

    // Configure Express app properties
    app.locals.appName = "My Arkos App";
    app.locals.version = "1.0.0";
    app.locals.adminEmail = "admin@example.com";
  },
});
```

## Best Practices

1. **Early Configuration**: Use `configureApp` for settings that need to be applied before any middleware runs.

2. **Late Configuration**: Use post-initialization access for features that depend on Arkos's setup being complete.

3. **Avoid Conflicts**: Be careful not to override Arkos's core functionality when adding custom Express configurations.

4. **Maintain Middleware Order**: Be mindful of the order in which middleware is applied, as it can affect how requests are processed.

5. **Documentation**: Document any custom Express configurations to help with maintenance and onboarding.

## Advanced: Combining with Custom Middlewares

You can combine direct Express app access with custom middleware configuration:

```ts
import arkos from "arkos";
import morgan from "morgan";
import helmet from "helmet";

arkos.init({
  configureApp: async (app) => {
    // Early middleware (runs first)
    app.use(helmet());
  },
  middlewares: {
    // Middleware to be added after Arkos built-ins
    additional: [morgan("combined")],
    // Replace built-in middleware
    replace: {
      cors: customCorsMiddleware,
    },
  },
});
```

See [Modifying Built-in Middlewares](/docs/advanced-guide/modifying-built-in-middlewares) for advanced guide.

## Conclusion

Accessing the Express app in Arkos gives you the flexibility to extend and customize your application beyond the framework's built-in features. Whether you need to configure views, set up WebSockets, or apply Express-specific settings, Arkos provides multiple ways to work with the underlying Express instance while still benefiting from its streamlined API development experience.

Remember to consider the timing of your Express configurations relative to Arkos's initialization process to ensure your application behaves as expected.

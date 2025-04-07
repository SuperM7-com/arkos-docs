---
sidebar_position: 7
---

# The `EmailService` Class

This guide provides a detailed API reference for the `EmailService` class inside **Arkos**, which handles all email functionality in the system.

## Constructor

```ts
constructor(
  host?: string = process.env.EMAIL_HOST!,
  auth?: SMTPAuthOptions = {
    user: process.env.EMAIL_FROM!,
    pass: process.env.EMAIL_PASSWORD!,
  },
  port?: number = parseInt(process.env.EMAIL_PORT || "465")
)
```

Creates a new instance of the `EmailService` class.

### Parameters

- `host` (string, optional): The SMTP host server address. Defaults to `EMAIL_HOST` environment variable.
- `auth` (SMTPAuthOptions, optional): Authentication credentials. Defaults to `EMAIL_FROM` and `EMAIL_PASSWORD` environment variables.
- `port` (number, optional): The SMTP port. Defaults to `EMAIL_PORT` environment variable or 465 if not set.

### Example

```ts
// Create with default environment values
const defaultEmailService = new EmailService();

// Create with custom values
const customEmailService = new EmailService(
  "smtp.custom-provider.com",
  { user: "custom@example.com", pass: "customPassword" },
  587
);
```

## Methods

### `send()`

```ts
public async send(
  options: EmailOptions,
  connectionOptions?: SMTPConnectionOptions
): Promise<{ success: boolean; messageId?: string; error?: any }>
```

Sends an email with the provided options using either the default configuration or custom connection settings.

#### Parameters

- `options` (EmailOptions): The email content and recipient information.
- `connectionOptions` (SMTPConnectionOptions, optional): Custom connection settings for this specific email.

#### Returns

A Promise that resolves to an object containing:

- `success` (boolean): Whether the email was sent successfully.
- `messageId` (string, optional): The message ID if successful.
- `error` (any, optional): Error information if unsuccessful.

#### Throws

- Error: If the email sending process fails.

:::tip
Knowing that it throws an error when `send()` is better to catch your errors when sending emails that does not need to make the user await, for example, e-commerce order confirmation you can process and then send the email inside custom with `then().catch()` so that you do not wait for the email to be sent.
:::

#### Example

```ts
// Send with default configuration
await emailService.send({
  to: "user@example.com",
  subject: "Welcome",
  html: "<p>Welcome to our service!</p>",
});

// Send with temporary different credentials
await emailService.send(
  {
    to: "client@example.com",
    subject: "Invoice",
    html: "<p>Your invoice is ready</p>",
  },
  {
    auth: { user: "billing@example.com", pass: "billingPass" },
  }
);
```

### Sending with Different Authentication

You can send an email using different credentials without changing the default configuration:

```typescript
await emailService.send(
  {
    to: "client@example.com",
    subject: "Your Invoice",
    html: "<p>Please find your invoice attached.</p>",
  },
  {
    auth: {
      user: "billing@yourcompany.com",
      pass: "billingPassword",
    },
    host: "smtp.yourcompany.com", // Optional custom SMTP server
  }
);
```

### `verifyConnection()`

```ts
public async verifyConnection(transporterToVerify?: Transporter): Promise<boolean>
```

Verifies the connection to the email server.

#### Parameters

- `transporterToVerify` (Transporter, optional): A specific transporter to verify. If not provided, verifies the default transporter.

#### Returns

A Promise that resolves to:

- `true`: If connection is successful.
- `false`: If connection fails.

#### Example

> The connection is automatically verified before sending, but you can also manually verify it:

```ts
// On some async function
const isConnected = await emailService.verifyConnection();

if (isConnected) {
  console.log("SMTP connection is working correctly");
} else {
  console.log("SMTP connection failed - please check your credentials");
}
```

### `updateDefaultConfig()`

```ts
public updateDefaultConfig(options: SMTPConnectionOptions): void
```

Updates the default configuration for the email service.

#### Parameters

- `options` (SMTPConnectionOptions): The new connection options.

#### Example

```ts
emailService.updateDefaultConfig({
  auth: { user: "new@example.com", pass: "newPassword" },
  host: "smtp.newprovider.com",
  port: 587,
});
```

### `static create()`

```ts
public static create(options: SMTPConnectionOptions): EmailService
```

Creates a new instance of EmailService with custom configuration.

#### Parameters

- `options` (SMTPConnectionOptions): The connection options for the new instance.

#### Returns

A new `EmailService` instance.

#### Example

```ts
const marketingEmails = EmailService.create({
  auth: { user: "marketing@example.com", pass: "marketingPass" },
  host: "smtp.marketing-provider.com",
});
```

### Multiple Email Service Instances

For applications that regularly send emails from different accounts:

```typescript
import { EmailService } from "arkos/services";

const marketingEmails = EmailService.create({
  auth: { user: "marketing@example.com", pass: "marketingPass" },
});

const supportEmails = EmailService.create({
  auth: { user: "support@example.com", pass: "supportPass" },
});

// Now you can use them independently
await marketingEmails.send({
  to: "customer@example.com",
  subject: "New Products Available",
  html: "<p>Check out our new products!</p>",
});

await supportEmails.send({
  to: "customer@example.com",
  subject: "Your Support Ticket",
  html: "<p>Your issue has been resolved.</p>",
});
```

## Type Definitions

### EmailOptions

```ts
type EmailOptions = {
  from?: string; // Sender's email address (optional)
  to: string | string[]; // Recipient(s) email address
  subject: string; // Subject of the email
  text?: string; // Plain text body (optional)
  html: string; // HTML body
};
```

Defines the options for sending an email.

### SMTPAuthOptions

```ts
type SMTPAuthOptions = {
  user: string; // Username or email address
  pass: string; // Password
};
```

Defines the authentication options for SMTP.

### SMTPConnectionOptions

```ts
type SMTPConnectionOptions = {
  host?: string; // SMTP host server
  port?: number; // SMTP port
  secure?: boolean; // Whether to use SSL/TLS
  auth?: SMTPAuthOptions; // Authentication credentials
};
```

Defines the connection options for SMTP server.

## Error Handling

This example shows various ways to use the email service with `catchAsync` for error handling:

```ts
import { emailService, EmailService } from "arkos/services";
import { ArkosRequest, ArkosResponse, ArkosNextFunction } from "arkos";
import { catchAsync } from "arkos/error-handler";

// Example: this is not a built-in middleware
const demonstrateEmailService = catchAsync(
  async (req: ArkosRequest, res: ArkosResponse, next: ArkosNextFunction) => {
    // 1. Send with default configuration
    await emailService.send({
      to: "user@example.com",
      subject: "Welcome",
      html: "<p>Welcome to our service!</p>",
    });

    // 2. Send with temporary different credentials
    await emailService.send(
      {
        to: "client@example.com",
        subject: "Invoice",
        html: "<p>Your invoice is ready</p>",
      },
      {
        auth: { user: "billing@example.com", pass: "billingPass" },
      }
    );

    // 3. Update default config
    emailService.updateDefaultConfig({
      auth: { user: "notifications@example.com", pass: "notifyPass" },
    });

    // 4. Send with new default config
    await emailService.send({
      to: "member@example.com",
      subject: "Notification",
      html: "<p>You have a new notification</p>",
    });

    // 5. Create a dedicated instance
    const marketingEmailer = EmailService.create({
      auth: { user: "marketing@example.com", pass: "marketingPass" },
      host: "smtp.marketing-server.com",
    });

    // 6. Use the dedicated instance
    await marketingEmailer.send({
      to: "prospect@example.com",
      subject: "Special Offer",
      html: "<p>Check out our new products!</p>",
    });
  }
);
```

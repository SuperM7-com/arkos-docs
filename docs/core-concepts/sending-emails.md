---
sidebar_position: 5
---

# Sending Emails

**Arkos** provides an powerful EmailService class that provides a robust and flexible solution for handling email-related tasks in your application with a simple, unified API.

The `EmailService` is built on top of Node.js's `nodemailer` library, providing a streamlined interface while maintaining flexibility. Key features include:

- Simple, unified API with a single versatile `send` method
- Support for both default and custom authentication in the same call
- HTML to plain text conversion
- Connection verification
- Easy configuration updates
- Multiple instance support

> You can read more about nodemailer itself [https://www.npmjs.com/package/nodemailer](https://www.npmjs.com/package/nodemailer)

## Configuration

### Environment Variables

The `EmailService` uses these environment variables for its default configuration:

```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=465
EMAIL_FROM=your-email@example.com
EMAIL_PASSWORD=your-password
```

## Basic Usage

### Sending an Email with Default Configuration

```ts
// src/modules/auth/auth.middlewares.ts
import { emailService } from "arkos/services";
import { ArkosRequest, ArkosResponse, ArkosNextFunction } from "arkos";
import { catchAsync } from "arkos/error-handler";

export const afterSignup = catchAsync(
  async (req: ArkosRequest, res: ArkosResponse, next: ArkosNextFunction) => {
    const result = await emailService.send({
      to: "recipient@example.com",
      subject: "Welcome to Our Platform",
      html: "<h1>Welcome!</h1><p>Thank you for registering.</p>",
    });

    console.log(`Email sent successfully! Message ID: ${result.messageId}`);

    next();
  }
);
```

### Email Options

```typescript
type EmailOptions = {
  from?: string; // Optional: Overrides the default sender
  to: string | string[]; // Single recipient or array of recipients
  subject: string; // Email subject line
  text?: string; // Optional: Plain text version
  html: string; // HTML content of the email
};
```

## Advanced Usage

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

### Updating Default Configuration

If you need to permanently switch to a different email account:

```typescript
emailService.updateDefaultConfig({
  auth: { user: "new@example.com", pass: "newPassword" },
  host: "smtp.newprovider.com", // Optional
  port: 587, // Optional
  secure: true, // Optional
});
```

## Connection Verification

The connection is automatically verified before sending, but you can also manually verify it:

```ts
// On some async function
const isConnected = await emailService.verifyConnection();

if (isConnected) {
  console.log("SMTP connection is working correctly");
} else {
  console.log("SMTP connection failed - please check your credentials");
}
```

## Best Practices

1. **Use Templates**: Instead of inline HTML, use template engines like Handlebars or EJS.

2. **Handle Errors**: Always use `catchAsync` when sending emails during requests or try/catch blocks for other scenarios. see [catchAsync Function Guide](/docs/api-reference/the-catch-async-function).

3. **Security**: Never hardcode email credentials in your code.

4. **Rate Limiting**: Implement rate limiting for bulk emails to prevent IP blacklisting.

5. **Testing**: Create a mock transporter for testing without sending real emails.

## Diving Deeper

For more in depth understanding of the `EmailService` class see [The EmailService Class API Reference](/docs/api-reference/the-email-service-class)

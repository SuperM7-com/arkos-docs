---
sidebar_position: 40
---

# File Upload

Arkos provides a simple file upload system for handling files in your application. This guide will show you how to handle file uploads.

## Basic File Upload

To enable file upload in your model, add a file field:

```typescript
// prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  name      String
  avatar    String?  // Will store the file path
  // ... other fields
}
```

The file upload endpoint will be automatically generated:

```typescript
// POST /api/users/upload-avatar/:id
// Multipart form data with 'file' field
```

## File Storage Structure

By default, files are stored in the following directory structure:

```
uploads/
└── files/
```

## Example Usage

Here's a complete example of file upload with a React frontend:

```typescript
// Frontend code
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/users/upload-avatar/123", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.filePath; // Returns the path to the uploaded file
};
```

## Troubleshooting

Common issues and solutions:

1. **File too large**

   - Check your server's upload limits
   - Adjust your server's configuration

2. **Invalid file type**

   - Verify the file extension
   - Check supported formats

3. **Storage errors**
   - Ensure proper write permissions
   - Check storage directory exists

## Next Steps

- [Validation](./validation.md) - Learn about data validation
- [Interceptors](./interceptors.md) - Customize request handling

---
sidebar_position: 5
---

# Data Validation

Arkos provides data validation through class-validator/class-transformer. This guide covers how to implement validation in your application.

## Enabling Validation

Enable validation in your app initialization:

```typescript
// src/app.ts
import arkos from "arkos";
import express from "express";

const app = express();

arkos.init(app);
```

## Using Class Validator

### Installation

```bash
npm install class-validator class-transformer
```

### Basic Usage

Create DTOs (Data Transfer Objects) in your module's `dtos` directory:

```typescript
// src/modules/user/dtos/create-user.dto.ts
import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

### Complex Validation

Example with nested objects and arrays:

```typescript
// src/modules/product/dtos/create-product.dto.ts
import {
  IsString,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";

class PriceDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;
}

class VariantDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => VariantDto)
  variants: VariantDto[];
}
```

## Error Handling

Arkos automatically handles validation errors and returns them in a consistent format:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

## Best Practices

1. **Consistent Naming**: Use `.dto.ts` suffix for DTOs
2. **Type Safety**: Leverage TypeScript's type inference
3. **Reusable Validation**: Create shared validators for common patterns
4. **Clear Error Messages**: Provide helpful validation messages

## Examples

### User Registration

```typescript
// src/modules/auth/dtos/register.dto.ts
import { IsString, IsEmail, MinLength, Matches } from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: "Password is too weak",
    }
  )
  password: string;
}
```

## Next Steps

- [Interceptors](./interceptors.md) - Learn about request/response modification
- [Error Handling](./error-handling.md) - Custom error handling

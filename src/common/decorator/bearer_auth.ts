import { ApiBearerAuth as ApiBearerAuthSwagger, ApiOperation } from "@nestjs/swagger"
import { applyDecorators, UseGuards } from "@nestjs/common"
import { AuthGuard } from "src/middleware/AuthGuard.middleware"
import { ERole } from "../enum/ERole"

export function ApiBearerAuth(roles: ERole[] = []) {
  const decorators = [ApiBearerAuthSwagger(), UseGuards(new AuthGuard(roles))]
  decorators.push(ApiOperation({ summary: roles?.join(", ") || "ALL" }) as any)
  return applyDecorators(...decorators)
}

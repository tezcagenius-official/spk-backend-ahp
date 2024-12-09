import { Type, applyDecorators } from "@nestjs/common"
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger"

export function createFlexibleSchema<T>(type: new () => T) {
  class FlexibleSchema {
    @ApiProperty({ example: 200 })
    status: number

    @ApiProperty({ example: "ok" })
    message: string

    @ApiProperty({ type: () => type })
    data: T
  }

  return FlexibleSchema
}

export function createFlexibleSchemaArray<T>(type: new () => T) {
  class FlexibleSchemaArray {
    @ApiProperty({ example: 200 })
    status: number

    @ApiProperty({ example: "ok" })
    message: string

    @ApiProperty({ type: () => [type] })
    data: T[]
  }

  return FlexibleSchemaArray
}

export class StandartResponseArray<TData> {
  @ApiProperty({ example: 200 })
  status: number

  @ApiProperty({ example: "ok" })
  message: string

  data: TData[]
}

export class StandartResponse<TData> {
  @ApiProperty({ example: 200 })
  status: number

  @ApiProperty({ example: "ok" })
  message: string

  data: TData
}
export class StandartResponseUpdated<TData> {
  @ApiProperty({ example: 201 })
  status: number

  @ApiProperty({ example: "Updated" })
  message: string

  data: null
}
export class StandartResponseCreate<TData> {
  @ApiProperty({ example: 201 })
  status: number

  @ApiProperty({ example: "Created" })
  message: string

  data: TData
}
export class StandartResponseDelete<TData> {
  @ApiProperty({ example: 200 })
  status: number

  @ApiProperty({ example: "Deleted" })
  message: string

  data: null
}

// schema array
export const ApiStandartResponseArray = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(StandartResponseArray, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandartResponseArray) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(dataDto) },
              },
              // meta: {
              //   type: "object",
              //   properties: {
              //     total: { type: "number" },
              //     lastPage: { type: "number" },
              //     currentPage: { type: "number" },
              //     perPage: { type: "number" },
              //     prev: { type: "string" },
              //     next: { type: "string" },
              //   },
              // },
            },
          },
          {
            properties: {
              meta: {
                type: "object",
                properties: {
                  total: { type: "number" },
                  lastPage: { type: "number" },
                  currentPage: { type: "number" },
                  perPage: { type: "number" },
                  prev: { type: "string" },
                  next: { type: "string" },
                },
              },
            },
          },
        ],
      },
    })
  )

// schema standart
export const ApiStandartResponse = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(StandartResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandartResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    })
  )

// schema create
export const ApiStandartResponseCreate = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(StandartResponseCreate, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandartResponseCreate) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    })
  )

// schema update
export const ApiStandartResponseUpdated = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(StandartResponseUpdated, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandartResponseUpdated) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    })
  )

// schema delete
export const ApiStandartResponseDeleted = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  applyDecorators(
    ApiExtraModels(StandartResponseDelete, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandartResponseDelete) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    })
  )

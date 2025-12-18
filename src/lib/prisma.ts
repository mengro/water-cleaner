import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const dbDisabled = process.env.DISABLE_DB === '1' || !process.env.DATABASE_URL

function createModelProxy() {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'findMany') return async () => []
        if (prop === 'findUnique') return async () => null
        if (prop === 'findFirst') return async () => null
        if (prop === 'count') return async () => 0
        if (prop === 'aggregate') return async () => ({})
        if (prop === 'groupBy') return async () => []

        if (prop === 'create') return async () => null
        if (prop === 'update') return async () => null
        if (prop === 'delete') return async () => null
        if (prop === 'upsert') return async () => null
        if (prop === 'createMany') return async () => ({ count: 0 })
        if (prop === 'updateMany') return async () => ({ count: 0 })
        if (prop === 'deleteMany') return async () => ({ count: 0 })

        return undefined
      },
    },
  )
}

function createPrismaDisabledProxy() {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === '$connect') return async () => {}
        if (prop === '$disconnect') return async () => {}
        if (prop === '$transaction') return async (fn: any) => (typeof fn === 'function' ? fn({}) : [])
        if (prop === '$extends') return () => createPrismaDisabledProxy()

        if (typeof prop === 'string') {
          return createModelProxy()
        }

        return undefined
      },
    },
  )
}

export const prisma = dbDisabled
  ? (createPrismaDisabledProxy() as unknown as PrismaClient)
  : (globalForPrisma.prisma ?? new PrismaClient())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

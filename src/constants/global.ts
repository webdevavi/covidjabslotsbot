export const PROD = process.env.NODE_ENV === "production"
export const PORT = parseInt(process.env.PORT ?? "") ?? 2608

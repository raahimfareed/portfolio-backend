import { z } from "zod";

export const userSetupSchema = z.object({
    email: z
        .string()
        .max(127)
        .email(),
    password: z
        .string()
        .min(8)
})

export const userLoginSchema = z.object({
    email: z
        .string()
        .max(127)
        .email(),
    password: z
        .string()
})

import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().max(255),
    description: z.string(),
    url: z.string().max(255).optional(),
    image: z.string().max(255),
    techStack: z.array(z.string()).optional().default([])
})

export const updateProjectSchema = z.object({
    name: z.string().max(255).optional(),
    description: z.string().optional(),
    url: z.string().max(255).optional(),
    image: z.string().max(255).optional(),
    techStack: z.array(z.string()).optional()
}).refine((obj) => {
    for (const val of Object.values(obj)) {
        if (val !== undefined) return true;
    }
    return false;
}, {
    message: "At least one property is required"
});

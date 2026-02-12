import { z } from "zod";

export const registerSchema = z.object({
  tenantName: z.string().min(3, { message: "El nombre de la clínica debe tener al menos 3 caracteres." }),
  slug: z.string()
    .min(3, { message: "El slug debe tener al menos 3 caracteres." })
    .regex(/^[a-z0-9-]+$/, { message: "El slug solo puede contener letras minúsculas, números y guiones." }),
  email: z.string().email({ message: "El email no es válido." }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    // Optional: Add complexity requirements if desired.
    // .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número." })
    // .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula." })
    // .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula." })
});

export type RegisterInput = z.infer<typeof registerSchema>;

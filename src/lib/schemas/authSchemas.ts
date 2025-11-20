import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'validation.usernameMin').max(20, 'validation.usernameMax'),
  password: z.string().min(6, 'validation.passwordMin'),
});

export const signupSchema = z.object({
  username: z.string().min(3, 'validation.usernameMin').max(20, 'validation.usernameMax'),
  email: z.string().email('validation.emailInvalid'),
  password: z.string().min(6, 'validation.passwordMin'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'validation.passwordMismatch',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

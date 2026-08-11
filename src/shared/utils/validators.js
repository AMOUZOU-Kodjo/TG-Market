import { z } from "zod";

const phoneRegex = /^(\+?228)?[279]\d{7}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Le prénom est requis")
      .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
    lastName: z
      .string()
      .min(1, "Le nom est requis")
      .max(50, "Le nom ne peut pas dépasser 50 caractères"),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Email invalide"),
    phone: z
      .string()
      .min(1, "Le numéro de téléphone est requis")
      .regex(phoneRegex, "Numéro de téléphone invalide"),
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string().min(1, "Confirmez votre mot de passe"),
    city: z.string().min(1, "La ville est requise"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Vous devez accepter les conditions d'utilisation" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string().min(1, "Confirmez votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const createListingSchema = z.object({
  title: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(5000, "La description ne peut pas dépasser 5000 caractères"),
  price: z
    .number({ required_error: "Le prix est requis", invalid_type_error: "Le prix doit être un nombre" })
    .min(1, "Le prix doit être supérieur à 0")
    .max(100_000_000, "Le prix est trop élevé"),
  negotiable: z.boolean().default(false),
  category: z.string().min(1, "La catégorie est requise"),
  condition: z.enum(["new", "like_new", "good", "fair", "poor"], {
    errorMap: () => ({ message: "L'état est requis" }),
  }),
  city: z.string().min(1, "La ville est requise"),
  neighborhood: z
    .string()
    .max(100, "Le quartier ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
  images: z
    .array(z.string().url("URL d'image invalide"))
    .min(1, "Ajoutez au moins une image")
    .max(10, "Maximum 10 images"),
  brand: z
    .string()
    .max(50, "La marque ne peut pas dépasser 50 caractères")
    .optional()
    .or(z.literal("")),
  model: z
    .string()
    .max(50, "Le modèle ne peut pas dépasser 50 caractères")
    .optional()
    .or(z.literal("")),
  year: z
    .number()
    .int()
    .min(1900, "Année invalide")
    .max(new Date().getFullYear() + 1, "Année invalide")
    .optional()
    .nullable(),
});

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  phone: z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .regex(phoneRegex, "Numéro de téléphone invalide"),
  city: z.string().min(1, "La ville est requise"),
  neighborhood: z
    .string()
    .max(100, "Le quartier ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "La bio ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
  avatar: z.string().url("URL d'image invalide").optional().or(z.literal("")),
});

export const reviewSchema = z.object({
  rating: z
    .number({ invalid_type_error: "La note est requise" })
    .min(1, "La note minimale est 1")
    .max(5, "La note maximale est 5"),
  comment: z
    .string()
    .min(10, "Le commentaire doit contenir au moins 10 caractères")
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères"),
});

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Le message ne peut pas être vide")
    .max(5000, "Le message ne peut pas dépasser 5000 caractères"),
  listingId: z.string().optional(),
});

export const searchSchema = z.object({
  query: z
    .string()
    .max(200, "La recherche ne peut pas dépasser 200 caractères")
    .optional()
    .or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  minPrice: z
    .number()
    .min(0, "Le prix minimum ne peut pas être négatif")
    .optional()
    .nullable(),
  maxPrice: z
    .number()
    .min(0, "Le prix maximum ne peut pas être négatif")
    .optional()
    .nullable(),
  condition: z.string().optional().or(z.literal("")),
  sort: z.enum(["newest", "oldest", "price_asc", "price_desc", "popular"]).optional(),
});

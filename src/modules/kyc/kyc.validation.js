import { z } from 'zod';

const kycDocumentTypeEnum = z.enum(['cni', 'peris', 'passeport']);

export const submitKycSchema = z.object({
  body: z.object({
    documentType: kycDocumentTypeEnum,
    documentFrontUrl: z.string().url('URL du document recto invalide'),
    documentBackUrl: z.string().url('URL du document verso invalide').optional(),
    selfieUrl: z.string().url('URL du selfie invalide'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    otp: z.string().length(6, 'Le code OTP doit contenir 6 chiffres'),
  }),
});

export const sendOtpSchema = z.object({});

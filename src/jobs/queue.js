import { Queue } from 'bullmq';
import redis from '../config/redis.js';

export const kycQueue = new Queue('kyc-processing', { connection: redis });
export const smsQueue = new Queue('sms-sending', { connection: redis });
export const emailQueue = new Queue('email-sending', { connection: redis });

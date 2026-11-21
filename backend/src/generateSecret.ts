import { randomBytes } from 'node:crypto';

const secret = randomBytes(32);

const webhookSecret = secret.toString('hex');

console.log(webhookSecret);
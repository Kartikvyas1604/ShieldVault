import { FastifyRequest, FastifyReply } from 'fastify';
import { PublicKey } from '@solana/web3.js';
import { verifySignature } from '../utils/crypto.js';
import { logger } from '../utils/logger.js';

interface AuthRequest extends FastifyRequest {
  user?: {
    walletAddress: string;
  };
}

export async function authMiddleware(
  request: AuthRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);

  try {
    const [walletAddress, signature, message] = token.split(':');

    if (!walletAddress || !signature || !message) {
      return reply.code(401).send({ error: 'Invalid token format' });
    }

    const publicKey = new PublicKey(walletAddress);
    const messageBytes = Buffer.from(message, 'base64');
    const signatureBytes = Buffer.from(signature, 'base64');

    const isValid = verifySignature(messageBytes, signatureBytes, publicKey.toBytes());

    if (!isValid) {
      return reply.code(401).send({ error: 'Invalid signature' });
    }

    const messageData = JSON.parse(messageBytes.toString());
    const timestamp = messageData.timestamp;

    if (Date.now() - timestamp > 300000) {
      return reply.code(401).send({ error: 'Token expired' });
    }

    request.user = { walletAddress };
  } catch (error) {
    logger.error({ error }, 'Auth middleware error');
    return reply.code(401).send({ error: 'Authentication failed' });
  }
}

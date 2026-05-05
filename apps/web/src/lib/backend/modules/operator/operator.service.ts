import { env } from '../../config';
import { prisma } from '../../db/client';
import { AppError } from '../../utils/errors';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export interface HedgeParams {
  hedgePositionId: string;
  priceAtApproval: number;
}

export class OperatorService {
  private operators: Uint8Array[];

  constructor() {
    this.operators = [
      bs58.decode(env.OPERATOR_1_KEY),
      bs58.decode(env.OPERATOR_2_KEY),
      bs58.decode(env.OPERATOR_3_KEY)
    ];
  }

  async requestApprovals(params: HedgeParams) {
    const timestamp = Date.now();
    const message = new TextEncoder().encode(JSON.stringify({
      hedgePositionId: params.hedgePositionId,
      priceAtApproval: params.priceAtApproval,
      timestamp
    }));

    const signatures = [];

    // Simulate 3 operators independently signing the request
    for (let i = 0; i < 3; i++) {
      // In a real distributed system, this would be network calls to each operator.
      // Here we simulate the operator logic since we hold the keys.
      const signature = nacl.sign.detached(message, this.operators[i]);
      signatures.push({
        operatorIndex: i + 1,
        signature: bs58.encode(signature),
      });
    }

    // Store approvals in DB
    for (const sig of signatures) {
      await prisma.operatorApproval.create({
        data: {
          hedge_position_id: params.hedgePositionId,
          operator_index: sig.operatorIndex,
          signature: sig.signature,
          price_at_approval: params.priceAtApproval,
        }
      });
    }

    return signatures;
  }

  async verifyApproval(signature: string, operatorIndex: number, messageString: string): Promise<boolean> {
    if (operatorIndex < 1 || operatorIndex > 3) return false;
    
    // Convert secret key to public key
    const secretKey = this.operators[operatorIndex - 1];
    const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);
    
    const message = new TextEncoder().encode(messageString);
    const signatureBytes = bs58.decode(signature);
    
    return nacl.sign.detached.verify(message, signatureBytes, keyPair.publicKey);
  }

  async hasQuorum(hedgePositionId: string): Promise<boolean> {
    const count = await prisma.operatorApproval.count({
      where: { hedge_position_id: hedgePositionId }
    });
    return count >= 2;
  }
}

export const operatorService = new OperatorService();

import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, walletAddress: string) => Promise<NextResponse>
) {
  const signature = req.headers.get('X-Wallet-Signature');
  const message   = req.headers.get('X-Wallet-Message');
  const address   = req.headers.get('X-Wallet-Address');

  if (!signature || !message || !address) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', message: 'Missing auth headers (signature, message, address)' },
      { status: 401 }
    );
  }

  try {
    const messageBytes   = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(address);

    // Solana wallet-adapter signMessage signs the raw bytes directly (ed25519)
    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!isValid) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Invalid wallet signature' },
        { status: 401 }
      );
    }

    return handler(req, address);
  } catch (error) {
    // bs58 decode or nacl errors mean malformed data
    return NextResponse.json(
      { error: 'UNAUTHORIZED', message: 'Auth verification failed — malformed signature or address' },
      { status: 401 }
    );
  }
}

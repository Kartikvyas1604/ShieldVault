import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export async function withAuth(req: NextRequest, handler: (req: NextRequest, walletAddress: string) => Promise<NextResponse>) {
  const signature = req.headers.get('X-Wallet-Signature');
  const message = req.headers.get('X-Wallet-Message');
  
  if (!signature || !message) {
    return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Missing signature headers' }, { status: 401 });
  }

  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    
    // We expect the message to be the wallet address or contain it.
    // For simplicity, we assume message IS the wallet address
    const walletAddress = message;
    const publicKeyBytes = bs58.decode(walletAddress);
    
    const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    
    if (!isValid) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Invalid signature' }, { status: 401 });
    }

    return handler(req, walletAddress);
  } catch (error) {
    return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Auth verification failed' }, { status: 401 });
  }
}

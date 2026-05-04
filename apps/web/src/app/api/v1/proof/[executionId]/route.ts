import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const { executionId } = params;

    const proof = await prisma.proofBundle.findFirst({
      where: { executionLogId: executionId },
      include: {
        executionLog: true,
      },
    });

    if (!proof) {
      return NextResponse.json(
        { error: 'Proof not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      proof: {
        id: proof.id,
        executionLogId: proof.executionLogId,
        priceData: proof.priceData,
        executionRoute: proof.executionRoute,
        ruleHash: proof.ruleHash,
        operatorSigs: proof.operatorSigs,
        arweaveTxId: proof.arweaveTxId,
        timestamp: proof.timestamp.toISOString(),
        executionType: proof.executionLog.type,
        status: proof.executionLog.status,
      },
    });
  } catch (error) {
    console.error('Proof fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

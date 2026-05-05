const fs = require('fs');
const path = require('path');

const routes = {
  'api/vault/deposit/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { vaultService } from '../../../../lib/backend/modules/vault/vault.service';
import { handleApiError } from '../../../../lib/backend/apiErrorHandler';
import { withAuth } from '../../../../lib/backend/middleware/auth';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, walletAddress) => {
    try {
      const { txSignature, solAmount } = await req.json();
      const result = await vaultService.deposit(walletAddress, solAmount);
      return NextResponse.json(result);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
`,
  'api/vault/withdraw/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { vaultService } from '../../../../lib/backend/modules/vault/vault.service';
import { handleApiError } from '../../../../lib/backend/apiErrorHandler';
import { withAuth } from '../../../../lib/backend/middleware/auth';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, walletAddress) => {
    try {
      const { shares } = await req.json();
      const result = await vaultService.withdraw(walletAddress, shares);
      return NextResponse.json(result);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
`,
  'api/vault/state/[walletAddress]/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { vaultService } from '../../../../../lib/backend/modules/vault/vault.service';
import { handleApiError } from '../../../../../lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: { walletAddress: string } }) {
  try {
    const result = await vaultService.getState(params.walletAddress);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
`,
  'api/policy/create/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { policyService } from '../../../../lib/backend/modules/policy/policy.service';
import { handleApiError } from '../../../../lib/backend/apiErrorHandler';
import { withAuth } from '../../../../lib/backend/middleware/auth';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, walletAddress) => {
    try {
      const body = await req.json();
      const result = await policyService.createRule(walletAddress, {
        triggerPercent: body.triggerPercent,
        hedgePercent: body.hedgePercent,
        timeoutMinutes: body.timeoutMinutes
      });
      return NextResponse.json(result);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
`,
  'api/policy/[walletAddress]/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { policyService } from '../../../../lib/backend/modules/policy/policy.service';
import { handleApiError } from '../../../../lib/backend/apiErrorHandler';
import { withAuth } from '../../../../lib/backend/middleware/auth';

export async function GET(req: NextRequest, { params }: { params: { walletAddress: string } }) {
  try {
    const result = await policyService.getActiveRule(params.walletAddress);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { walletAddress: string } }) {
  return withAuth(req, async (req, walletAddress) => {
    try {
      if (walletAddress !== params.walletAddress) throw new Error('Unauthorized');
      const result = await policyService.deactivateRule(walletAddress);
      return NextResponse.json(result);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
`,
  'api/price/current/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { consensusService } from '../../../../lib/backend/modules/price/consensus.service';
import { handleApiError } from '../../../../lib/backend/apiErrorHandler';

export async function GET(req: NextRequest) {
  try {
    const result = consensusService.getCurrentPrice();
    return NextResponse.json(result || { error: 'Price not available yet' });
  } catch (error) {
    return handleApiError(error);
  }
}
`,
  'api/price/history/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { consensusService } from '../../../../lib/backend/modules/price/consensus.service';
import { handleApiError } from '../../../../lib/backend/apiErrorHandler';

export async function GET(req: NextRequest) {
  try {
    const result = await consensusService.getPriceHistory(30);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
`,
  'api/hedge/active/[walletAddress]/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/backend/db/client';
import { handleApiError } from '../../../../../lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: { walletAddress: string } }) {
  try {
    const hedge = await prisma.hedgePosition.findFirst({
      where: { wallet_address: params.walletAddress, status: 'OPEN' }
    });
    return NextResponse.json(hedge || { message: 'No active hedge' });
  } catch (error) {
    return handleApiError(error);
  }
}
`,
  'api/hedge/history/[walletAddress]/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/backend/db/client';
import { handleApiError } from '../../../../../lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: { walletAddress: string } }) {
  try {
    const history = await prisma.hedgePosition.findMany({
      where: { wallet_address: params.walletAddress, status: 'CLOSED' },
      orderBy: { close_timestamp: 'desc' }
    });
    return NextResponse.json(history);
  } catch (error) {
    return handleApiError(error);
  }
}
`,
  'api/hedge/close/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { hedgeService } from '../../../../lib/backend/modules/hedge/hedge.service';
import { handleApiError } from '../../../../lib/backend/apiErrorHandler';
import { withAuth } from '../../../../lib/backend/middleware/auth';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, walletAddress) => {
    try {
      const { hedgePositionId } = await req.json();
      await hedgeService.closeHedge(hedgePositionId, 'MANUAL');
      return NextResponse.json({ success: true });
    } catch (error) {
      return handleApiError(error);
    }
  });
}
`,
  'api/proof/[hedgePositionId]/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { proofService } from '../../../../../lib/backend/modules/proof/proof.service';
import { handleApiError } from '../../../../../lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: { hedgePositionId: string } }) {
  try {
    const proof = await proofService.getProof(params.hedgePositionId);
    return NextResponse.json(proof || { message: 'Proof not found' });
  } catch (error) {
    return handleApiError(error);
  }
}
`,
  'api/proof/verify/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { proofService } from '../../../../lib/backend/modules/proof/proof.service';
import { handleApiError } from '../../../../lib/backend/apiErrorHandler';

export async function POST(req: NextRequest) {
  try {
    const { proofId } = await req.json();
    const result = await proofService.verifyProof(proofId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
`,
  'api/audit/[walletAddress]/route.ts': `
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/backend/db/client';
import { handleApiError } from '../../../../../lib/backend/apiErrorHandler';

export async function GET(req: NextRequest, { params }: { params: { walletAddress: string } }) {
  try {
    const logs = await prisma.auditLog.findMany({
      where: { wallet_address: params.walletAddress },
      orderBy: { timestamp: 'desc' }
    });
    return NextResponse.json(logs);
  } catch (error) {
    return handleApiError(error);
  }
}
`
};

const baseDir = '/Users/0xkartikvyas/project/ShieldVault/apps/web/src/app';

Object.entries(routes).forEach(([routePath, content]) => {
  const fullPath = path.join(baseDir, routePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
});

console.log('Routes generated successfully');

import { NextResponse } from 'next/server';
import { AppError } from './utils/errors';
import { logger } from './utils/logger';

export function handleApiError(error: any) {
  if (error instanceof AppError) {
    let status = 400;
    if (error.type === 'UNAUTHORIZED') status = 401;
    if (error.type === 'RULE_NOT_FOUND' || error.type === 'VAULT_NOT_FOUND') status = 404;
    
    return NextResponse.json({
      error: error.type,
      message: error.message,
      details: error.details
    }, { status });
  }

  logger.error({ err: error }, 'Unhandled API Error');
  return NextResponse.json({
    error: 'INTERNAL_ERROR',
    message: 'An internal server error occurred'
  }, { status: 500 });
}

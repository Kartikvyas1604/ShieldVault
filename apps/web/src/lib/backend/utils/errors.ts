export type AppErrorType = 
  | 'PRICE_CONSENSUS_FAILED'
  | 'APPROVAL_TIMEOUT'
  | 'DRIFT_EXECUTION_FAILED'
  | 'INSUFFICIENT_MARGIN'
  | 'RULE_NOT_FOUND'
  | 'VAULT_NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'BAD_REQUEST'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(public type: AppErrorType, message: string, public details?: any) {
    super(message);
    this.name = 'AppError';
  }
}

export type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false; error: E };

export function success<T>(data: T): Result<T> {
  return { success: true, data };
}

export function failure(error: AppError): Result<any> {
  return { success: false, error };
}

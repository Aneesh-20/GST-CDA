// TaxMate - Provider Adapter Interface & Circuit Breaker Contract

export interface ProviderRequestOptions {
  idempotencyKey: string;
  correlationId: string;
  businessId: string;
  gstin: string;
  returnPeriod?: string; // MMYYYY e.g. "102026"
}

export interface ProviderResponse<T = any> {
  success: boolean;
  statusCode: number;
  correlationId: string;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
  userFacingExplanation?: string;
  isMock: boolean;
}

export interface IProviderAdapter {
  providerName: string;
  isConfigured(): boolean;
  requestOTP(options: ProviderRequestOptions): Promise<ProviderResponse<{ otpSent: boolean; validUntilMinutes: number }>>;
  verifyGSTIN(gstin: string, options: ProviderRequestOptions): Promise<ProviderResponse<{ legalName: string; status: string; stateCode: string }>>;
  fetchGSTR2B(options: ProviderRequestOptions): Promise<ProviderResponse<{ invoiceCount: number; itcAvailablePaise: bigint }>>;
  saveGSTR1(payload: any, options: ProviderRequestOptions): Promise<ProviderResponse<{ referenceId: string }>>;
  fileReturn(returnType: 'GSTR1' | 'GSTR3B', evcCode: string, options: ProviderRequestOptions): Promise<ProviderResponse<{ arn: string; filedAt: string }>>;
}

/**
 * Safe disconnected fallback adapter used when live GSP is not configured.
 * Strictly adheres to Truthfulness rule: never simulates successful live filing.
 */
export class DisconnectedProviderAdapter implements IProviderAdapter {
  providerName = 'Disconnected GSP Adapter (Safe Mode)';

  isConfigured(): boolean {
    return false;
  }

  async requestOTP(options: ProviderRequestOptions): Promise<ProviderResponse<{ otpSent: boolean; validUntilMinutes: number }>> {
    return {
      success: false,
      statusCode: 503,
      correlationId: options.correlationId,
      errorCode: 'GSP_NOT_CONFIGURED',
      errorMessage: 'Live GSP endpoint is not configured in this deployment.',
      userFacingExplanation: 'GST Portal connection is currently inactive. You can continue working in local draft mode.',
      isMock: true,
    };
  }

  async verifyGSTIN(gstin: string, options: ProviderRequestOptions): Promise<ProviderResponse<{ legalName: string; status: string; stateCode: string }>> {
    return {
      success: false,
      statusCode: 503,
      correlationId: options.correlationId,
      errorCode: 'GSP_NOT_CONFIGURED',
      errorMessage: 'Online verification requires live GSP credentials.',
      userFacingExplanation: 'Using local GSTIN format validation only. Syntax and checksum are verified locally.',
      isMock: true,
    };
  }

  async fetchGSTR2B(options: ProviderRequestOptions): Promise<ProviderResponse<{ invoiceCount: number; itcAvailablePaise: bigint }>> {
    return {
      success: false,
      statusCode: 503,
      correlationId: options.correlationId,
      errorCode: 'GSP_NOT_CONFIGURED',
      errorMessage: 'Cannot fetch GSTR-2B without configured portal credentials.',
      userFacingExplanation: 'Live GST purchase records are unavailable. Please import your supplier bills directly.',
      isMock: true,
    };
  }

  async saveGSTR1(payload: any, options: ProviderRequestOptions): Promise<ProviderResponse<{ referenceId: string }>> {
    return {
      success: false,
      statusCode: 503,
      correlationId: options.correlationId,
      errorCode: 'GSP_NOT_CONFIGURED',
      errorMessage: 'Live save blocked: GSP not configured.',
      userFacingExplanation: 'Your return has been saved locally as a Draft.',
      isMock: true,
    };
  }

  async fileReturn(returnType: 'GSTR1' | 'GSTR3B', evcCode: string, options: ProviderRequestOptions): Promise<ProviderResponse<{ arn: string; filedAt: string }>> {
    return {
      success: false,
      statusCode: 503,
      correlationId: options.correlationId,
      errorCode: 'GSP_NOT_CONFIGURED',
      errorMessage: 'Statutory filing blocked: Requires certified GSP connection.',
      userFacingExplanation: 'Filing cannot be submitted to GSTN without an active GSP provider connection.',
      isMock: true,
    };
  }
}


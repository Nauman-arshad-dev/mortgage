export interface QuoteInput {
  loan_amount: number;
  interest_rate: number;
  loan_term: number;
  down_payment: number;
  loan_type: 'Conventional' | 'FHA' | 'VA';
}

export interface QuoteResponse {
  monthly_payment: number;
  total_interest: number;
  message: string;
}
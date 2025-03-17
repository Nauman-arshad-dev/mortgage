export interface QuoteInput {
  purchase_price: number; // New: Total property price
  ltv: number; // New: Loan-to-Value percentage
  interest_rate: number;
  loan_term: number;
  loan_type: "Conventional" | "FHA" | "VA";
}

export interface QuoteResponse {
  monthly_payment: number;
  total_interest: number;
  message: string;
}
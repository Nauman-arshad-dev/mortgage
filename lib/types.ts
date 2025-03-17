export interface QuoteInput {
  first_name: string;
  last_name: string;
  property_value: number;
  ltv: number;
  interest_rate: number;
  loan_term: number;
  loan_type: "Conventional" | "FHA" | "VA";
  property_address: string;
  va_exempt?: boolean;
}

export interface QuoteResponse {
  monthly_payment: number; // Only this remains
  message: string;
}
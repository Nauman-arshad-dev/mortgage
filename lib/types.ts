export interface QuoteInput {
  first_name: string; // New
  last_name: string; // New
  property_value: number; // Renamed from purchase_price
  ltv: number;
  interest_rate: number;
  loan_term: number;
  loan_type: "Conventional" | "FHA" | "VA";
  property_address: string; // New
  va_exempt?: boolean; // Optional, only for VA loans
}

export interface QuoteResponse {
  monthly_payment: number;
  total_interest: number;
  message: string;
}
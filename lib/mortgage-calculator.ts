import { QuoteInput } from "./types";

export function calculateMortgage(input: QuoteInput & { loan_amount: number }) {
  const principal = input.loan_amount;
  const monthlyRate = input.interest_rate / 12 / 100;
  const totalPayments = input.loan_term * 12;

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  return { monthlyPayment };
}

export function calculateLoanAmount(input: QuoteInput): number {
  const baseAmount = input.property_value * (input.ltv / 100);
  switch (input.loan_type) {
    case "Conventional":
      return baseAmount;
    case "FHA":
      return baseAmount * 1.0175;
    case "VA":
      return input.va_exempt ? baseAmount : baseAmount * 1.033; // Exempt: base, Non-exempt: +3.3%
    default:
      throw new Error("Invalid loan type");
  }
}
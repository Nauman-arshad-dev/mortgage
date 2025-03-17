import { QuoteInput } from './types';

export function calculateMortgage(input: QuoteInput) {
  const principal = input.loan_amount - input.down_payment;
  const monthlyRate = input.interest_rate / 12 / 100;
  const totalPayments = input.loan_term * 12;

  // Calculate monthly payment using the formula: M = P * r * (1 + r)^n / [(1 + r)^n - 1]
  const monthlyPayment =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  // Calculate total interest paid
  const totalInterest = monthlyPayment * totalPayments - principal;

  return {
    monthlyPayment,
    totalInterest,
  };
}
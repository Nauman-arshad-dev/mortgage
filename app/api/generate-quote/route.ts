import { NextRequest, NextResponse } from "next/server";
import { calculateMortgage, calculateLoanAmount } from "@/lib/mortgage-calculator";
import { QuoteInput, QuoteResponse } from "@/lib/types";

const API_KEY = "reliable-secret-key";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = body as QuoteInput;

    if (!isValidQuoteInput(input)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const loanAmount = calculateLoanAmount(input);
    const { monthlyPayment, totalInterest } = calculateMortgage({ ...input, loan_amount: loanAmount });

    const response: QuoteResponse = {
      monthly_payment: Number(monthlyPayment.toFixed(2)),
      total_interest: Number(totalInterest.toFixed(2)),
      message: "Quote generated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}

function isValidQuoteInput(input: any): input is QuoteInput {
  return (
    typeof input.first_name === "string" &&
    input.first_name.length > 0 &&
    typeof input.last_name === "string" &&
    input.last_name.length > 0 &&
    typeof input.property_value === "number" &&
    input.property_value >= 10000 &&
    input.property_value <= 10000000 &&
    typeof input.ltv === "number" &&
    input.ltv >= 1 &&
    input.ltv <= 100 &&
    typeof input.interest_rate === "number" &&
    input.interest_rate >= 0.1 &&
    input.interest_rate <= 20 &&
    typeof input.loan_term === "number" &&
    [15, 20, 30].includes(input.loan_term) &&
    typeof input.loan_type === "string" &&
    ["Conventional", "FHA", "VA"].includes(input.loan_type) &&
    typeof input.property_address === "string" &&
    input.property_address.length > 0 &&
    (input.loan_type !== "VA" || typeof input.va_exempt === "boolean")
  );
}
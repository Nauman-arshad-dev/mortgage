import { NextRequest, NextResponse } from "next/server";
import { calculateMortgage } from "@/lib/mortgage-calculator";
import { QuoteInput, QuoteResponse } from "@/lib/types";

const API_KEY = "reliable-secret-key";

export async function POST(request: NextRequest) {
  // Verify API key
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = body as QuoteInput;

    // Validate input
    if (!isValidQuoteInput(input)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Calculate loan_amount from purchase_price and ltv for the mortgage calculation
    const loan_amount = input.purchase_price * (input.ltv / 100);
    const adjustedInput = { ...input, loan_amount }; // Add loan_amount for calculateMortgage

    const { monthlyPayment, totalInterest } = calculateMortgage(adjustedInput);

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
    typeof input.purchase_price === "number" &&
    input.purchase_price >= 10000 &&
    input.purchase_price <= 10000000 &&
    typeof input.ltv === "number" &&
    input.ltv >= 1 &&
    input.ltv <= 100 &&
    typeof input.interest_rate === "number" &&
    input.interest_rate >= 0.1 &&
    input.interest_rate <= 20 &&
    typeof input.loan_term === "number" &&
    [15, 20, 30].includes(input.loan_term) &&
    typeof input.loan_type === "string" &&
    ["Conventional", "FHA", "VA"].includes(input.loan_type)
  );
}
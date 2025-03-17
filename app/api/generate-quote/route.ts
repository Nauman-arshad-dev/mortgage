import { NextRequest, NextResponse } from 'next/server';
import { calculateMortgage } from '@/lib/mortgage-calculator';
import { QuoteInput, QuoteResponse } from '@/lib/types';

const API_KEY = 'reliable-secret-key';

export async function POST(request: NextRequest) {
  // Verify API key
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = body as QuoteInput;

    // Validate input
    if (!isValidQuoteInput(input)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { monthlyPayment, totalInterest } = calculateMortgage(input);

    const response: QuoteResponse = {
      monthly_payment: Number(monthlyPayment.toFixed(2)),
      total_interest: Number(totalInterest.toFixed(2)),
      message: "Quote generated successfully"
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}

function isValidQuoteInput(input: any): input is QuoteInput {
  return (
    typeof input.loan_amount === 'number' &&
    input.loan_amount >= 10000 &&
    input.loan_amount <= 10000000 &&
    typeof input.interest_rate === 'number' &&
    input.interest_rate >= 0.1 &&
    input.interest_rate <= 20 &&
    typeof input.loan_term === 'number' &&
    [15, 20, 30].includes(input.loan_term) &&
    typeof input.down_payment === 'number' &&
    input.down_payment >= 0 &&
    input.down_payment <= input.loan_amount &&
    typeof input.loan_type === 'string' &&
    ['Conventional', 'FHA', 'VA'].includes(input.loan_type)
  );
}
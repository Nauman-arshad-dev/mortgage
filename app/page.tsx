"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateMortgage } from "@/lib/mortgage-calculator";
import { QuoteInput } from "@/lib/types";
import { HomeIcon } from "lucide-react";

const formSchema = z.object({
  loan_amount: z.number().min(10000).max(10000000),
  interest_rate: z.number().min(0.1).max(20),
  loan_term: z.enum(["15", "20", "30"]),
  down_payment: z.number().min(0),
  loan_type: z.enum(["Conventional", "FHA", "VA"]),
});

export default function Home() {
  const { data: session, status } = useSession();
  const [quote, setQuote] = useState<{
    monthlyPayment: number;
    totalInterest: number;
  } | null>(null);

  // Only redirect if explicitly unauthenticated, not while loading
  if (status === "loading") {
    return <div>Loading...</div>; // Show a loading state
  }
  if (status === "unauthenticated") {
    redirect("/login");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loan_amount: 300000,
      interest_rate: 6.5,
      loan_term: "30",
      down_payment: 60000,
      loan_type: "Conventional",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const input: QuoteInput = {
      ...values,
      loan_term: parseInt(values.loan_term),
    };

    if (input.down_payment > input.loan_amount) {
      form.setError("down_payment", {
        message: "Down payment cannot exceed loan amount",
      });
      return;
    }

    const result = calculateMortgage(input);
    setQuote(result);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center space-x-4">
          <HomeIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-center">
            Reliable Mortgage Quote Tool
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Mortgage Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="loan_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interest_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loan_term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Term (Years)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select loan term" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15">15 Years</SelectItem>
                            <SelectItem value="20">20 Years</SelectItem>
                            <SelectItem value="30">30 Years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="down_payment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Down Payment ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loan_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select loan type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Conventional">
                              Conventional
                            </SelectItem>
                            <SelectItem value="FHA">FHA</SelectItem>
                            <SelectItem value="VA">VA</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Generate Quote
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {quote && (
          <Card>
            <CardHeader>
              <CardTitle>Quote Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Payment</p>
                    <p className="text-2xl font-bold">
                      ${quote.monthlyPayment.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Interest</p>
                    <p className="text-2xl font-bold">
                      ${quote.totalInterest.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center italic">
                  Quote generated by Reliable Mortgage Company
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
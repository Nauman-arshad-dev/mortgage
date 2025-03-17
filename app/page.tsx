"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
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
import { calculateMortgage, calculateLoanAmount } from "@/lib/mortgage-calculator";
import { QuoteInput } from "@/lib/types";
import { HomeIcon, LogOut } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  property_value: z.number().min(10000).max(10000000),
  ltv: z.number().min(1).max(100),
  interest_rate: z.number().min(0.1).max(20),
  loan_term: z.enum(["15", "20", "30"]),
  loan_type: z.enum(["Conventional", "FHA", "VA"]),
  property_address: z.string().min(1, "Property address is required"),
  va_exempt: z.boolean().optional(),
});

export default function Home() {
  const { data: session, status } = useSession();
  const [quote, setQuote] = useState<{
    monthlyPayment: number;
    loanAmount?: number;
  } | null>(null);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") redirect("/login");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      property_value: 375000,
      ltv: 80,
      interest_rate: 6.5,
      loan_term: "30",
      loan_type: "Conventional",
      property_address: "",
    },
  });

  const loanType = form.watch("loan_type");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const input: QuoteInput = {
      first_name: values.first_name,
      last_name: values.last_name,
      property_value: values.property_value,
      ltv: values.ltv,
      interest_rate: values.interest_rate,
      loan_term: parseInt(values.loan_term),
      loan_type: values.loan_type,
      property_address: values.property_address,
      va_exempt: values.va_exempt,
    };

    const loanAmount = calculateLoanAmount(input);
    const result = calculateMortgage({ ...input, loan_amount: loanAmount });
    setQuote({ ...result, loanAmount });
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Helper to format numbers with commas
  const formatNumber = (num: number) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <HomeIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Reliable Mortgage Quote Tool</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Mortgage Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="property_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Value ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ltv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LTV (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
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
                            onChange={(e) => field.onChange(Number(e.target.value))}
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    name="loan_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select loan type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Conventional">Conventional</SelectItem>
                            <SelectItem value="FHA">FHA</SelectItem>
                            <SelectItem value="VA">VA</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {loanType === "VA" && (
                    <FormField
                      control={form.control}
                      name="va_exempt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VA Exempt</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value === "true")}
                            defaultValue={field.value ? "true" : "false"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select exemption status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="property_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
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
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="text-2xl font-bold">${formatNumber(quote.loanAmount!)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Payment</p>
                    <p className="text-2xl font-bold">${formatNumber(quote.monthlyPayment)}</p>
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
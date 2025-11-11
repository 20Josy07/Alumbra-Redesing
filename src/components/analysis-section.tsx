"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { performAnalysis, type AnalysisResult } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

const FormSchema = z.object({
  text: z.string().min(50, {
    message: "Please provide a more detailed description for a meaningful analysis (at least 50 characters).",
  }),
});

export default function AnalysisSection() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);

    const result = await performAnalysis(data.text);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: result.error,
      });
    } else if (result.data) {
      setAnalysisResult(result.data);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary-foreground/80" />
            Analyze Your Situation
          </CardTitle>
          <CardDescription>
            Describe a conversation or situation you're concerned about. Our AI will analyze it for signs of psychological abuse. Your privacy is protected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Your description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., They always check my phone and get angry when I talk to my friends..."
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Text"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
      )}

      {analysisResult && (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          <Alert variant={analysisResult.abuseAnalysis.abuseDetected ? "destructive" : "default"} className="bg-card">
            {analysisResult.abuseAnalysis.abuseDetected ? (
                <ShieldAlert className="h-4 w-4" />
            ) : (
                <ShieldCheck className="h-4 w-4" />
            )}
            <AlertTitle className="font-bold text-lg">
                {analysisResult.abuseAnalysis.abuseDetected
                ? "Potential Abuse Indicators Detected"
                : "No Clear Abuse Indicators Detected"}
            </AlertTitle>
            <AlertDescription>
                {analysisResult.abuseAnalysis.explanation}
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{analysisResult.summary.summary}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

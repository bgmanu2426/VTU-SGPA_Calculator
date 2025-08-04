'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadForm } from '@/components/upload-form';
import { ValidationForm } from '@/components/validation-form';
import { ResultsDisplay } from '@/components/results-display';
import type { ExtractMarksheetDataOutput } from '@/ai/flows/extract-marksheet-data';
import type { ValidatedData, SgpaResults } from '@/types';
import { calculateSgpa, calculatePercentage } from '@/lib/vtu';
import { Skeleton } from './ui/skeleton';

type Step = 'upload' | 'validation' | 'results';

export function SgpaCalculator() {
  const [step, setStep] = useState<Step>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractMarksheetDataOutput | null>(null);
  const [validatedData, setValidatedData] = useState<ValidatedData | null>(null);
  const [results, setResults] = useState<SgpaResults | null>(null);

  const handleDataExtracted = (data: ExtractMarksheetDataOutput) => {
    setExtractedData(data);
    setStep('validation');
    setIsLoading(false);
  };

  const handleValidationComplete = (data: ValidatedData) => {
    const sgpa = calculateSgpa(data.subjectDetails);
    const percentage = calculatePercentage(data.subjectDetails);
    setValidatedData(data);
    setResults({ sgpa, percentage });
    setStep('results');
    setIsLoading(false);
  };

  const handleReset = () => {
    setStep('upload');
    setExtractedData(null);
    setValidatedData(null);
    setResults(null);
    setIsLoading(false);
  };

  const renderStep = () => {
    if (isLoading && step === 'upload') {
        return <LoadingSkeleton />;
    }

    switch (step) {
      case 'upload':
        return <UploadForm onDataExtracted={handleDataExtracted} setIsLoading={setIsLoading} isLoading={isLoading} />;
      case 'validation':
        if (extractedData) {
          return (
            <ValidationForm
              initialData={extractedData}
              onValidationComplete={handleValidationComplete}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          );
        }
        return <LoadingSkeleton message="Error loading validation form. Please reset." />;
      case 'results':
        if (results && validatedData) {
          return <ResultsDisplay results={results} data={validatedData} onReset={handleReset} />;
        }
        return <LoadingSkeleton message="Error loading results. Please reset." />;
      default:
        return <LoadingSkeleton message="An unexpected error occurred. Please reset."/>;
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 md:px-6 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const LoadingSkeleton = ({ message = 'Processing your marksheet...' }: { message?: string }) => (
    <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold font-headline">{message}</h2>
            <p className="text-muted-foreground">This may take a moment.</p>
        </div>
        <div className="p-4 border rounded-lg space-y-4">
            <div className='flex gap-4'>
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className='flex-1 space-y-2'>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
    </div>
)

'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadForm } from '@/components/upload-form';
import { ResultsDisplay } from '@/components/results-display';
import type { ExtractMarksheetDataOutput } from '@/ai/flows/extract-marksheet-data';
import type { ValidatedData, SgpaResults, ValidatedSubject } from '@/types';
import { calculateSgpa, calculatePercentage } from '@/lib/vtu';
import { Skeleton } from './ui/skeleton';

type Step = 'upload' | 'results';

export function SgpaCalculator() {
  const [step, setStep] = useState<Step>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [validatedData, setValidatedData] = useState<ValidatedData | null>(null);
  const [results, setResults] = useState<SgpaResults | null>(null);

  const handleDataExtracted = (data: ExtractMarksheetDataOutput) => {
    // We are skipping the validation step
    // We need to add default credits to the subjects
    const subjectsWithCredits: ValidatedSubject[] = data.subjectDetails.map(s => ({
        ...s,
        credits: 4 // Defaulting credits to 4, user should verify this in a later step if needed
    }));

    const completeData: ValidatedData = {
        studentDetails: data.studentDetails,
        subjectDetails: subjectsWithCredits
    }

    const sgpa = calculateSgpa(completeData.subjectDetails);
    const percentage = calculatePercentage(completeData.subjectDetails);
    
    setValidatedData(completeData);
    setResults({ sgpa, percentage });
    setStep('results');
    setIsLoading(false);
  };

  const handleReset = () => {
    setStep('upload');
    setValidatedData(null);
    setResults(null);
    setIsLoading(false);
  };

  const renderStep = () => {
    if (isLoading && step === 'upload') {
        return <LoadingSkeleton currentStep={step} />;
    }

    switch (step) {
      case 'upload':
        return <UploadForm onDataExtracted={handleDataExtracted} setIsLoading={setIsLoading} isLoading={isLoading} />;
      case 'results':
        if (results && validatedData) {
          return <ResultsDisplay results={results} data={validatedData} onReset={handleReset} />;
        }
        return <LoadingSkeleton currentStep="results" message="Error loading results. Please reset." />;
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

const Stepper = ({ currentStep }: { currentStep: Step }) => {
    const steps = [
        { id: 'upload', name: 'Upload' },
        { id: 'results', name: 'Review' },
    ];
    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <nav aria-label="Progress">
        <ol role="list" className="flex items-center justify-center space-x-8 sm:space-x-16">
            {steps.map((step, index) => (
            <li key={step.name} className="flex items-center">
                {index <= currentStepIndex ? (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                    <span className="text-sm font-medium">{index + 1}</span>
                </div>
                ) : (
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary text-primary">
                    <span className="text-sm font-medium">{index + 1}</span>
                </div>
                )}
                <span className="ml-4 text-sm font-medium hidden sm:block">{step.name}</span>
            </li>
            ))}
        </ol>
        </nav>
    );
};


const LoadingSkeleton = ({ currentStep = 'upload', message = 'Processing your marksheet...' }: { currentStep?: Step; message?: string }) => (
    <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Upload Your Marksheet</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your VTU marksheet (PDF or Image). PDFs will be automatically converted to images for better analysis.
            </p>
            <div className="flex justify-center py-4">
                <Stepper currentStep={currentStep} />
            </div>
            <h2 className="text-2xl font-bold font-headline pt-4">{message}</h2>
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

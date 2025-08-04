'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { useState } from 'react';
import { calculateSgpa, calculatePercentage } from '@/lib/vtu';
import { ResultsDisplay } from './results-display';
import type { ValidatedData, SgpaResults } from '@/types';


const subjectSchema = z.object({
  subjectName: z.string().optional(),
  totalMarks: z.coerce.number().min(0, 'Marks must be positive').max(100, "Marks can't exceed 100"),
  credits: z.coerce.number().min(1, 'Credits required').max(10, "Credits can't exceed 10"),
});

const manualCalculationSchema = z.object({
  subjectDetails: z.array(subjectSchema),
});

type ManualFormValues = z.infer<typeof manualCalculationSchema>;

export function ManualCalculator() {
  const [results, setResults] = useState<SgpaResults | null>(null);
  
  const form = useForm<ManualFormValues>({
    resolver: zodResolver(manualCalculationSchema),
    defaultValues: {
      subjectDetails: [{ subjectName: '', totalMarks: 0, credits: 4 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subjectDetails',
  });

  const onSubmit = (data: ManualFormValues) => {
    const subjectsForCalc = data.subjectDetails.map(s => ({
        ...s,
        subjectCode: '',
        internalMarks: 0,
        externalMarks: 0
    }));

    const sgpa = calculateSgpa(subjectsForCalc);
    // Note: Percentage calculation might not be accurate without full marks breakdown,
    // but we can make an assumption.
    const percentage = calculatePercentage(subjectsForCalc);
    
    // We create a mock ValidatedData object to reuse the ResultsDisplay component
    const validatedData: ValidatedData = {
        studentDetails: { name: 'Manual Entry', usn: 'N/A', branch: 'N/A'},
        subjectDetails: subjectsForCalc,
    };
    
    setResults({ sgpa, percentage });
  };
  
  const handleReset = () => {
    setResults(null);
    form.reset({
      subjectDetails: [{ subjectName: '', totalMarks: 0, credits: 4 }],
    });
  }

  if (results) {
    const displayData: ValidatedData = {
        studentDetails: { name: 'Manual Calculation', usn: 'N/A', branch: 'N/A'},
        subjectDetails: form.getValues('subjectDetails').map(s => ({
            ...s,
            subjectCode: '-',
            internalMarks: 0,
            externalMarks: 0,
            totalMarks: s.totalMarks,
            credits: s.credits,
            subjectName: s.subjectName || 'Subject'
        }))
    }
    return <ResultsDisplay results={results} data={displayData} onReset={handleReset} />
  }


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Manual SGPA Calculator</CardTitle>
        <CardDescription>
          Enter your marks and credits for each subject to calculate your SGPA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Subject (Optional)</TableHead>
                    <TableHead>Total Marks (out of 100)</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`subjectDetails.${index}.subjectName`}
                          render={({ field }) => (
                            <Input {...field} placeholder={`Subject ${index + 1}`} />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`subjectDetails.${index}.totalMarks`}
                          render={({ field }) => (
                            <Input type="number" {...field} className="w-24" />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`subjectDetails.${index}.credits`}
                          render={({ field }) => (
                            <Input type="number" {...field} className="w-20" />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className='flex gap-2'>
                <Button
                type="button"
                variant="outline"
                onClick={() => append({ subjectName: '', totalMarks: 0, credits: 4 })}
                >
                <Plus className="mr-2" /> Add Subject
                </Button>
                <Button type="submit">
                <Calculator className="mr-2" /> Calculate
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

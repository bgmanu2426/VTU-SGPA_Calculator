'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calculator, Medal, RotateCcw, Users } from 'lucide-react';
import { useState } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const semesterSchema = z.object({
  sgpa: z.coerce.number().min(0, 'SGPA must be positive').max(10, "SGPA can't exceed 10").optional(),
  credits: z.coerce.number().min(0, 'Credits must be positive').max(40, "Credits can't exceed 40").optional(),
});

const cgpaCalculationSchema = z.object({
  semesters: z.array(semesterSchema),
  isLateralEntry: z.boolean(),
});

type CgpaFormValues = z.infer<typeof cgpaCalculationSchema>;

export function CgpaCalculator() {
  const [cgpa, setCgpa] = useState<number | null>(null);
  
  const form = useForm<CgpaFormValues>({
    resolver: zodResolver(cgpaCalculationSchema),
    defaultValues: {
      semesters: Array(8).fill({ sgpa: undefined, credits: undefined }),
      isLateralEntry: false,
    },
  });

  const onSubmit = (data: CgpaFormValues) => {
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    const startSemester = data.isLateralEntry ? 2 : 0;

    data.semesters.slice(startSemester).forEach(s => {
        const sgpa = s.sgpa || 0;
        const credits = s.credits || 0;

        if (sgpa > 0 && credits > 0) {
            totalGradePoints += sgpa * credits;
            totalCredits += credits;
        }
    });

    if (totalCredits === 0) {
        setCgpa(0);
        return;
    }

    const calculatedCgpa = totalGradePoints / totalCredits;
    setCgpa(parseFloat(calculatedCgpa.toFixed(2)));
  };
  
  const handleReset = () => {
    setCgpa(null);
    form.reset({
      semesters: Array(8).fill({ sgpa: undefined, credits: undefined }),
      isLateralEntry: form.getValues('isLateralEntry'),
    });
  }

  const isLateralEntry = form.watch('isLateralEntry');

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Medal />
            CGPA Calculator
        </CardTitle>
        <CardDescription>
          Enter your SGPA and total credits for each semester to calculate your CGPA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cgpa !== null ? (
            <div className='text-center space-y-4'>
                <p className='text-muted-foreground'>Your Calculated CGPA is</p>
                <p className='text-6xl font-bold text-primary'>{cgpa.toFixed(2)}</p>
                <Button onClick={handleReset} variant="outline">
                    <RotateCcw className='mr-2' />
                    Calculate Again
                </Button>
            </div>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="isLateralEntry"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Users />
                          Lateral Entry Student?
                        </FormLabel>
                        <CardDescription>
                          Enable this if you started from the 3rd semester.
                        </CardDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {form.getValues('semesters').map((_, index) => (
                    <div key={index} className={`space-y-3 p-3 rounded-md ${(isLateralEntry && index < 2) ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
                        <h4 className="font-medium text-center">Semester {index + 1}</h4>
                        <FormField
                            control={form.control}
                            name={`semesters.${index}.sgpa`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs">SGPA</FormLabel>
                                <FormControl>
                                <Input type="number" step="0.01" {...field} placeholder="0.00" disabled={isLateralEntry && index < 2} />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`semesters.${index}.credits`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs">Credits</FormLabel>
                                <FormControl>
                                <Input type="number" {...field} placeholder="0" disabled={isLateralEntry && index < 2} />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>
                ))}
                </div>
                
                <div className="flex justify-end gap-2">
                    <Button onClick={handleReset} variant="outline" type="button">
                        <RotateCcw className='mr-2' />
                        Reset
                    </Button>
                    <Button type="submit">
                        <Calculator className="mr-2" /> Calculate CGPA
                    </Button>
                </div>
            </form>
            </Form>
        )}
      </CardContent>
    </Card>
  );
}

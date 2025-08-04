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
import { Plus, Trash2, Calculator, Medal, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const semesterSchema = z.object({
  sgpa: z.coerce.number().min(0, 'SGPA must be positive').max(10, "SGPA can't exceed 10"),
});

const cgpaCalculationSchema = z.object({
  semesters: z.array(semesterSchema),
});

type CgpaFormValues = z.infer<typeof cgpaCalculationSchema>;

export function CgpaCalculator() {
  const [cgpa, setCgpa] = useState<number | null>(null);
  
  const form = useForm<CgpaFormValues>({
    resolver: zodResolver(cgpaCalculationSchema),
    defaultValues: {
      semesters: Array(8).fill({ sgpa: 0 }).map(() => ({ sgpa: 0 })),
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'semesters',
  });

  const onSubmit = (data: CgpaFormValues) => {
    const validSgpas = data.semesters.map(s => s.sgpa).filter(sgpa => sgpa > 0);
    if (validSgpas.length === 0) {
        setCgpa(0);
        return;
    }
    const totalSgpa = validSgpas.reduce((acc, sgpa) => acc + sgpa, 0);
    const calculatedCgpa = totalSgpa / validSgpas.length;
    setCgpa(parseFloat(calculatedCgpa.toFixed(2)));
  };
  
  const handleReset = () => {
    setCgpa(null);
    form.reset({
      semesters: Array(8).fill({ sgpa: 0 }).map(() => ({ sgpa: 0 })),
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Medal />
            CGPA Calculator
        </CardTitle>
        <CardDescription>
          Enter your SGPA for each semester to calculate your CGPA.
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fields.map((field, index) => (
                    <FormField
                        key={field.id}
                        control={form.control}
                        name={`semesters.${index}.sgpa`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Semester {index + 1}</FormLabel>
                            <FormControl>
                            <Input type="number" step="0.01" {...field} placeholder="0.00" />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                ))}
                </div>
                
                <Button type="submit" className="w-full">
                    <Calculator className="mr-2" /> Calculate CGPA
                </Button>
            </form>
            </Form>
        )}
      </CardContent>
    </Card>
  );
}

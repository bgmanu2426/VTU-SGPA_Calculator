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
import { useState, useEffect } from 'react';
import { Switch } from './ui/switch';
import dynamic from 'next/dynamic';

const semesterSchema = z.object({
  sgpa: z.coerce.number().min(0, 'SGPA must be positive').max(10, "SGPA can't exceed 10").optional(),
});

const cgpaCalculationSchema = z.object({
  semesters: z.array(semesterSchema),
  isLateralEntry: z.boolean(),
});

type CgpaFormValues = z.infer<typeof cgpaCalculationSchema>;

function CgpaForm({ onCalculate, onReset, isLateralEntry, setIsLateralEntry } : { onCalculate: (data: CgpaFormValues) => void, onReset: () => void, isLateralEntry: boolean, setIsLateralEntry: (value: boolean) => void }) {
  const form = useForm<CgpaFormValues>({
    resolver: zodResolver(cgpaCalculationSchema),
    defaultValues: {
      semesters: Array(8).fill({ sgpa: undefined }),
      isLateralEntry: false,
    },
  });

  useEffect(() => {
    form.reset({
      semesters: Array(8).fill({ sgpa: undefined }),
      isLateralEntry: isLateralEntry,
    });
  }, [isLateralEntry, form]);

  const handleSwitchChange = (checked: boolean) => {
    setIsLateralEntry(checked);
    form.setValue('isLateralEntry', checked);
    form.reset({
        semesters: Array(8).fill({ sgpa: undefined }),
        isLateralEntry: checked,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-6">
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
                    onCheckedChange={handleSwitchChange}
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
                          <Input type="number" step="0.01" {...field} value={field.value ?? ''} placeholder="0.00" disabled={isLateralEntry && index < 2} />
                          </FormControl>
                      </FormItem>
                      )}
                  />
              </div>
          ))}
          </div>
          
          <div className="flex justify-end gap-2">
              <Button onClick={() => { onReset(); form.reset({ semesters: Array(8).fill({ sgpa: undefined }), isLateralEntry: isLateralEntry }); }} variant="outline" type="button">
                  <RotateCcw className='mr-2' />
                  Reset
              </Button>
              <Button type="submit">
                  <Calculator className="mr-2" /> Calculate CGPA
              </Button>
          </div>
      </form>
    </Form>
  )
}

const DynamicCgpaForm = dynamic(() => Promise.resolve(CgpaForm), { ssr: false });

export function CgpaCalculator() {
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [isLateralEntry, setIsLateralEntry] = useState(false);
  
  const onSubmit = (data: CgpaFormValues) => {
    const startSemester = data.isLateralEntry ? 2 : 0;
    
    const validSgpas = data.semesters
        .slice(startSemester)
        .map(s => s.sgpa)
        .filter(sgpa => sgpa !== undefined && sgpa > 0) as number[];

    if (validSgpas.length === 0) {
        setCgpa(0);
        return;
    }

    const totalSgpa = validSgpas.reduce((sum, sgpa) => sum + sgpa, 0);
    const calculatedCgpa = totalSgpa / validSgpas.length;
    setCgpa(parseFloat(calculatedCgpa.toFixed(2)));
  };
  
  const handleReset = () => {
    setCgpa(null);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
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
            <DynamicCgpaForm 
              onCalculate={onSubmit}
              onReset={handleReset}
              isLateralEntry={isLateralEntry}
              setIsLateralEntry={setIsLateralEntry}
            />
        )}
      </CardContent>
    </Card>
  );
}

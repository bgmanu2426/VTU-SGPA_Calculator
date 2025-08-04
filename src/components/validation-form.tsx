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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClipboardCheck, Loader2 } from 'lucide-react';
import type { StudentDetails, SubjectDetails, ValidatedData } from '@/types';
import { validateExtractedData } from '@/ai/flows/validate-extracted-data';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

const subjectSchema = z.object({
  subjectName: z.string().min(1, 'Subject name is required.'),
  subjectCode: z.string().min(1, 'Subject code is required.'),
  internalMarks: z.coerce.number().min(0).max(50),
  externalMarks: z.coerce.number().min(0).max(100),
  totalMarks: z.coerce.number().min(0).max(150),
  credits: z.coerce.number().min(1, 'Credits required').max(10),
});

const validationSchema = z.object({
  studentDetails: z.object({
    name: z.string().min(1, 'Name is required.'),
    usn: z.string().min(1, 'USN is required.'),
    branch: z.string().min(1, 'Branch is required.'),
  }),
  subjectDetails: z.array(subjectSchema),
});

interface ValidationFormProps {
  initialData: { studentDetails: StudentDetails; subjectDetails: SubjectDetails[] };
  onValidationComplete: (data: ValidatedData) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

export function ValidationForm({
  initialData,
  onValidationComplete,
  setIsLoading,
  isLoading,
}: ValidationFormProps) {
  const [reviewPrompt, setReviewPrompt] = useState('');
  const [isPromptLoading, setIsPromptLoading] = useState(true);

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      studentDetails: initialData.studentDetails,
      subjectDetails: initialData.subjectDetails.map(s => ({ ...s, credits: 4 })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'subjectDetails',
  });

  useEffect(() => {
    async function getReviewPrompt() {
      try {
        const { reviewPrompt } = await validateExtractedData({
          ...initialData.studentDetails,
          subjectDetails: initialData.subjectDetails,
        });
        setReviewPrompt(reviewPrompt);
      } catch (error) {
        console.error('Failed to get review prompt', error);
        setReviewPrompt('Please carefully review the extracted data and correct any mistakes.');
      } finally {
        setIsPromptLoading(false);
      }
    }
    getReviewPrompt();
  }, [initialData]);

  const onSubmit = (data: z.infer<typeof validationSchema>) => {
    setIsLoading(true);
    onValidationComplete(data);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Verify Extracted Data</CardTitle>
        <CardDescription>
          Please check the data extracted by the AI. Make any necessary corrections before calculating the SGPA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPromptLoading ? (
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <Alert className="mb-6 bg-primary/10">
            <AlertTitle>AI Review</AlertTitle>
            <AlertDescription>{reviewPrompt}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Student Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="studentDetails.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentDetails.usn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>USN</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentDetails.branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-lg font-medium font-headline">Subject Details</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Subject</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Internal</TableHead>
                      <TableHead>External</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Credits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`subjectDetails.${index}.subjectName`}
                            render={({ field }) => <Input {...field} className="w-full" />}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`subjectDetails.${index}.subjectCode`}
                            render={({ field }) => <Input {...field} className="w-24" />}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`subjectDetails.${index}.internalMarks`}
                            render={({ field }) => <Input type="number" {...field} className="w-20" />}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`subjectDetails.${index}.externalMarks`}
                            render={({ field }) => <Input type="number" {...field} className="w-20" />}
                          />
                        </TableCell>
                        <TableCell>
                           <FormField
                            control={form.control}
                            name={`subjectDetails.${index}.totalMarks`}
                            render={({ field }) => <Input type="number" {...field} className="w-20" />}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`subjectDetails.${index}.credits`}
                            render={({ field }) => <Input type="number" {...field} className="w-20" />}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <ClipboardCheck className="mr-2" /> Verify & Calculate SGPA
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

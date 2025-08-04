'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Award, Download, RotateCcw } from 'lucide-react';
import type { ValidatedData, SgpaResults } from '@/types';
import { getGrade, getGradePoint } from '@/lib/vtu';
import { Badge } from './ui/badge';

interface ResultsDisplayProps {
  results: SgpaResults;
  data: ValidatedData;
  onReset: () => void;
}

export function ResultsDisplay({ results, data, onReset }: ResultsDisplayProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto print-container" id="report">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">Result Analysis</CardTitle>
                <CardDescription>Here is your calculated SGPA and Percentage.</CardDescription>
            </div>
            <Award className="w-10 h-10 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className='text-xl font-headline'>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="font-medium text-muted-foreground">Name</p>
                        <p className="font-semibold">{data.studentDetails.name}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">USN</p>
                        <p className="font-semibold">{data.studentDetails.usn}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Branch</p>
                        <p className="font-semibold">{data.studentDetails.branch}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div>
            <h3 className="text-lg font-medium mb-2 font-headline">Marks Details</h3>
            <div className='border rounded-lg'>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="text-center">Internal</TableHead>
                    <TableHead className="text-center">External</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Credits</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Grade Point</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {data.subjectDetails.map((subject, index) => (
                    <TableRow key={index}>
                    <TableCell className="font-medium">{subject.subjectName}</TableCell>
                    <TableCell>{subject.subjectCode}</TableCell>
                    <TableCell className="text-center">{subject.internalMarks}</TableCell>
                    <TableCell className="text-center">{subject.externalMarks}</TableCell>
                    <TableCell className="text-center font-semibold">{subject.totalMarks}</TableCell>
                    <TableCell className="text-center">{subject.credits}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={getGrade(subject.totalMarks) === 'F' ? 'destructive' : 'secondary'}>
                            {getGrade(subject.totalMarks)}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">{getGradePoint(subject.totalMarks)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className='bg-primary/10'>
                <CardHeader className='text-center'>
                    <CardTitle className="font-headline">SGPA</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-5xl font-bold text-primary">{results.sgpa.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card className='bg-accent/10'>
                <CardHeader className='text-center'>
                    <CardTitle className="font-headline">Percentage</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-5xl font-bold text-accent-foreground/80">{results.percentage.toFixed(2)}%</p>
                </CardContent>
            </Card>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 no-print">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2" /> Start Over
        </Button>
        <Button onClick={handlePrint}>
          <Download className="mr-2" /> Download Report
        </Button>
      </CardFooter>
    </Card>
  );
}

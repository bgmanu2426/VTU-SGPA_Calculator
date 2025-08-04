'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, User, BookOpen, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StudentDetails, SubjectDetails } from "@/types";

type CreditInputFormProps = {
  subjects: SubjectDetails[];
  onCalculate: (subjectsWithCredits: (SubjectDetails & {credits: number})[]) => void;
  studentData: { studentDetails: StudentDetails, subjectDetails: SubjectDetails[] };
}

export default function CreditInputForm({ subjects, onCalculate, studentData }: CreditInputFormProps) {
  const [credits, setCredits] = useState<{[key: number]: number}>({});
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const [creditsFetched, setCreditsFetched] = useState(false);
  const [creditsError, setCreditsError] = useState<string | null>(null);

  useEffect(() => {
    if (subjects.length > 0 && !creditsFetched) {
      fetchCreditsFromVTU();
    }
  }, [subjects, creditsFetched]);

  const fetchCreditsFromVTU = async () => {
    if (subjects.length === 0) return;
    
    setIsLoadingCredits(true);
    setCreditsError(null);
    
    // Simplified credit fetching logic. In a real scenario, this would call an external API or a more complex Genkit flow.
    try {
      const subjectCodes = subjects.map(s => s.subjectCode).filter(Boolean);
      
      if (subjectCodes.length === 0) {
        throw new Error("No valid subject codes found to fetch credits.");
      }

      // This is a mock implementation.
      const newCredits : {[key: number]: number} = {};
      subjects.forEach((subject, index) => {
        const subjectCode = subject.subjectCode.toUpperCase();
        let creditValue;
        if (subjectCode && (subjectCode.toLowerCase().includes('lab') || subjectCode.includes('L') || subjectCode.endsWith('4') || subjectCode.endsWith('6') || subjectCode.endsWith('7') || subjectCode.endsWith('8'))) {
          creditValue = 1;
        } else if (subjectCode && subjectCode.toLowerCase().includes('project')) {
          creditValue = 6;
        } else if (subjectCode && (subjectCode.includes('MAT') || subjectCode.includes('MATH'))) {
          creditValue = 4;
        } else {
          creditValue = 3;
        }
        newCredits[index] = creditValue;
      });
      
      setCredits(newCredits);
      setCreditsFetched(true);
      
    } catch (error: any) {
      console.error("Error fetching VTU credits:", error);
      setCreditsError("Unable to fetch credits automatically. Default values assigned based on subject patterns.");
      
      const defaultCredits: {[key: number]: number} = {};
      subjects.forEach((subject, index) => {
        const subjectCode = subject.subjectCode || '';
        
        if (subjectCode.toLowerCase().includes('lab') || subjectCode.includes('L') || 
            subjectCode.endsWith('4') || subjectCode.endsWith('6') || 
            subjectCode.endsWith('7') || subjectCode.endsWith('8')) {
          defaultCredits[index] = 1;
        } else if (subjectCode.toLowerCase().includes('project')) {
          defaultCredits[index] = 6;
        } else if (subjectCode.includes('MAT') || subjectCode.includes('MATH')) {
          defaultCredits[index] = 4;
        } else {
          defaultCredits[index] = 3;
        }
      });
      setCredits(defaultCredits);
    }
    
    setIsLoadingCredits(false);
  };

  const handleCreditChange = (index: number, value: string) => {
    const creditValue = parseInt(value);
    setCredits(prev => ({
      ...prev,
      [index]: isNaN(creditValue) || creditValue < 0 ? 0 : creditValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsWithCredits = subjects.map((subject, index) => ({
      ...subject,
      credits: credits[index] !== undefined ? credits[index] : 0
    }));
    onCalculate(subjectsWithCredits);
  };

  const getGradeColor = (totalMarks: number) => {
    if (totalMarks >= 90) return "bg-green-100 text-green-800";
    if (totalMarks >= 80) return "bg-blue-100 text-blue-800";
    if (totalMarks >= 70) return "bg-indigo-100 text-indigo-800";
    if (totalMarks >= 60) return "bg-purple-100 text-purple-800";
    if (totalMarks >= 55) return "bg-yellow-100 text-yellow-800";
    if (totalMarks >= 50) return "bg-orange-100 text-orange-800";
    if (totalMarks >= 40) return "bg-gray-100 text-gray-800";
    return "bg-red-100 text-red-800";
  };

  const getGradeLetter = (totalMarks: number) => {
    if (totalMarks >= 90) return "O";
    if (totalMarks >= 80) return "A+";
    if (totalMarks >= 70) return "A";
    if (totalMarks >= 60) return "B+";
    if (totalMarks >= 55) return "B";
    if (totalMarks >= 50) return "C";
    if (totalMarks >= 40) return "P";
    return "F";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-800 text-base md:text-lg">
            <User className="w-4 h-4 md:w-5 md:h-5" />
            Student Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
            <div>
              <p className="text-gray-600 font-medium">Name</p>
              <p className="font-semibold break-words">{studentData.studentDetails.name}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">USN</p>
              <p className="font-semibold">{studentData.studentDetails.usn}</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Branch</p>
              <p className="font-semibold">{studentData.studentDetails.branch}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoadingCredits && (
        <Alert className="border-blue-200 bg-blue-50">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          <AlertDescription className="text-blue-800 text-xs md:text-sm">
            Fetching credit values from VTU patterns...
          </AlertDescription>
        </Alert>
      )}

      {creditsFetched && !creditsError && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 text-xs md:text-sm">
            <strong>Important:</strong> Credits are fetched automatically and sometimes may be incorrect. Please verify and edit if needed before calculating SGPA.
          </Alert>
        </Alert>
      )}

      {creditsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs md:text-sm">
            {creditsError}
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2 text-red-700 underline text-xs"
              onClick={() => {
                setCreditsFetched(false);
                fetchCreditsFromVTU();
              }}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-sm md:shadow-lg">
        <CardHeader className="pb-3 md:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              Subject Credits & Grades
            </CardTitle>
            {!isLoadingCredits && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setCreditsFetched(false);
                  fetchCreditsFromVTU();
                }}
                className="text-xs md:text-sm"
              >
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Refresh Credits
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {subjects.map((subject, index) => (
              <div key={index} className="p-3 md:p-4 border rounded-lg space-y-3 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm md:text-base break-words leading-tight">
                      {subject.subjectName || `Subject ${index + 1}`}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Code: {subject.subjectCode}
                    </p>
                  </div>
                  <Badge className={`${getGradeColor(subject.totalMarks)} ml-2 shrink-0 text-xs`}>
                    {getGradeLetter(subject.totalMarks)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
                  <div>
                    <p className="text-gray-600 font-medium mb-1">Internal</p>
                    <p className="font-semibold text-sm md:text-base">{subject.internalMarks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-1">External</p>
                    <p className="font-semibold text-sm md:text-base">{subject.externalMarks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium mb-1">Total</p>
                    <p className="font-semibold text-sm md:text-base">{subject.totalMarks}</p>
                  </div>
                  <div>
                    <Label htmlFor={`credit-${index}`} className="text-gray-600 font-medium text-xs">
                      Credits
                    </Label>
                    <Input
                      id={`credit-${index}`}
                      type="number"
                      min="0"
                      max="10"
                      step="1"
                      value={credits[index] !== undefined ? credits[index] : ''}
                      onChange={(e) => handleCreditChange(index, e.target.value)}
                      placeholder="0"
                      disabled={isLoadingCredits}
                      className="h-8 md:h-10 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm md:text-base font-medium"
              disabled={isLoadingCredits || subjects.length === 0}
            >
              <Calculator className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Calculate SGPA
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

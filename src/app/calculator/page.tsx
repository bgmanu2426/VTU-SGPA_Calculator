'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator as CalculatorIcon, Download, FileText } from "lucide-react";
import { format } from "date-fns";

import CreditInputForm from "@/components/calculator/credit-input-form";
import SGPAResultCard from "@/components/calculator/sgpa-result-card";
import ManualEntryForm from "@/components/calculator/manual-entry-form";
import SGPADownloader from "@/components/calculator/sgpa-downloader";
import { StudentDetails, SubjectDetails } from "@/types";

type SgpaResult = {
  sgpa: number;
  totalCredits: number;
  subjects: (SubjectDetails & {grade: string, grade_points: number, credits: number})[];
}

export default function CalculatorPage() {
  const router = useRouter();
  const [studentData, setStudentData] = useState<{ studentDetails: StudentDetails, subjectDetails: SubjectDetails[] } | null>(null);
  const [subjects, setSubjects] = useState<SubjectDetails[]>([]);
  const [sgpaResult, setSgpaResult] = useState<SgpaResult | null>(null);
  const [mode, setMode] = useState('loading');
  const [showDownloader, setShowDownloader] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('extractedData');
    if (data) {
      const parsedData = JSON.parse(data);
      setStudentData(parsedData);
      setSubjects(parsedData.subjectDetails || []);
      setMode('calculate');
    } else {
      setMode('manual');
    }
  }, []);

  const calculateGrade = (totalMarks: number) => {
    if (totalMarks >= 90) return { grade: 'O', points: 10 };
    if (totalMarks >= 80) return { grade: 'A+', points: 9 };
    if (totalMarks >= 70) return { grade: 'A', points: 8 };
    if (totalMarks >= 60) return { grade: 'B+', points: 7 };
    if (totalMarks >= 55) return { grade: 'B', points: 6 };
    if (totalMarks >= 50) return { grade: 'C', points: 5 };
    if (totalMarks >= 40) return { grade: 'P', points: 4 };
    return { grade: 'F', points: 0 };
  };

  const calculateSGPA = (subjectsWithCredits: (SubjectDetails & {credits: number})[]) => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    const processedSubjects = subjectsWithCredits.map(subject => {
      const { grade, points } = calculateGrade(subject.totalMarks);
      const subjectCredits = parseFloat(String(subject.credits));
      
      if (!isNaN(subjectCredits)) {
        totalCredits += subjectCredits;
        totalGradePoints += points * subjectCredits;
      }
      
      return {
        ...subject,
        grade,
        grade_points: points,
        credits: subjectCredits
      };
    });

    const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    
    return {
      sgpa: Math.round(sgpa * 100) / 100,
      totalCredits,
      subjects: processedSubjects
    };
  };

  const handleCalculate = (subjectsWithCredits: (SubjectDetails & {credits: number})[]) => {
    try {
      const result = calculateSGPA(subjectsWithCredits);
      setSgpaResult(result);
      setSubjects(result.subjects);
    } catch (error) {
      console.error("Error calculating SGPA:", error);
    }
  };

  const handleDownloadClick = () => {
    setShowDownloader(true);
  };

  const handleManualDataProceed = (data: { studentDetails: StudentDetails, subjectDetails: SubjectDetails[] }) => {
    setStudentData(data);
    setSubjects(data.subjectDetails);
    setMode('calculate');
  };

  if (mode === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Calculator...</p>
        </div>
      </div>
    );
  }

  if (mode === 'manual') {
    return <ManualEntryForm onProceed={handleManualDataProceed} />;
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <CalculatorIcon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Found</h2>
              <p className="text-gray-600 mb-6">
                Please upload a marksheet first to use the calculator.
              </p>
              <Button 
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Upload Marksheet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            SGPA Calculator
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Credits are automatically fetched and sometimes may be incorrect. Please verify and edit if needed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <div>
            <CreditInputForm
              subjects={subjects}
              onCalculate={handleCalculate}
              studentData={studentData}
            />
          </div>

          <div className="sticky top-8 self-start">
            {sgpaResult && (
              <div className="space-y-6">
                <SGPAResultCard
                  sgpa={sgpaResult.sgpa}
                  totalCredits={sgpaResult.totalCredits}
                  subjects={sgpaResult.subjects}
                />
                
                <div className="text-center">
                  <Button 
                    onClick={handleDownloadClick}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full sm:w-auto text-base"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download SGPA Marksheet
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {showDownloader && sgpaResult && studentData && (
            <SGPADownloader 
                studentData={studentData}
                subjects={sgpaResult.subjects}
                sgpa={sgpaResult.sgpa}
                totalCredits={sgpaResult.totalCredits}
                onClose={() => setShowDownloader(false)}
            />
        )}
      </div>
    </div>
  );
}

'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator as CalculatorIcon, Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

import CreditInputForm from "@/components/calculator/credit-input-form";
import SGPAResultCard from "@/components/calculator/sgpa-result-card";
import ManualEntryForm from "@/components/calculator/manual-entry-form";
import { StudentDetails, SubjectDetails } from "@/types";

type SgpaResult = {
  sgpa: number;
  totalCredits: number;
  subjects: (SubjectDetails & {grade: string, grade_points: number, credits: number})[];
  percentage: number;
}

export default function CalculatorPage() {
  const router = useRouter();
  const [studentData, setStudentData] = useState<{ studentDetails: StudentDetails, subjectDetails: SubjectDetails[] } | null>(null);
  const [subjects, setSubjects] = useState<SubjectDetails[]>([]);
  const [sgpaResult, setSgpaResult] = useState<SgpaResult | null>(null);
  const [mode, setMode] = useState('loading');

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
    let totalMarksObtained = 0;
    let maxTotalMarks = 0;


    const processedSubjects = subjectsWithCredits.map(subject => {
      const { grade, points } = calculateGrade(subject.totalMarks);
      const subjectCredits = parseFloat(String(subject.credits));
      
      if (!isNaN(subjectCredits)) {
        totalCredits += subjectCredits;
        totalGradePoints += points * subjectCredits;
      }
      
      totalMarksObtained += subject.totalMarks;
      // Assuming max marks for each subject is 100
      maxTotalMarks += 100;
      
      return {
        ...subject,
        grade,
        grade_points: points,
        credits: subjectCredits
      };
    });

    const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    const percentage = maxTotalMarks > 0 ? (totalMarksObtained / maxTotalMarks) * 100 : 0;
    
    return {
      sgpa: Math.round(sgpa * 100) / 100,
      totalCredits,
      subjects: processedSubjects,
      percentage: Math.round(percentage * 100) / 100
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

  const handleManualDataProceed = (data: { studentDetails: StudentDetails, subjectDetails: SubjectDetails[] }) => {
    setStudentData(data);
    setSubjects(data.subjectDetails);
    setMode('calculate');
  };

  const generateSGPAMarksheet = async () => {
    if (!sgpaResult || !studentData) return;

    const { sgpa, subjects, totalCredits } = sgpaResult;

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = 0;

    const vtuBlue = [30, 58, 138];
    const sgpaOrange = [255, 165, 0];
    const darkGray = [55, 65, 81];
    const lightGray = [156, 163, 175];

    const getSGPAGrade = (sgpaVal: number) => {
      if (sgpaVal >= 9.5) return "Outstanding";
      if (sgpaVal >= 8.5) return "Excellent";
      if (sgpaVal >= 7.5) return "Very Good";
      if (sgpaVal >= 6.5) return "Good";
      if (sgpaVal >= 5.5) return "Above Average";
      if (sgpaVal >= 4.5) return "Average";
      if (sgpaVal >= 4.0) return "Pass";
      return "Fail";
    };

    const getShortBranchName = (branchName: string | undefined) => {
      if (!branchName) return '';
      const name = branchName.toLowerCase().trim();
      const mappings: {[key: string]: string} = {
        'electronics and communication engineering': 'ECE',
        'computer science and engineering': 'CSE',
        'information science and engineering': 'ISE',
        'civil engineering': 'Civil',
        'electronics and instrumentation engineering': 'EIE',
        'electrical and electronics engineering': 'EEE',
        'mechanical engineering': 'ME',
        'industrial and production engineering': 'I&PE',
        'robotics and artificial intelligence': 'R&AI',
        'artificial intelligence and machine learning': 'AI&ML',
        'artificial intelligence and data science': 'AI&DS',
      };

      for (const fullName in mappings) {
        if (name.includes(fullName)) {
          return mappings[fullName];
        }
      }
      
      if(name.length < 10) return branchName.toUpperCase();
      return branchName;
    };

    const addHeader = (pageNum: number) => {
      doc.setFillColor(vtuBlue[0], vtuBlue[1], vtuBlue[2]);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('VISVESVARAYA TECHNOLOGICAL UNIVERSITY', pageWidth / 2, 18, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.text('Belagavi, Karnataka - 590018', pageWidth / 2, 28, { align: 'center' });
      doc.text('SEMESTER GRADE POINT AVERAGE (SGPA) STATEMENT', pageWidth / 2, 36, { align: 'center' });

      yPos = 55;
    };

    const addFooter = (pageNum: number, totalPages: number) => {
      const footerY = pageHeight - 25;
      doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY, pageWidth - margin, footerY);

      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, footerY + 8, { align: 'center' });
      doc.text('This is a computer-generated statement and does not require a signature.', margin, footerY + 14);

      doc.setTextColor(vtuBlue[0], vtuBlue[1], vtuBlue[2]);
      (doc as any).textWithLink('Made by @bgmanu', margin, footerY + 20, { url: 'https://lnbg.in/' });
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text(`(Generated on ${format(new Date(), 'dd MMMM yyyy, HH:mm')})`, margin + 30, footerY + 20);
    };

    addHeader(1);

    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('STUDENT INFORMATION', margin, yPos);
    
    yPos += 8;
    doc.setDrawColor(vtuBlue[0], vtuBlue[1], vtuBlue[2]);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 35);
    
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 35, 'F');
    
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    
    doc.text('Student Name:', margin + 5, yPos + 10);
    doc.setFont(undefined, 'normal');
    doc.text(studentData.studentDetails.name, margin + 40, yPos + 10);
    
    doc.setFont(undefined, 'bold');
    doc.text('USN:', margin + 5, yPos + 18);
    doc.setFont(undefined, 'normal');
    doc.text(studentData.studentDetails.usn, margin + 40, yPos + 18);
    
    doc.setFont(undefined, 'bold');
    doc.text('Date:', margin + 5, yPos + 26);
    doc.setFont(undefined, 'normal');
    doc.text(format(new Date(), 'dd/MM/yyyy'), margin + 40, yPos + 26);
    
    doc.setFont(undefined, 'bold');
    doc.text('Branch:', margin + 105, yPos + 18);
    doc.setFont(undefined, 'normal');
    doc.text(getShortBranchName(studentData.studentDetails.branch) || 'Not specified', margin + 135, yPos + 18);
    
    const sgpaBoxWidth = 50;
    const sgpaBoxHeight = 12;
    const sgpaBoxX = margin + 105;
    const sgpaBoxY = yPos + 22;
    
    doc.setFillColor(sgpaOrange[0], sgpaOrange[1], sgpaOrange[2]);
    doc.roundedRect(sgpaBoxX, sgpaBoxY, sgpaBoxWidth, sgpaBoxHeight, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`SGPA: ${sgpa}`, sgpaBoxX + sgpaBoxWidth/2, sgpaBoxY + 8, { align: 'center' });
    
    yPos += 45;

    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SUBJECT-WISE PERFORMANCE', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    const tableHeaders = ['Code', 'Subject Name', 'IA', 'EA', 'Total', 'Credits', 'Grade'];
    const colWidths = [20, 85, 12, 12, 13, 15, 13];
    const colPositions = [margin + 2];
    
    for (let i = 1; i < colWidths.length; i++) {
      colPositions[i] = colPositions[i-1] + colWidths[i-1];
    }

    const drawTableHeader = () => {
      doc.setFillColor(vtuBlue[0], vtuBlue[1], vtuBlue[2]);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      
      tableHeaders.forEach((header, i) => {
        doc.text(header, colPositions[i], yPos + 6);
      });
      yPos += 10;
    };
    
    drawTableHeader();
    
    subjects.forEach((subject, index) => {
      const maxSubjectNameWidth = colWidths[1] - 4;
      const subjectNameLines = doc.splitTextToSize(subject.subjectName || '', maxSubjectNameWidth);
      const rowHeight = Math.max(8, subjectNameLines.length * 4 + 2);

      if (yPos + rowHeight > pageHeight - 40) {
        addFooter(doc.internal.getNumberOfPages(), (doc as any).internal.getNumberOfPages());
        doc.addPage();
        addHeader(doc.internal.getNumberOfPages());
        drawTableHeader();
      }

      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPos, pageWidth - 2 * margin, rowHeight, 'F');
      }

      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');

      doc.text(subject.subjectCode || '', colPositions[0], yPos + 5);

      subjectNameLines.forEach((line, lineIndex) => {
        doc.text(line, colPositions[1], yPos + 5 + (lineIndex * 3));
      });

      doc.text(String(subject.internalMarks || 0), colPositions[2] + colWidths[2]/2, yPos + 5, { align: 'center' });
      doc.text(String(subject.externalMarks || 0), colPositions[3] + colWidths[3]/2, yPos + 5, { align: 'center' });
      doc.text(String(subject.totalMarks || 0), colPositions[4] + colWidths[4]/2, yPos + 5, { align: 'center' });
      doc.text(String(subject.credits || 0), colPositions[5] + colWidths[5]/2, yPos + 5, { align: 'center' });
      doc.text(subject.grade || 'F', colPositions[6] + colWidths[6]/2, yPos + 5, { align: 'center' });
      
      yPos += rowHeight;
    });
    
    yPos += 2;
    doc.setFillColor(vtuBlue[0], vtuBlue[1], vtuBlue[2]);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    
    const totalIA = subjects.reduce((sum, subject) => sum + (subject.internalMarks || 0), 0);
    const totalEA = subjects.reduce((sum, subject) => sum + (subject.externalMarks || 0), 0);
    const totalMarksScored = subjects.reduce((sum, subject) => sum + (subject.totalMarks || 0), 0);
    const totalCreditsEarned = subjects.reduce((sum, subject) => sum + (subject.credits || 0), 0);
    
    doc.text('TOTAL', colPositions[0], yPos + 6);
    doc.text(String(totalIA), colPositions[2] + colWidths[2]/2, yPos + 6, { align: 'center' });
    doc.text(String(totalEA), colPositions[3] + colWidths[3]/2, yPos + 6, { align: 'center' });
    doc.text(String(totalMarksScored), colPositions[4] + colWidths[4]/2, yPos + 6, { align: 'center' });
    doc.text(String(totalCreditsEarned), colPositions[5] + colWidths[5]/2, yPos + 6, { align: 'center' });
    
    yPos += 15;
    
    if (yPos + 40 > pageHeight - 40) {
      addFooter(doc.internal.getNumberOfPages(), (doc as any).internal.getNumberOfPages());
      doc.addPage();
      addHeader(doc.internal.getNumberOfPages());
    }

    yPos += 10;
    doc.setDrawColor(vtuBlue[0], vtuBlue[1], vtuBlue[2]);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 30);
    
    doc.setFillColor(239, 246, 255);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 30, 'F');
    
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('CALCULATION SUMMARY', pageWidth / 2, yPos + 8, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Credits Earned: ${totalCreditsEarned}`, margin + 10, yPos + 18);
    doc.text(`Total Subjects: ${subjects.length}`, margin + 10, yPos + 24);
    
    doc.setFont(undefined, 'bold');
    doc.text(`SGPA: ${sgpa}`, margin + 95, yPos + 18);
    doc.setFont(undefined, 'normal');
    doc.text(`(${getSGPAGrade(sgpa)})`, margin + 95, yPos + 24);
    
    yPos += 40;
    if (yPos + 50 > pageHeight - 40) {
      addFooter(doc.internal.getNumberOfPages(), (doc as any).internal.getNumberOfPages());
      doc.addPage();
      addHeader(doc.internal.getNumberOfPages());
      yPos = 60;
    }
    
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('VTU GRADING SCALE', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setDrawColor(vtuBlue[0], vtuBlue[1], vtuBlue[2]);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 32);
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 32, 'F');
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    
    const grades = [
      ['90-100: O (10)', '80-89: A+ (9)', '70-79: A (8)', '60-69: B+ (7)'],
      ['55-59: B (6)', '50-54: C (5)', '40-49: P (4)', '0-39: F (0)']
    ];
    
    grades.forEach((row, rowIndex) => {
      row.forEach((grade, colIndex) => {
        const xPos = margin + 10 + (colIndex * 40);
        const yOffset = yPos + 10 + (rowIndex * 8);
        doc.text(grade, xPos, yOffset);
      });
    });
    
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i, totalPages);
    }
    
    doc.save(`${studentData.studentDetails.name}_${studentData.studentDetails.usn}_SGPA_${sgpa}.pdf`);
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
                  percentage={sgpaResult.percentage}
                />
                
                <div className="text-center">
                  <Button 
                    onClick={generateSGPAMarksheet}
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
      </div>
    </div>
  );
}

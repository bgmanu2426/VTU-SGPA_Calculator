'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, X, FileText } from "lucide-react";
import { format } from "date-fns";
import { StudentDetails, SubjectDetails } from "@/types";

type SGPADownloaderProps = {
    studentData: { studentDetails: StudentDetails, subjectDetails: (SubjectDetails & { grade: string, grade_points: number, credits: number })[]};
    subjects: (SubjectDetails & { grade: string, grade_points: number, credits: number })[];
    sgpa: number;
    totalCredits: number;
    onClose: () => void;
}

export default function SGPADownloader({ studentData, subjects, sgpa, totalCredits, onClose }: SGPADownloaderProps) {
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

  const generateSGPAMarksheet = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = 0;

    const vtuBlue = [30, 58, 138];
    const sgpaOrange = [255, 165, 0];
    const darkGray = [55, 65, 81];
    const lightGray = [156, 163, 175];

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md sm:max-w-lg md:max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              Download SGPA Marksheet
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 md:p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">Official SGPA Marksheet</h3>
              <div className="text-xs md:text-sm text-blue-800 space-y-1">
                <p><strong>Student:</strong> <span className="break-words">{studentData.studentDetails.name}</span></p>
                <p><strong>USN:</strong> {studentData.studentDetails.usn}</p>
                <p><strong>SGPA:</strong> {sgpa} ({getSGPAGrade(sgpa)})</p>
                <p><strong>Total Credits:</strong> {totalCredits}</p>
              </div>
            </div>

            <div className="p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2 text-sm md:text-base">PDF Report Features:</h4>
              <ul className="text-xs md:text-sm text-green-800 space-y-1 list-disc list-inside">
                <li>VTU Official Format & Branding</li>
                <li>Highlighted SGPA Box (Orange)</li>
                <li>Full Subject Names (no truncation)</li>
                <li>Multi-page Support for long marksheets</li>
                <li>Professional Layout & Design</li>
                <li>Complete VTU Grading Scale Reference</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={generateSGPAMarksheet}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm md:text-base py-3"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Official SGPA Marksheet
              </Button>
              <Button variant="outline" onClick={onClose} className="text-sm md:text-base py-3">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

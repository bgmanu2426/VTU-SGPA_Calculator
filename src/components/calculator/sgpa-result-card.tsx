'use client';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, BookOpen, Percent } from "lucide-react";
import { SubjectDetails } from "@/types";

type SGPAResultCardProps = {
    sgpa: number;
    totalCredits: number;
    subjects: (SubjectDetails & { grade: string, grade_points: number, credits: number })[];
}

export default function SGPAResultCard({ sgpa, totalCredits, subjects }: SGPAResultCardProps) {
  const getSGPAGrade = (sgpa: number) => {
    if (sgpa >= 9.5) return { grade: "Outstanding", color: "bg-green-100 text-green-800", icon: Trophy };
    if (sgpa >= 8.5) return { grade: "Excellent", color: "bg-blue-100 text-blue-800", icon: Star };
    if (sgpa >= 7.5) return { grade: "Very Good", color: "bg-purple-100 text-purple-800", icon: Star };
    if (sgpa >= 6.5) return { grade: "Good", color: "bg-yellow-100 text-yellow-800", icon: BookOpen };
    if (sgpa >= 5.5) return { grade: "Above Average", color: "bg-orange-100 text-orange-800", icon: BookOpen };
    return { grade: "Pass / Fail", color: "bg-red-100 text-red-800", icon: BookOpen };
  };

  const sgpaGrade = getSGPAGrade(sgpa);
  const SGPAIcon = sgpaGrade.icon;
  const percentage = sgpa > 0 ? ((sgpa - 0.75) * 10).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl md:text-2xl">
            <SGPAIcon className="w-8 h-8 text-blue-600" />
            SGPA Result
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {sgpa}
              </p>
              <Badge className={`${sgpaGrade.color} text-sm md:text-base px-4 py-1.5`}>
                {sgpaGrade.grade}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 rounded-lg bg-white/50">
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/50">
                <p className="text-sm text-gray-600">Percentage</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                  {percentage}<Percent className="w-5 h-5" />
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Subject Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {subjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm break-words">
                    {subject.subjectName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {subject.subjectCode} • {subject.credits} credits
                  </p>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <Badge variant="secondary" className="mb-1 text-xs">
                    {subject.grade} ({subject.grade_points})
                  </Badge>
                  <p className="text-xs text-gray-600">
                    {subject.totalMarks} marks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

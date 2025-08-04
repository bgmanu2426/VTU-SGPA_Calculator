'use client';
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, Hash, CheckCircle, Edit } from "lucide-react";
import { ExtractMarksheetDataOutput } from "@/ai/flows/extract-marksheet-data";

export default function ExtractedDataPreview({ data, onConfirm, onEdit }: { data: ExtractMarksheetDataOutput, onConfirm: () => void, onEdit: () => void }) {
  return (
    <div className="space-y-6">
      {/* Student Information */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 text-base md:text-lg">
            <User className="w-5 h-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Student Name</p>
              <p className="font-semibold text-gray-900 text-base break-words">{data.studentDetails.name || 'Not detected'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">USN</p>
              <p className="font-semibold text-gray-900 text-base">{data.studentDetails.usn || 'Not detected'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Semester</p>
              <p className="font-semibold text-gray-900 text-base">{data.studentDetails.semester || 'Not detected'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Branch</p>
              <p className="font-semibold text-gray-900 text-base">{data.studentDetails.branch || 'Not detected'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Subjects Detected
            <Badge variant="secondary" className="ml-2">
              {data.subjectDetails?.length || 0} subjects
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.subjectDetails && data.subjectDetails.length > 0 ? (
            <div className="space-y-3">
              {data.subjectDetails.map((subject, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-medium text-gray-900 text-base break-words">
                        {subject.subjectName || `Subject ${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {subject.subjectCode || 'Code not detected'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Internal</p>
                      <p className="font-medium">{subject.internalMarks || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">External</p>
                      <p className="font-medium">{subject.externalMarks || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-medium">{subject.totalMarks || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-base">No subjects detected. Please try uploading a clearer image.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row-reverse gap-3">
        <Button 
          onClick={onConfirm}
          className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto text-base py-3"
          disabled={!data.subjectDetails || data.subjectDetails.length === 0}
        >
          <CheckCircle className="w-5 h-5" />
          Proceed to Calculator
        </Button>
        <Button 
          variant="outline" 
          onClick={onEdit}
          className="flex items-center justify-center gap-2 w-full sm:w-auto text-base py-3"
        >
          <Edit className="w-5 h-5" />
          Upload Different Image
        </Button>
      </div>
    </div>
  );
}

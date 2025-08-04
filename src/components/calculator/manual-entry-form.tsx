'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, BookOpen, Plus, Trash2, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StudentDetails, SubjectDetails } from "@/types";

const initialSubject = {
  subjectCode: "",
  subjectName: "",
  internalMarks: 0,
  externalMarks: 0,
  totalMarks: 0,
};

type ManualEntryFormProps = {
    onProceed: (data: { studentDetails: StudentDetails, subjectDetails: SubjectDetails[] }) => void
}

export default function ManualEntryForm({ onProceed }: ManualEntryFormProps) {
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    usn: "",
    branch: "",
    semester: "",
  });
  const [subjects, setSubjects] = useState([{ ...initialSubject }]);
  const [error, setError] = useState<string | null>(null);

  const handleStudentDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentDetails(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubjectChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSubjects = [...subjects];
    (newSubjects[index] as any)[name] = value;
    
    if (name === 'internalMarks' || name === 'externalMarks') {
      const internal = parseFloat(String(newSubjects[index].internalMarks)) || 0;
      const external = parseFloat(String(newSubjects[index].externalMarks)) || 0;
      newSubjects[index].totalMarks = internal + external;
    }

    setSubjects(newSubjects);
    setError(null);
  };

  const addSubject = () => {
    setSubjects([...subjects, { ...initialSubject }]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
    }
  };

  const validateForm = () => {
    if (!studentDetails.name.trim()) {
      return "Student name is required";
    }
    if (!studentDetails.usn.trim()) {
      return "USN is required";
    }
    if (subjects.length === 0) {
      return "At least one subject is required";
    }
    
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      if (!subject.subjectName.trim()) {
        return `Subject name is required for subject ${i + 1}`;
      }
      if (!subject.subjectCode.trim()) {
        return `Subject code is required for subject ${i + 1}`;
      }
      if (subject.totalMarks < 0 || subject.totalMarks > 150) {
        return `Invalid total marks for subject ${i + 1}`;
      }
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const cleanedData = {
      studentDetails: {
        ...studentDetails,
        name: studentDetails.name.trim(),
        usn: studentDetails.usn.trim(),
        branch: studentDetails.branch.trim() || "Not specified",
        semester: studentDetails.semester.trim() || "Not specified",
      },
      subjectDetails: subjects.map(subject => ({
        ...subject,
        subjectCode: subject.subjectCode.trim(),
        subjectName: subject.subjectName.trim(),
        internalMarks: parseFloat(String(subject.internalMarks)) || 0,
        externalMarks: parseFloat(String(subject.externalMarks)) || 0,
        totalMarks: parseFloat(String(subject.totalMarks)) || 0
      }))
    };

    onProceed(cleanedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Manual Marksheet Entry
          </h1>
          <p className="text-lg text-gray-600">
            Enter your student details and subject marks manually
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
                <User className="w-5 h-5" />
                Student Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={studentDetails.name} 
                  onChange={handleStudentDetailChange} 
                  placeholder="Enter full name"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usn">USN *</Label>
                <Input 
                  id="usn" 
                  name="usn" 
                  value={studentDetails.usn} 
                  onChange={handleStudentDetailChange} 
                  placeholder="e.g., 1RV21CS001"
                  required 
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input 
                  id="semester" 
                  name="semester" 
                  value={studentDetails.semester} 
                  onChange={handleStudentDetailChange} 
                  placeholder="e.g., 3rd Semester"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input 
                  id="branch" 
                  name="branch" 
                  value={studentDetails.branch} 
                  onChange={handleStudentDetailChange} 
                  placeholder="e.g., Computer Science"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
                  <BookOpen className="w-5 h-5" />
                  Subject Marks
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addSubject}>
                  <Plus className="w-4 h-4 mr-2" /> Add Subject
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((subject, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`subjectName-${index}`}>Subject Name *</Label>
                      <Input 
                        id={`subjectName-${index}`} 
                        name="subjectName" 
                        value={subject.subjectName} 
                        onChange={(e) => handleSubjectChange(index, e)} 
                        placeholder="e.g., Data Structures"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`subjectCode-${index}`}>Subject Code *</Label>
                      <Input 
                        id={`subjectCode-${index}`} 
                        name="subjectCode" 
                        value={subject.subjectCode} 
                        onChange={(e) => handleSubjectChange(index, e)} 
                        placeholder="e.g., 18CS32"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`internalMarks-${index}`}>Internal Marks</Label>
                      <Input 
                        id={`internalMarks-${index}`} 
                        name="internalMarks" 
                        type="number" 
                        min="0" 
                        max="50"
                        value={subject.internalMarks} 
                        onChange={(e) => handleSubjectChange(index, e)} 
                        placeholder="0-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`externalMarks-${index}`}>External Marks</Label>
                      <Input 
                        id={`externalMarks-${index}`} 
                        name="externalMarks" 
                        type="number" 
                        min="0" 
                        max="100"
                        value={subject.externalMarks} 
                        onChange={(e) => handleSubjectChange(index, e)} 
                        placeholder="0-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Marks</Label>
                      <div className="h-10 flex items-center px-3 bg-gray-100 rounded-md">
                        <span className="font-medium">{subject.totalMarks}</span>
                      </div>
                    </div>
                  </div>
                  
                  {subjects.length > 1 && (
                    <div className="flex justify-end pt-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeSubject(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="text-center">
            <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              Proceed to Calculate SGPA <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

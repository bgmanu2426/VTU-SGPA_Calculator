import type { ExtractMarksheetDataOutput } from '@/ai/flows/extract-marksheet-data';

export type StudentDetails = ExtractMarksheetDataOutput['studentDetails'];

export type SubjectDetails = ExtractMarksheetDataOutput['subjectDetails'][0];

export type ValidatedSubject = SubjectDetails & { credits: number };

export type ValidatedData = {
  studentDetails: StudentDetails;
  subjectDetails: ValidatedSubject[];
};

export type SgpaResults = {
  sgpa: number;
  percentage: number;
};

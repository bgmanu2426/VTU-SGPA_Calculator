import type { ValidatedSubject } from '@/types';

export function getGradePoint(totalMarks: number): number {
  if (totalMarks >= 90 && totalMarks <=100) return 10;
  if (totalMarks >= 80 && totalMarks <=89) return 9;
  if (totalMarks >= 70 && totalMarks <=79) return 8;
  if (totalMarks >= 60 && totalMarks <=69) return 7;
  if (totalMarks >= 55 && totalMarks <=59) return 6;
  if (totalMarks >= 50 && totalMarks <=54) return 5;
  if (totalMarks >= 40 && totalMarks <=49) return 4;
  if (totalMarks >= 0 && totalMarks <=39) return 0;
  return 0;
}

export function getGrade(totalMarks: number): string {
  if (totalMarks >= 90 && totalMarks <=100) return "O";
  if (totalMarks >= 80 && totalMarks <=89) return 'A+';
  if (totalMarks >= 70 && totalMarks <=79) return 'A';
  if (totalMarks >= 60 && totalMarks <=69) return 'B+';
  if (totalMarks >= 55 && totalMarks <=59) return 'B';
  if (totalMarks >= 50 && totalMarks <=54) return 'C';
  if (totalMarks >= 40 && totalMarks <=49) return 'P';
  if (totalMarks >= 0 && totalMarks <=39) return 'F';
  return 'Invalid';
}

export function calculateSgpa(subjects: ValidatedSubject[]): number {
  let totalCredits = 0;
  let weightedGradePoints = 0;

  subjects.forEach(subject => {
    if (subject.credits > 0) {
      const gradePoint = getGradePoint(subject.totalMarks);
      totalCredits += subject.credits;
      weightedGradePoints += subject.credits * gradePoint;
    }
  });

  if (totalCredits === 0) return 0;

  const sgpa = weightedGradePoints / totalCredits;
  return parseFloat(sgpa.toFixed(2));
}

export function calculatePercentage(subjects: ValidatedSubject[]): number {
  const sgpa = calculateSgpa(subjects);
  if (sgpa === 0) return 0;
  return parseFloat(((sgpa - 0.75) * 10).toFixed(2));
}

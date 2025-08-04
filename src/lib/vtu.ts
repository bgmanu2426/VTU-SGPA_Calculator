import type { ValidatedSubject } from '@/types';

export function getGradePoint(totalMarks: number): number {
  if (totalMarks > 100) return 10;
  if (totalMarks >= 90) return 10;
  if (totalMarks >= 80) return 9;
  if (totalMarks >= 70) return 8;
  if (totalMarks >= 60) return 7;
  if (totalMarks >= 55) return 6;
  if (totalMarks >= 50) return 5;
  if (totalMarks >= 40) return 4;
  return 0;
}

export function getGrade(totalMarks: number): string {
  if (totalMarks > 100) return "O";
  if (totalMarks >= 90) return 'O';
  if (totalMarks >= 80) return 'A+';
  if (totalMarks >= 70) return 'A';
  if (totalMarks >= 60) return 'B+';
  if (totalMarks >= 55) return 'B';
  if (totalMarks >= 50) return 'C';
  if (totalMarks >= 40) return 'P';
  return 'F';
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

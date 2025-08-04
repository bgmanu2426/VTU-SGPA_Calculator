'use server';

/**
 * @fileOverview Marks extracted data from marksheet and asks user to correct any discrepancies.
 *
 * - validateExtractedData - A function that validates the extracted data and returns a review prompt.
 * - ValidateExtractedDataInput - The input type for the validateExtractedData function.
 * - ValidateExtractedDataOutput - The return type for the validateExtractedData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateExtractedDataInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  usn: z.string().describe('The University Seat Number of the student.'),
  branch: z.string().describe('The branch of the student.'),
  subjectDetails: z.array(
    z.object({
      subjectName: z.string().describe('The name of the subject.'),
      subjectCode: z.string().describe('The code of the subject.'),
      internalMarks: z.number().describe('The internal marks obtained in the subject.'),
      externalMarks: z.number().describe('The external marks obtained in the subject.'),
      totalMarks: z.number().describe('The total marks obtained in the subject.'),
    })
  ).describe('Details of each subject including name, code, and marks.'),
});
export type ValidateExtractedDataInput = z.infer<typeof ValidateExtractedDataInputSchema>;

const ValidateExtractedDataOutputSchema = z.object({
  reviewPrompt: z.string().describe('A prompt asking the user to review the extracted data and correct any discrepancies.'),
});
export type ValidateExtractedDataOutput = z.infer<typeof ValidateExtractedDataOutputSchema>;

export async function validateExtractedData(input: ValidateExtractedDataInput): Promise<ValidateExtractedDataOutput> {
  return validateExtractedDataFlow(input);
}

const validateExtractedDataPrompt = ai.definePrompt({
  name: 'validateExtractedDataPrompt',
  input: {schema: ValidateExtractedDataInputSchema},
  output: {schema: ValidateExtractedDataOutputSchema},
  prompt: `You are an AI assistant that reviews extracted data from a student\'s marksheet.
  Your task is to generate a prompt that asks the user to verify the extracted data, highlighting any potential discrepancies or unclear values.
  The prompt should be clear, concise, and easy to understand.

  Here is the extracted data:

  Student Name: {{{studentName}}}
  USN: {{{usn}}}
  Branch: {{{branch}}}

  Subject Details:
  {{#each subjectDetails}}
  Subject Name: {{{subjectName}}}, Subject Code: {{{subjectCode}}}, Internal Marks: {{{internalMarks}}}, External Marks: {{{externalMarks}}}, Total Marks: {{{totalMarks}}}
  {{/each}}

  Please generate a prompt asking the user to verify the above information and correct any mistakes, if needed.`,
});

const validateExtractedDataFlow = ai.defineFlow(
  {
    name: 'validateExtractedDataFlow',
    inputSchema: ValidateExtractedDataInputSchema,
    outputSchema: ValidateExtractedDataOutputSchema,
  },
  async input => {
    const {output} = await validateExtractedDataPrompt(input);
    return output!;
  }
);

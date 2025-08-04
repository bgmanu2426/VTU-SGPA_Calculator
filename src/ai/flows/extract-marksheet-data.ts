'use server';

/**
 * @fileOverview This file defines a Genkit flow to extract marksheet data from an image.
 *
 * The flow takes an image of a marksheet as input, uses OCR and AI to extract student details,
 * subject details, and marks. It returns a structured object containing the extracted data.
 *
 * @exports extractMarksheetData - The main function to trigger the marksheet data extraction flow.
 * @exports ExtractMarksheetDataInput - The input type for the extractMarksheetData function.
 * @exports ExtractMarksheetDataOutput - The output type for the extractMarksheetData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractMarksheetDataInputSchema = z.object({
  marksheetDataUri: z
    .string()
    .describe(
      "A photo of a marksheet, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractMarksheetDataInput = z.infer<typeof ExtractMarksheetDataInputSchema>;

const ExtractMarksheetDataOutputSchema = z.object({
  studentDetails: z.object({
    name: z.string().describe('The name of the student.'),
    usn: z.string().describe('The University Seat Number of the student.'),
    branch: z.string().describe('The branch of study of the student.'),
  }),
  subjectDetails: z.array(
    z.object({
      subjectName: z.string().describe('The name of the subject.'),
      subjectCode: z.string().describe('The code of the subject.'),
      internalMarks: z.number().describe('The internal marks obtained in the subject.'),
      externalMarks: z.number().describe('The external marks obtained in the subject.'),
      totalMarks: z.number().describe('The total marks obtained in the subject.'),
    })
  ).describe('An array of subject details, including marks.'),
});
export type ExtractMarksheetDataOutput = z.infer<typeof ExtractMarksheetDataOutputSchema>;

export async function extractMarksheetData(input: ExtractMarksheetDataInput): Promise<ExtractMarksheetDataOutput> {
  return extractMarksheetDataFlow(input);
}

const extractMarksheetDataPrompt = ai.definePrompt({
  name: 'extractMarksheetDataPrompt',
  input: {schema: ExtractMarksheetDataInputSchema},
  output: {schema: ExtractMarksheetDataOutputSchema},
  prompt: `You are an AI assistant specialized in extracting data from marksheets.
  Given an image of a marksheet, extract the following information:

  - Student Details: Name, USN, Branch
  - Subject Details: Subject Name, Subject Code, Internal Marks, External Marks, Total Marks

  Marksheet Image: {{media url=marksheetDataUri}}

  Ensure that all extracted data is accurate and properly formatted.
  Return the data in JSON format.
  Follow this schema: ${JSON.stringify(ExtractMarksheetDataOutputSchema.shape, null, 2)}
  `,
});

const extractMarksheetDataFlow = ai.defineFlow(
  {
    name: 'extractMarksheetDataFlow',
    inputSchema: ExtractMarksheetDataInputSchema,
    outputSchema: ExtractMarksheetDataOutputSchema,
  },
  async input => {
    const {output} = await extractMarksheetDataPrompt(input);
    return output!;
  }
);

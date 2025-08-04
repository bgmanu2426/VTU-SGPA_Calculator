'use server';

/**
 * @fileOverview This file defines a Genkit flow to fetch subject credits from the internet.
 *
 * The flow takes a list of subject codes as input, searches for official VTU credit values,
 * and returns a mapping of subject codes to their corresponding credits.
 *
 * @exports fetchCredits - The main function to trigger the credit fetching flow.
 * @exports FetchCreditsInput - The input type for the fetchCredits function.
 * @exports FetchCreditsOutput - The output type for the fetchCredits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchCreditsInputSchema = z.object({
  subjectCodes: z.array(z.string()).describe('An array of VTU subject codes.'),
});
export type FetchCreditsInput = z.infer<typeof FetchCreditsInputSchema>;

const FetchCreditsOutputSchema = z.object({
  credits: z
    .record(z.string(), z.number())
    .describe(
      'A mapping of subject codes to their corresponding credit values.'
    ),
});
export type FetchCreditsOutput = z.infer<typeof FetchCreditsOutputSchema>;

export async function fetchCredits(input: FetchCreditsInput): Promise<FetchCreditsOutput> {
  return fetchCreditsFlow(input);
}

const fetchCreditsPrompt = ai.definePrompt({
  name: 'fetchCreditsPrompt',
  input: {schema: FetchCreditsInputSchema},
  output: {schema: FetchCreditsOutputSchema},
  prompt: `You are an AI assistant specialized in searching for academic information.
    Your task is to find the official credit values for a list of Visvesvaraya Technological University (VTU) subject codes.

    Search the internet for official VTU curriculum documents, scheme of instruction, or syllabus for the following subject codes:
    {{#each subjectCodes}}
    - {{{this}}}
    {{/each}}

    For each subject code, provide the credit value. If a value cannot be found online, use these common VTU patterns as a fallback:
    - Theory subjects (usually end in 1, 2, 3, 4, 5): 3-4 credits
    - Lab subjects (often contain 'L' or end in 6, 7, 8): 1-2 credits
    - Project work/internship: 4-10 credits
    - Mathematics subjects: 3-4 credits

    Return the data as a JSON object mapping each subject code to its credit value.
    Follow this schema: ${JSON.stringify(FetchCreditsOutputSchema.shape, null, 2)}
    `,
});

const fetchCreditsFlow = ai.defineFlow(
  {
    name: 'fetchCreditsFlow',
    inputSchema: FetchCreditsInputSchema,
    outputSchema: FetchCreditsOutputSchema,
  },
  async input => {
    const {output} = await fetchCreditsPrompt(input);
    return output!;
  }
);

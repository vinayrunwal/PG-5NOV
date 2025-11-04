'use server';
/**
 * @fileOverview A chatbot flow for answering frequently asked questions.
 *
 * - answerFaqQuestion - A function that answers a user's question based on FAQ data.
 * - AnswerFaqQuestionInput - The input type for the answerFaqQuestion function.
 * - AnswerFaqQuestionOutput - The return type for the answerFaqQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFaqQuestionInputSchema = z.object({
  question: z.string().describe("The user's question."),
  context: z.string().describe('A string containing all the FAQs (questions and answers) to use as context.'),
});
export type AnswerFaqQuestionInput = z.infer<typeof AnswerFaqQuestionInputSchema>;

const AnswerFaqQuestionOutputSchema = z.object({
  answer: z
    .string()
    .describe('A helpful and concise answer to the user\'s question, based on the provided context.'),
});
export type AnswerFaqQuestionOutput = z.infer<typeof AnswerFaqQuestionOutputSchema>;

export async function answerFaqQuestion(
  input: AnswerFaqQuestionInput
): Promise<AnswerFaqQuestionOutput> {
  return faqChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqChatbotPrompt',
  input: {schema: AnswerFaqQuestionInputSchema},
  output: {schema: AnswerFaqQuestionOutputSchema},
  prompt: `You are a friendly and helpful customer support assistant for RoomVerse, a co-living and rental platform.

  Your goal is to answer the user's question based *only* on the provided FAQ context.

  If the answer is in the context, provide it clearly and concisely.
  If the answer is not in the context, politely state that you don't have the information and suggest they contact support. Do not make up answers.

  Here is the FAQ context:
  ---
  {{{context}}}
  ---

  User's question: "{{{question}}}"
  `,
});

const faqChatbotFlow = ai.defineFlow(
  {
    name: 'faqChatbotFlow',
    inputSchema: AnswerFaqQuestionInputSchema,
    outputSchema: AnswerFaqQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

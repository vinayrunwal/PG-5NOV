'use server';

import {
  generatePropertyDescription,
  type GeneratePropertyDescriptionInput,
} from '@/ai/flows/generate-property-description';
import {
  answerFaqQuestion,
  type AnswerFaqQuestionInput,
} from '@/ai/flows/faq-chatbot';
import { z } from 'zod';
import { faqs } from '@/lib/data';

const generateDescriptionSchema = z.object({
  propertyType: z.string().min(1, { message: 'Property type is required.' }),
  location: z.string().min(1, { message: 'Location is required.' }),
  amenities: z.string().min(1, { message: 'At least one amenity is required.' }),
});

export async function handleGenerateDescription(
  data: GeneratePropertyDescriptionInput
) {
  const parsed = generateDescriptionSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid input. Please provide property type, location, and amenities.',
    };
  }

  try {
    const result = await generatePropertyDescription(parsed.data);
    return { success: true, description: result.description };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'Failed to generate description. Please try again.',
    };
  }
}

const answerFaqSchema = z.object({
  question: z.string().min(1, { message: 'Question cannot be empty.' }),
});

export async function handleFaqQuestion(
  data: AnswerFaqQuestionInput
) {
  const parsed = answerFaqSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid input. Please provide a question.',
    };
  }
  
  const context = faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');

  try {
    const result = await answerFaqQuestion({ ...parsed.data, context });
    return { success: true, answer: result.answer };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'Failed to get an answer. Please try again.',
    };
  }
}

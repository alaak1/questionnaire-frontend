export type QuestionType = 'text' | 'mcq' | 'checkbox' | 'rating';

export interface Question {
  id: string;
  questionnaire_id?: string;
  question_text: string;
  type: QuestionType;
  options?: string[] | null;
  order_index: number;
}

import { Question } from './question.model';

export interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  questions?: Question[];
}

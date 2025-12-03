import { Question } from './question.model';

export interface Questionnaire {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  questions?: Question[];
  admin_id?: string | null;
  is_legacy?: boolean;
  version_number?: number;
}

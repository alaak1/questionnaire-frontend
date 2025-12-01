import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Questionnaire } from '../models/questionnaire.model';
import { Answer } from '../models/answer.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuestionnaireService {
  questionnaires = signal<Questionnaire[]>([]);
  selected = signal<Questionnaire | null>(null);

  constructor(private api: ApiService) {}

  fetchAll() {
    return this.api.get<Questionnaire[]>('/admin/questionnaires').pipe(
      tap((list) => this.questionnaires.set(list))
    );
  }

  fetchOne(id: string) {
    return this.api.get<Questionnaire>(`/admin/questionnaires/${id}`).pipe(
      tap((q) => this.selected.set(q))
    );
  }

  create(payload: Partial<Questionnaire>) {
    return this.api.post<Questionnaire>('/admin/questionnaires', payload);
  }

  update(id: string, payload: Partial<Questionnaire>) {
    return this.api.put<Questionnaire>(`/admin/questionnaires/${id}`, payload);
  }

  delete(id: string) {
    return this.api.delete(`/admin/questionnaires/${id}`);
  }

  getPublic(id: string) {
    return this.api.get<{ questionnaire: Questionnaire; questions: any[] }>(`/q/${id}`);
  }

  startSession(id: string, body: any) {
    return this.api.post<{ sessionId: string; user: any }>(`/q/${id}/start`, body);
  }

  submitAnswers(id: string, body: { sessionId: string; answers: Answer[] }) {
    return this.api.post(`/q/${id}/submit`, body);
  }

  results(id: string) {
    return this.api.get<any>(`/admin/questionnaires/${id}/results`);
  }
}

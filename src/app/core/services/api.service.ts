import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://questionnaire-backend-nu.vercel.app';
  loading = signal(false);

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    const token = this.auth.token();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  get<T>(path: string) {
    this.loading.set(true);
    return this.http.get<T>(`${this.baseUrl}${path}`, { headers: this.headers() });
  }

  post<T>(path: string, body: any) {
    this.loading.set(true);
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.headers() });
  }

  put<T>(path: string, body: any) {
    this.loading.set(true);
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.headers() });
  }

  delete<T>(path: string) {
    this.loading.set(true);
    return this.http.delete<T>(`${this.baseUrl}${path}`, { headers: this.headers() });
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSignal = signal<string | null>(localStorage.getItem('jwt'));
  private refreshSignal = signal<string | null>(localStorage.getItem('refresh'));
  private baseUrl = 'https://questionnaire-backend-nu.vercel.app';

  token = computed(() => this.tokenSignal());
  isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/admin/login`, { email, password }).pipe(
      tap((res) => {
        this.tokenSignal.set(res.accessToken);
        this.refreshSignal.set(res.refreshToken);
        localStorage.setItem('jwt', res.accessToken);
        localStorage.setItem('refresh', res.refreshToken);
      })
    );
  }

  refresh() {
    const ref = this.refreshSignal();
    if (!ref) return this.http.post<LoginResponse>(`${this.baseUrl}/admin/refresh`, {});
    return this.http.post<LoginResponse>(`${this.baseUrl}/admin/refresh`, { refreshToken: ref }).pipe(
      tap((res) => {
        this.tokenSignal.set(res.accessToken);
        this.refreshSignal.set(res.refreshToken);
        localStorage.setItem('jwt', res.accessToken);
        localStorage.setItem('refresh', res.refreshToken);
      })
    );
  }

  logout() {
    this.tokenSignal.set(null);
    this.refreshSignal.set(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('refresh');
  }
}

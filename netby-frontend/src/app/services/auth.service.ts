import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar si hay un usuario autenticado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simular autenticación (en una app real, esto sería una llamada HTTP)
      setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
          const user: User = {
            id: 1,
            username: 'admin',
            email: 'admin@example.com'
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000); // Simular delay de red
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}

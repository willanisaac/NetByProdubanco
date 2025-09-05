import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  
  credentials = {
    username: '',
    password: ''
  };
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      const success = await this.authService.login(
        this.credentials.username,
        this.credentials.password
      );
      
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Transaction, TransactionFormData } from '../models/movement.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:5009/api/Transactions';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las transacciones desde la API
   */
  getTransactions(): Observable<Transaction[]> {
    console.log('getTransactions', this.apiUrl);
    return this.http.get<Transaction[]>(this.apiUrl)
      .pipe(
        retry(2), // Reintentar 2 veces en caso de error
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene una transacción por ID
   */
  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * Crea una nueva transacción
   */
  createTransaction(transaction: TransactionFormData): Observable<Transaction> {
    console.log('createTransaction', this.apiUrl, transaction);
    return this.http.post<Transaction>(this.apiUrl, transaction)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza una transacción existente
   */
  updateTransaction(id: string, transaction: TransactionFormData): Observable<Transaction> {
    console.log('updateTransaction', `${this.apiUrl}/${id}`, transaction);
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Elimina una transacción
   */
  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Maneja los errores de la API
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 404:
          errorMessage = 'Transacción no encontrada';
          break;
        case 400:
          errorMessage = 'Datos inválidos enviados al servidor';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifica que la API esté ejecutándose.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Error en TransactionService:', error);
    return throwError(() => new Error(errorMessage));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7298/api/Products';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos desde la API
   */
  getProducts(): Observable<Product[]> {
    console.log('getProducts', this.apiUrl);
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(
        retry(2), // Reintentar 2 veces en caso de error
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un producto por ID
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * Crea un nuevo producto
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    console.log('createProduct', this.apiUrl, product);
    return this.http.post<Product>(this.apiUrl, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza un producto existente
   */
  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    console.log('updateProduct', `${this.apiUrl}/${id}`, product.id);
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Elimina un producto
   */
  deleteProduct(id: string): Observable<void> {
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
          errorMessage = 'Producto no encontrado';
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
    
    console.error('Error en ProductService:', error);
    return throwError(() => new Error(errorMessage));
  }
}

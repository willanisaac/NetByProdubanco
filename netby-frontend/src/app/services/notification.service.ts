import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private notificationId = 0;

  constructor() {}

  /**
   * Muestra una notificación de éxito
   */
  showSuccess(message: string, duration: number = 5000) {
    this.addNotification({
      id: this.generateId(),
      type: 'success',
      message,
      duration
    });
  }

  /**
   * Muestra una notificación de error
   */
  showError(message: string, duration: number = 7000) {
    this.addNotification({
      id: this.generateId(),
      type: 'error',
      message,
      duration
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  showWarning(message: string, duration: number = 6000) {
    this.addNotification({
      id: this.generateId(),
      type: 'warning',
      message,
      duration
    });
  }

  /**
   * Muestra una notificación informativa
   */
  showInfo(message: string, duration: number = 5000) {
    this.addNotification({
      id: this.generateId(),
      type: 'info',
      message,
      duration
    });
  }

  /**
   * Agrega una notificación a la lista
   */
  private addNotification(notification: Notification) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-remover la notificación después del tiempo especificado
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  /**
   * Remueve una notificación por ID
   */
  removeNotification(id: string) {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  /**
   * Limpia todas las notificaciones
   */
  clearAll() {
    this.notificationsSubject.next([]);
  }

  /**
   * Genera un ID único para la notificación
   */
  private generateId(): string {
    return `notification-${++this.notificationId}-${Date.now()}`;
  }
}

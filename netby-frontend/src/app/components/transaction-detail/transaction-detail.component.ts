import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/movement.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {
  @Input() isOpen = false;
  @Input() transaction: Transaction | null = null;
  @Input() products: Product[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Transaction>();
  @Output() delete = new EventEmitter<Transaction>();

  constructor() {}

  ngOnInit() {}

  closeModal() {
    this.isOpen = false;
    this.close.emit();
  }

  onEdit() {
    this.edit.emit(this.transaction!);
    this.closeModal();
  }

  onDelete() {
    if (confirm('¿Estás seguro de eliminar esta transacción?')) {
      this.delete.emit(this.transaction!);
      this.closeModal();
    }
  }

  getProductName(productId: string): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
  }

  getProductCategory(productId: string): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.category : 'Categoría no encontrada';
  }

  getTransactionTypeLabel(type: string | null): string {
    const typeMap: { [key: string]: string } = {
      'entry': 'Entrada',
      'exit': 'Salida',
      'adjustment': 'Ajuste',
      'transfer': 'Transferencia'
    };
    return type ? (typeMap[type] || type) : 'No especificado';
  }

  getTransactionTypeClass(type: string | null): string {
    const classMap: { [key: string]: string } = {
      'entry': 'type-entry',
      'exit': 'type-exit',
      'adjustment': 'type-adjustment',
      'transfer': 'type-transfer'
    };
    return type ? (classMap[type] || 'type-default') : 'type-default';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

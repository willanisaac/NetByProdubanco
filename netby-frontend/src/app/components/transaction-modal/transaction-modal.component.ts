import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction, TransactionFormData } from '../../models/movement.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.css']
})
export class TransactionModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() transaction: Transaction | null = null;
  @Input() products: Product[] = [];
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TransactionFormData>();

  isEditMode = false;
  formData: TransactionFormData = {
    date: new Date().toISOString().slice(0, 16), // Formato para input datetime-local
    type: '',
    productId: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    detail: ''
  };
  errorMessage = '';

  // Tipos de transacción disponibles
  transactionTypes = [
    { value: 'entry', label: 'Entrada' },
    { value: 'exit', label: 'Salida' },
    { value: 'adjustment', label: 'Ajuste' },
    { value: 'transfer', label: 'Transferencia' }
  ];

  ngOnInit() {
    this.isEditMode = !!this.transaction;
    if (this.transaction) {
      this.formData = {
        id: this.transaction.id,
        date: new Date(this.transaction.date).toISOString().slice(0, 16),
        type: this.transaction.type || '',
        productId: this.transaction.productId,
        quantity: this.transaction.quantity,
        unitPrice: this.transaction.unitPrice,
        totalPrice: this.transaction.totalPrice,
        detail: this.transaction.detail || ''
      };
    }
  }

  closeModal() {
    this.isOpen = false;
    this.close.emit();
  }

  onSubmit() {
    if (this.isLoading) return;
    
    // Validaciones
    if (!this.formData.type) {
      this.errorMessage = 'El tipo de transacción es requerido';
      return;
    }
    
    if (!this.formData.productId) {
      this.errorMessage = 'Debe seleccionar un producto';
      return;
    }
    
    if (this.formData.quantity <= 0) {
      this.errorMessage = 'La cantidad debe ser mayor a 0';
      return;
    }
    
    if (this.formData.unitPrice < 0) {
      this.errorMessage = 'El precio unitario no puede ser negativo';
      return;
    }

    // Calcular precio total si no está definido
    if (this.formData.totalPrice === 0) {
      this.formData.totalPrice = this.formData.quantity * this.formData.unitPrice;
    }

    this.errorMessage = '';
    this.save.emit(this.formData);
  }

  onQuantityChange() {
    // Recalcular precio total cuando cambia la cantidad
    this.formData.totalPrice = this.formData.quantity * this.formData.unitPrice;
  }

  onUnitPriceChange() {
    // Recalcular precio total cuando cambia el precio unitario
    this.formData.totalPrice = this.formData.quantity * this.formData.unitPrice;
  }

  getProductName(productId: string): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
  }
}

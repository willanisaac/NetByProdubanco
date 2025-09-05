import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() product: Product | null = null;
  @Input() categories: any[] = [];
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ProductFormData>();

  isEditMode = false;
  formData: ProductFormData = {
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    price: 0,
    stock: 0
  };
  errorMessage = '';

  ngOnInit() {
    this.isEditMode = !!this.product;
    if (this.product) {
      this.formData = {
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,
        category: this.product.category,
        imageUrl: this.product.imageUrl,
        price: this.product.price,
        stock: this.product.stock
      };
    }
    
  }

  closeModal() {
    console.log('closeModal()', this.isOpen);
    this.isOpen = false;
    this.close.emit();
  }

  onSubmit() {
    if (this.isLoading) return;
    this.errorMessage = '';
    this.save.emit(this.formData);
  }
}

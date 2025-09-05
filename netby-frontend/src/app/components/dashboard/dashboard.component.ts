import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';
import { Product, ProductCategory } from '../../models/product.model';
import { Movement } from '../../models/movement.model';
import { ProductModalComponent, ProductFormData } from '../product-modal/product-modal.component';
import { NotificationComponent, Notification } from '../notification/notification.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalComponent, NotificationComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activePanel = 'products';
  currentUser: User | null = null;

  // Productos
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: ProductCategory[] = [];
  productSearchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  isLoadingProducts = false;
  productError = '';

  // Modal de productos
  isProductModalOpen = false;
  selectedProduct: Product | null = null;
  isModalLoading = false;

  // Notificaciones
  notifications: Notification[] = [];

  // Movimientos
  movements: Movement[] = [];
  filteredMovements: Movement[] = [];
  movementSearchTerm = '';
  selectedMovementType = '';
  selectedDate = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeData();
    this.loadProducts();
    this.subscribeToNotifications();
    this.isProductModalOpen = false;
    this.closeProductModal();

  }

  subscribeToNotifications() {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  initializeData() {
    // Inicializar categorías
    this.categories = [
      { id: 1, name: 'Electrónicos', description: 'Dispositivos electrónicos' },
      { id: 2, name: 'Ropa', description: 'Vestimenta y accesorios' },
      { id: 3, name: 'Hogar', description: 'Artículos para el hogar' },
      { id: 4, name: 'Deportes', description: 'Equipos deportivos' },
      { id: 5, name: 'Libros', description: 'Libros y material educativo' }
    ];

    this.filteredMovements = [...this.movements];
  }

  /**
   * Carga los productos desde la API
   */
  loadProducts() {
    this.isLoadingProducts = true;
    this.productError = '';

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...this.products];
        this.isLoadingProducts = false;
      },
      error: (error) => {
        this.productError = error.message;
        this.isLoadingProducts = false;
        console.error('Error al cargar productos:', error);
      }
    });
  }

  showPanel(panel: string) {
    this.activePanel = panel;
  }

  getPanelTitle(): string {
    switch (this.activePanel) {
      case 'products':
        return 'Gestión de Productos';
      case 'movements':
        return 'Gestión de Movimientos';
      default:
        return 'Dashboard';
    }
  }

  getPanelSubtitle(): string {
    switch (this.activePanel) {
      case 'products':
        return 'Administra el inventario de productos y su información';
      case 'movements':
        return 'Controla las entradas y salidas de inventario';
      default:
        return 'Panel de control principal';
    }
  }

  // Métodos para productos
  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.productSearchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(this.productSearchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || product.category === this.getCategoryName(parseInt(this.selectedCategory));
      // Como no tenemos status en la API, consideramos todos los productos como activos
      const matchesStatus = !this.selectedStatus || this.selectedStatus === 'active';
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  getCategoryName(id: number): string {
    const category = this.categories.find(cat => cat.id === id);
    return category ? category.name : '';
  }

  getActiveProductsCount(): number {
    // Como no tenemos status en la API, todos los productos se consideran activos
    return this.products.length;
  }

  getLowStockCount(): number {
    return this.products.filter(p => p.stock < 10).length;
  }

  // Métodos para el modal de productos
  openProductModal() {
    this.selectedProduct = null;
    this.isProductModalOpen = true;
  }

  editProduct(product: Product) {
    this.selectedProduct = product;
    this.isProductModalOpen = true;
  }

  closeProductModal() {
    this.isProductModalOpen = false;
    this.selectedProduct = null;
    this.isModalLoading = false;
  }

  saveProduct(formData: ProductFormData) {
    this.isModalLoading = true;

    if (this.selectedProduct) {
      // Actualizar producto existente (PUT)
      this.updateProduct(this.selectedProduct.id, formData);
    } else {
      // Crear nuevo producto (POST)
      this.createProduct(formData);
    }
  }

  createProduct(formData: ProductFormData) {
    this.productService.createProduct(formData).subscribe({
      next: (newProduct) => {
        console.log('Producto creado:', newProduct);
        this.loadProducts(); // Recargar la lista
        this.closeProductModal();
        this.showSuccessMessage('Producto creado exitosamente');
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.isModalLoading = false;
        this.showErrorMessage(`Error al crear producto: ${error.message}`);
      }
    });
  }

  updateProduct(id: string, formData: ProductFormData) {
    this.productService.updateProduct(id, formData).subscribe({
      next: (updatedProduct) => {
        console.log('Producto actualizado:', updatedProduct);
        this.loadProducts(); // Recargar la lista
        this.closeProductModal();
        this.showSuccessMessage('Producto actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        this.isModalLoading = false;
        this.showErrorMessage(`Error al actualizar producto: ${error.message}`);
      }
    });
  }

  deleteProduct(product: Product) {
    if (confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          console.log('Producto eliminado:', product.id);
          this.loadProducts(); // Recargar la lista
          this.showSuccessMessage('Producto eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          this.showErrorMessage(`Error al eliminar producto: ${error.message}`);
        }
      });
    }
  }

  // Métodos para mostrar mensajes
  showSuccessMessage(message: string) {
    this.notificationService.showSuccess(message);
  }

  showErrorMessage(message: string) {
    this.notificationService.showError(message);
  }

  // Métodos para movimientos
  filterMovements() {
    this.filteredMovements = this.movements.filter(movement => {
      const matchesSearch = movement.productName.toLowerCase().includes(this.movementSearchTerm.toLowerCase()) ||
                           movement.reason.toLowerCase().includes(this.movementSearchTerm.toLowerCase()) ||
                           movement.user.toLowerCase().includes(this.movementSearchTerm.toLowerCase());
      const matchesType = !this.selectedMovementType || movement.type === this.selectedMovementType;
      const matchesDate = !this.selectedDate || this.isSameDate(movement.date, new Date(this.selectedDate));
      
      return matchesSearch && matchesType && matchesDate;
    });
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  getTodayEntries(): number {
    const today = new Date();
    return this.movements.filter(m => 
      m.type === 'entry' && this.isSameDate(m.date, today)
    ).length;
  }

  getTodayExits(): number {
    const today = new Date();
    return this.movements.filter(m => 
      m.type === 'exit' && this.isSameDate(m.date, today)
    ).length;
  }

  openMovementModal() {
    // TODO: Implementar modal para crear movimiento
    alert('Funcionalidad de crear movimiento - Por implementar');
  }

  viewMovement(movement: Movement) {
    // TODO: Implementar vista detallada de movimiento
    alert(`Ver detalles del movimiento: ${movement.id}`);
  }

  deleteMovement(movement: Movement) {
    if (confirm(`¿Estás seguro de eliminar el movimiento #${movement.id}?`)) {
      const index = this.movements.findIndex(m => m.id === movement.id);
      if (index > -1) {
        this.movements.splice(index, 1);
        this.filterMovements();
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

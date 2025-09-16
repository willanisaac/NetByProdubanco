import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { TransactionService } from '../../services/transaction.service';
import { NotificationService } from '../../services/notification.service';
import { Product, ProductCategory } from '../../models/product.model';
import { Transaction, TransactionFormData } from '../../models/movement.model';
import { ProductModalComponent, ProductFormData } from '../product-modal/product-modal.component';
import { TransactionModalComponent } from '../transaction-modal/transaction-modal.component';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { NotificationComponent, Notification } from '../notification/notification.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalComponent, TransactionModalComponent, TransactionDetailComponent, NotificationComponent],
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

  // Transacciones
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  transactionSearchTerm = '';
  selectedTransactionType = '';
  selectedDate = '';
  isLoadingTransactions = false;
  transactionError = '';

  // Modal de transacciones
  isTransactionModalOpen = false;
  isTransactionDetailOpen = false;
  selectedTransaction: Transaction | null = null;
  isTransactionModalLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private transactionService: TransactionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeData();
    this.loadProducts();
    this.loadTransactions();
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

    this.filteredTransactions = [...this.transactions];
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

  /**
   * Carga las transacciones desde la API
   */
  loadTransactions() {
    this.isLoadingTransactions = true;
    this.transactionError = '';

    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.filteredTransactions = [...this.transactions];
        this.isLoadingTransactions = false;
      },
      error: (error) => {
        this.transactionError = error.message;
        this.isLoadingTransactions = false;
        console.error('Error al cargar transacciones:', error);
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
      case 'transactions':
        return 'Gestión de Transacciones';
      default:
        return 'Dashboard';
    }
  }

  getPanelSubtitle(): string {
    switch (this.activePanel) {
      case 'products':
        return 'Administra el inventario de productos y su información';
      case 'transactions':
        return 'Controla las transacciones de inventario (entradas, salidas, ajustes)';
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

  // Métodos para transacciones
  filterTransactions() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const product = this.products.find(p => p.id === transaction.productId);
      const productName = product ? product.name : '';
      const matchesSearch = productName.toLowerCase().includes(this.transactionSearchTerm.toLowerCase()) ||
                           transaction.detail?.toLowerCase().includes(this.transactionSearchTerm.toLowerCase()) ||
                           transaction.type?.toLowerCase().includes(this.transactionSearchTerm.toLowerCase());
      const matchesType = !this.selectedTransactionType || transaction.type === this.selectedTransactionType;
      const matchesDate = !this.selectedDate || this.isSameDate(new Date(transaction.date), new Date(this.selectedDate));
      
      return matchesSearch && matchesType && matchesDate;
    });
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  getTodayEntries(): number {
    const today = new Date();
    return this.transactions.filter(t => 
      t.type === 'entry' && this.isSameDate(new Date(t.date), today)
    ).length;
  }

  getTodayExits(): number {
    const today = new Date();
    return this.transactions.filter(t => 
      t.type === 'exit' && this.isSameDate(new Date(t.date), today)
    ).length;
  }

  getTotalValue(): number {
    return this.transactions.reduce((total, transaction) => total + transaction.totalPrice, 0);
  }

  // Métodos para el modal de transacciones
  openTransactionModal() {
    this.selectedTransaction = null;
    this.isTransactionModalOpen = true;
  }

  editTransaction(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.isTransactionModalOpen = true;
  }

  closeTransactionModal() {
    this.isTransactionModalOpen = false;
    this.selectedTransaction = null;
    this.isTransactionModalLoading = false;
  }

  saveTransaction(formData: TransactionFormData) {
    this.isTransactionModalLoading = true;

    if (this.selectedTransaction) {
      // Actualizar transacción existente (PUT)
      this.updateTransaction(this.selectedTransaction.id, formData);
    } else {
      // Crear nueva transacción (POST)
      this.createTransaction(formData);
    }
  }

  createTransaction(formData: TransactionFormData) {
    this.transactionService.createTransaction(formData).subscribe({
      next: (newTransaction) => {
        console.log('Transacción creada:', newTransaction);
        this.loadTransactions(); // Recargar la lista
        this.closeTransactionModal();
        this.showSuccessMessage('Transacción creada exitosamente');
      },
      error: (error) => {
        console.error('Error al crear transacción:', error);
        this.isTransactionModalLoading = false;
        this.showErrorMessage(`Error al crear transacción: ${error.message}`);
      }
    });
  }

  updateTransaction(id: string, formData: TransactionFormData) {
    this.transactionService.updateTransaction(id, formData).subscribe({
      next: (updatedTransaction) => {
        console.log('Transacción actualizada:', updatedTransaction);
        this.loadTransactions(); // Recargar la lista
        this.closeTransactionModal();
        this.showSuccessMessage('Transacción actualizada exitosamente');
      },
      error: (error) => {
        console.error('Error al actualizar transacción:', error);
        this.isTransactionModalLoading = false;
        this.showErrorMessage(`Error al actualizar transacción: ${error.message}`);
      }
    });
  }

  deleteTransaction(transaction: Transaction) {
    if (confirm(`¿Estás seguro de eliminar esta transacción?`)) {
      this.transactionService.deleteTransaction(transaction.id).subscribe({
        next: () => {
          console.log('Transacción eliminada:', transaction.id);
          this.loadTransactions(); // Recargar la lista
          this.showSuccessMessage('Transacción eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar transacción:', error);
          this.showErrorMessage(`Error al eliminar transacción: ${error.message}`);
        }
      });
    }
  }

  // Métodos para vista detallada de transacciones
  openTransactionDetail(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.isTransactionDetailOpen = true;
  }

  closeTransactionDetail() {
    this.isTransactionDetailOpen = false;
    this.selectedTransaction = null;
  }

  onEditTransaction(transaction: Transaction) {
    this.closeTransactionDetail();
    this.editTransaction(transaction);
  }

  onDeleteTransaction(transaction: Transaction) {
    this.closeTransactionDetail();
    this.deleteTransaction(transaction);
  }

  getProductName(productId: string): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

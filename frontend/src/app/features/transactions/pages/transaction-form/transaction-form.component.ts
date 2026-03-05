import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, timer, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { ProductService } from '../../../products/services/product.service';
import { Product } from '../../../../core/models/product.model';


@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-header">
      <h1>Nueva Transacción</h1>
      <button class="btn btn-secondary" (click)="goBack()">Volver</button>
    </div>

    <div class="card">
      @if (feedbackMessage) {
        <div class="alert" [ngClass]="{'alert-success': feedbackType === 'success', 'alert-error': feedbackType === 'error'}">
          {{ feedbackMessage }}
        </div>
      }
      <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
        <div class="filter-grid">
          <div class="form-group">
            <label>Tipo de Transacción *</label>
            <select class="form-control" formControlName="transactionType">
              <option value="Purchase">Entrada (Compra/Ajuste+)</option>
              <option value="Sale">Salida (Venta/Ajuste-)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Producto *</label>
            <select class="form-control" formControlName="productId">
              <option value="" disabled>Seleccione un producto</option>
              @for (product of availableProducts; track product.id) {
                <option [value]="product.id">{{ product.name }} (Stock: {{ product.stock }})</option>
              }
            </select>
            @if (transactionForm.get('productId')?.invalid && transactionForm.get('productId')?.touched) {
              <div class="form-error">Debe seleccionar un producto.</div>
            }
          </div>

          <div class="form-group">
            <label>Cantidad *</label>
            <input type="number" class="form-control" formControlName="quantity">
            @if (transactionForm.get('quantity')?.hasError('required') && transactionForm.get('quantity')?.touched) {
              <div class="form-error">La cantidad es requerida.</div>
            }
            @if (transactionForm.get('quantity')?.hasError('min') && transactionForm.get('quantity')?.touched) {
              <div class="form-error">La cantidad debe ser mayor a 0.</div>
            }
            @if (transactionForm.get('quantity')?.hasError('insufficientStock') && transactionForm.get('quantity')?.touched) {
              <div class="form-error">No puedes vender más stock del disponible.</div>
            }
          </div>

          <div class="form-group">
            <label>Precio Unitario *</label>
            <input type="number" step="0.01" class="form-control" formControlName="unitPrice" [readonly]="transactionForm.get('transactionType')?.value === 'Exit'">
            @if (transactionForm.get('unitPrice')?.invalid && transactionForm.get('unitPrice')?.touched) {
              <div class="form-error">El precio unitario debe ser mayor a 0.</div>
            }
          </div>
        </div>

        <div class="form-group">
          <label>Detalles / Comentarios *</label>
          <textarea class="form-control" formControlName="details" rows="3"></textarea>
          @if (transactionForm.get('details')?.invalid && transactionForm.get('details')?.touched) {
            <div class="form-error">Debe proporcionar un detalle (Max 500 caracteres).</div>
          }
        </div>

        <div class="form-group">
          <h3>Total Estimado: {{ calculateTotal() | currency }}</h3>
        </div>

        <div class="mt-4">
          <button type="submit" class="btn btn-primary w-full" [disabled]="transactionForm.invalid || isSubmitting || isLoadingProducts">
            {{ isSubmitting ? 'Procesando...' : 'Registrar Transacción' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class TransactionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private productService = inject(ProductService);
  private router = inject(Router);


  transactionForm: FormGroup;
  availableProducts: Product[] = [];
  isSubmitting = false;
  isLoadingProducts = true;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  constructor() {
    this.transactionForm = this.fb.group({
      transactionType: ['Sale', Validators.required],
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      details: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.transactionForm.valueChanges.subscribe(() => {
      this.checkStockLimits();
    });

    this.transactionForm.get('productId')?.valueChanges.subscribe(productId => {
      const product = this.availableProducts.find(p => p.id === productId);
      if (product && this.transactionForm.get('transactionType')?.value === 'Sale') {
        this.transactionForm.patchValue({ unitPrice: product.price }, { emitEvent: false });
      }
    });

    this.transactionForm.get('transactionType')?.valueChanges.subscribe(type => {
      const productId = this.transactionForm.get('productId')?.value;
      const product = this.availableProducts.find(p => p.id === productId);
      if (type === 'Sale' && product) {
        this.transactionForm.patchValue({ unitPrice: product.price }, { emitEvent: false });
      }
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  // Load products to populate the dropdown and use for stock validation
  loadProducts() {
    this.productService.getProducts(1, 1000).subscribe({
      next: (res) => {
        this.availableProducts = res.items;
        this.isLoadingProducts = false;
      },
      error: () => {
        this.isLoadingProducts = false;
        this.feedbackType = 'error';
        this.feedbackMessage = 'No se pudieron cargar los productos. Intenta nuevamente más tarde.';
      }
    });
  }

  // Complex validation: Don't allow exit transactions (Sales) greater than available stock
  checkStockLimits() {
    const type = this.transactionForm.get('transactionType')?.value;
    const productId = this.transactionForm.get('productId')?.value;
    const qtyControl = this.transactionForm.get('quantity');
    const quantity = qtyControl?.value;

    if (type === 'Sale' && productId && quantity) {
      const product = this.availableProducts.find(p => p.id === productId);
      if (product && quantity > product.stock) {
        // Override errors manually since it's a cross-field validation
        qtyControl?.setErrors({ ...qtyControl.errors, insufficientStock: true });
        return;
      }
    }

    // Clear custom error if valid
    if (qtyControl?.hasError('insufficientStock')) {
      const errors = { ...qtyControl.errors };
      delete (errors as any).insufficientStock;
      qtyControl.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  calculateTotal(): number {
    const qty = this.transactionForm.get('quantity')?.value || 0;
    const price = this.transactionForm.get('unitPrice')?.value || 0;
    return qty * price;
  }

  onSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.feedbackMessage = null;
    this.feedbackType = null;
    const formValue = this.transactionForm.getRawValue(); // gets readonly values too

    this.transactionService.createTransaction({
      transactionType: formValue.transactionType,
      productId: formValue.productId,
      quantity: formValue.quantity,
      unitPrice: formValue.unitPrice,
      details: formValue.details
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.feedbackType = 'success';
        this.feedbackMessage = 'Transacción registrada correctamente.';
        this.transactionForm.reset({
          transactionType: 'Sale',
          productId: '',
          quantity: 1,
          unitPrice: 0,
          details: ''
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.feedbackType = 'error';
        this.feedbackMessage = err?.error?.title || err?.error?.message || 'No se pudo registrar la transacción.';
        console.error('Error al registrar transacción', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/transactions']);
  }
}

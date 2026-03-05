import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-header">
      <h1>{{ isEditMode ? 'Editar Producto' : 'Nuevo Producto' }}</h1>
      <button class="btn btn-secondary" (click)="goBack()">Volver</button>
    </div>

    <div class="card">
      @if (feedbackMessage) {
        <div class="alert" [ngClass]="{'alert-success': feedbackType === 'success', 'alert-error': feedbackType === 'error'}">
          {{ feedbackMessage }}
        </div>
      }
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Nombre *</label>
          <input type="text" class="form-control" formControlName="name">
          @if (productForm.get('name')?.invalid && productForm.get('name')?.touched) {
            <div class="form-error">El nombre es requerido y no debe exceder 100 caracteres.</div>
          }
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea class="form-control" formControlName="description" rows="3"></textarea>
          @if (productForm.get('description')?.invalid && productForm.get('description')?.touched) {
            <div class="form-error">La descripción no debe exceder 500 caracteres.</div>
          }
        </div>

        <div class="filter-grid">
          <div class="form-group">
            <label>Categoría *</label>
            <input type="text" class="form-control" formControlName="category">
            @if (productForm.get('category')?.invalid && productForm.get('category')?.touched) {
              <div class="form-error">Categoría es requerida.</div>
            }
          </div>

          <div class="form-group">
            <label>Precio *</label>
            <input type="number" step="0.01" class="form-control" formControlName="price">
            @if (productForm.get('price')?.invalid && productForm.get('price')?.touched) {
              <div class="form-error">El precio debe ser mayor a 0.</div>
            }
          </div>

          <div class="form-group">
            <label>Stock *</label>
            <input type="number" class="form-control" formControlName="stock">
            @if (productForm.get('stock')?.invalid && productForm.get('stock')?.touched) {
              <div class="form-error">El stock debe ser 0 o mayor.</div>
            }
          </div>
        </div>

        <div class="form-group">
          <label>URL Imagen</label>
      <input type="text" class="form-control" formControlName="image">
        </div>

        <div class="mt-4">
          <button type="submit" class="btn btn-primary w-full" [disabled]="productForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Guardando...' : 'Guardar Producto' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  productForm: FormGroup;
  isEditMode = false;
  productId?: string;
  isSubmitting = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['', [Validators.required, Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
      },
      error: () => {

        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.feedbackMessage = null;
    this.feedbackType = null;
    const formValue = this.productForm.value;

    const request = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, formValue)
      : this.productService.createProduct(formValue);

    (request as import('rxjs').Observable<any>).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.feedbackType = 'success';
        this.feedbackMessage = this.isEditMode ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.';
        if (!this.isEditMode) {
          this.productForm.reset({
            name: '',
            description: '',
            category: '',
            price: 0,
            stock: 0,
            image: ''
          });
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.feedbackType = 'error';
        this.feedbackMessage = err?.error?.title || err?.error?.message || 'No se pudo guardar el producto.';
        console.error('Error al guardar producto', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}

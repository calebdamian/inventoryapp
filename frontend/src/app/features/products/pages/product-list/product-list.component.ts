import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { DynamicTableComponent, TableColumn } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { Product, PagedResult } from '../../../../core/models/product.model';

import { ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-header">
      <h1>Productos</h1>
      <button class="btn btn-primary" (click)="goToCreate()">+ Nuevo Producto</button>
      
    </div>

    <div class="card">
      @if (feedbackMessage) {
        <div class="alert" [ngClass]="{'alert-success': feedbackType === 'success', 'alert-error': feedbackType === 'error'}">
          {{ feedbackMessage }}
        </div>
      }
      <form [formGroup]="filterForm" class="filter-grid mb-4">
      
        <div class="form-group">
          <label>Buscar</label>
          <input type="text" class="form-control" formControlName="search" placeholder="Nombre o desc...">
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <input type="text" class="form-control" formControlName="category" placeholder="Ej: Electrónica">
        </div>
        <div class="form-group">
          <label>Precio Mínimo</label>
          <input type="number" class="form-control" formControlName="minPrice">
        </div>
        <div class="form-group">
          <label>Precio Máximo</label>
          <input type="number" class="form-control" formControlName="maxPrice">
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-secondary w-full" style="height: 38px;" (click)="applyFilters()">Filtrar</button>
        </div>
        
      </form>
<p>Seleccione el botón filtrar para visualizar los ítems de la lista, además de la ejecución correcta de cada acción.</p>
      <app-dynamic-table
        [columns]="columns"
        [data]="products"
        [currentPage]="currentPage"
        [totalPages]="totalPages"
        (onPageChange)="onPageChange($event)"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      ></app-dynamic-table>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private fb = inject(FormBuilder);


  products: Product[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  columns: TableColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nombre' },
    { field: 'category', header: 'Categoría' },
    { field: 'price', header: 'Precio', type: 'currency' },
    { field: 'stock', header: 'Stock' },
    { field: 'actions', header: 'Acciones', type: 'actions' }
  ];

  filterForm = this.fb.group({
    search: [''],
    category: [''],
    minPrice: [null],
    maxPrice: [null]
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const filters = this.filterForm.value;
    this.productService.getProducts(
      this.currentPage,
      this.pageSize,
      filters.search || undefined,
      filters.category || undefined,
      filters.minPrice || undefined,
      filters.maxPrice || undefined
    ).subscribe({
      next: (res) => {
        this.products = res.items;
        this.totalPages = res.totalPages;
        this.currentPage = res.pageNumber;
      },
      error: (err) => {
        console.error(err);
        this.feedbackType = 'error';
        this.feedbackMessage = 'No se pudieron cargar los productos.';
      }
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  goToCreate() {
    this.router.navigate(['/products/new']);
  }

  onEdit(product: Product) {
    this.router.navigate(['/products/edit', product.id]);
  }

  onDelete(product: Product) {
    if (confirm(`¿Estás seguro de eliminar el producto ${product.name}?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.feedbackType = 'success';
          this.feedbackMessage = 'Producto eliminado correctamente.';
          this.loadProducts();
        },
        error: (err) => {
          console.error(err);
          this.feedbackType = 'error';
          this.feedbackMessage = 'No se pudo eliminar el producto.';
        }
      });
    }
  }
}

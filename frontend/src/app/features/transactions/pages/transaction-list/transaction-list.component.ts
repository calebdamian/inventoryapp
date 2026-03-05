import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { DynamicTableComponent, TableColumn } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { Transaction } from '../../../../core/models/transaction.model';


@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-header">
      <h1>Transacciones</h1>
      <button class="btn btn-primary" (click)="goToCreate()">+ Nueva Transacción</button>
    </div>

    <div class="card">
      @if (feedbackMessage) {
        <div class="alert" [ngClass]="{'alert-success': feedbackType === 'success', 'alert-error': feedbackType === 'error'}">
          {{ feedbackMessage }}
        </div>
      }
      <form [formGroup]="filterForm" class="filter-grid mb-4">
        <div class="form-group">
          <label>Tipo de Transacción</label>
          <select class="form-control" formControlName="type">
            <option value="">Todos</option>
            <option value="Purchase">Entrada (Compra)</option>
            <option value="Sale">Salida (Venta)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Fecha Inicio</label>
          <input type="date" class="form-control" formControlName="startDate">
        </div>
        <div class="form-group">
          <label>Fecha Fin</label>
          <input type="date" class="form-control" formControlName="endDate">
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-secondary w-full" style="height: 38px;" (click)="applyFilters()">Filtrar</button>
        </div>
      </form>
<p>Seleccione el botón filtrar para visualizar los ítems de la lista, además de la ejecución correcta de cada acción.</p>
      <app-dynamic-table
        [columns]="columns"
        [data]="transactions"
        [currentPage]="currentPage"
        [totalPages]="totalPages"
        (onPageChange)="onPageChange($event)"
      ></app-dynamic-table>
    </div>
  `
})
export class TransactionListComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private router = inject(Router);
  private fb = inject(FormBuilder);


  transactions: Transaction[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  columns: TableColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'date', header: 'Fecha', type: 'date' },
    { field: 'transactionType', header: 'Tipo' },
    { field: 'productId', header: 'ID Producto' },
    { field: 'quantity', header: 'Cantidad' },
    { field: 'unitPrice', header: 'Precio Unit.', type: 'currency' },
    { field: 'totalPrice', header: 'Total', type: 'currency' }
  ];

  filterForm = this.fb.group({
    type: [''],
    startDate: [''],
    endDate: ['']
  });

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    const filters = this.filterForm.value;


    this.transactionService.getTransactions(
      this.currentPage,
      this.pageSize,
      (filters.type as any) || undefined,
      filters.startDate || undefined,
      filters.endDate || undefined
    ).subscribe({
      next: (res) => {
        this.transactions = res.items.map((t: Transaction) => ({
          ...t,
          transactionType: t.transactionType === 'Purchase' ? 'Entrada' : 'Salida'
        })) as any;
        this.totalPages = res.totalPages;
        this.currentPage = res.pageNumber;
      },
      error: (err) => {
        console.error(err);
        this.feedbackType = 'error';
        this.feedbackMessage = 'No se pudieron cargar las transacciones.';
      }
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadTransactions();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTransactions();
  }

  goToCreate() {
    this.router.navigate(['/transactions/new']);
  }
}

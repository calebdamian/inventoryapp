import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
    field: string;
    header: string;
    type?: 'text' | 'currency' | 'date' | 'actions';
}

@Component({
    selector: 'app-dynamic-table',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            @for (col of columns; track col.field) {
              <th>{{ col.header }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @if (data.length === 0) {
            <tr>
              <td [attr.colspan]="columns.length" class="text-center">No hay datos disponibles.</td>
            </tr>
          }
          @for (row of data; track row.id) {
            <tr>
              @for (col of columns; track col.field) {
                <td>
                  @if (col.type === 'currency') {
                    {{ row[col.field] | currency }}
                  } @else if (col.type === 'date') {
                    {{ row[col.field] | date:'short' }}
                  } @else if (col.type === 'actions') {
                    <div class="actions">
                      <button class="btn btn-primary btn-sm" (click)="onEdit.emit(row)">Editar</button>
                      <button class="btn btn-danger btn-sm" (click)="onDelete.emit(row)">Eliminar</button>
                    </div>
                  } @else {
                    {{ row[col.field] }}
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>

    @if (totalPages > 1) {
      <div class="pagination">
        <button class="btn btn-secondary" [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">Ant.</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="btn btn-secondary" [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">Sig.</button>
      </div>
    }
  `,
    styles: [`
    .table-container {
      overflow-x: auto;
      background: var(--surface);
      border-radius: var(--radius);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th, .data-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border);
    }
    .data-table th {
      background-color: #F9FAFB;
      font-weight: 600;
      color: var(--secondary);
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    .data-table tbody tr:hover {
      background-color: #F9FAFB;
    }
    .text-center { text-align: center; padding: 2rem !important; color: var(--secondary); }
    .actions { display: flex; gap: 0.5rem; }
    .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class DynamicTableComponent {
    @Input() columns: TableColumn[] = [];
    @Input() data: any[] = [];
    @Input() totalPages: number = 1;
    @Input() currentPage: number = 1;

    @Output() onEdit = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    @Output() onPageChange = new EventEmitter<number>();

    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.onPageChange.emit(page);
        }
    }
}

import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/pages/product-list/product-list.component';
import { ProductFormComponent } from './features/products/pages/product-form/product-form.component';
import { TransactionListComponent } from './features/transactions/pages/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './features/transactions/pages/transaction-form/transaction-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductListComponent },
    { path: 'products/new', component: ProductFormComponent },
    { path: 'products/edit/:id', component: ProductFormComponent },
    { path: 'transactions', component: TransactionListComponent },
    { path: 'transactions/new', component: TransactionFormComponent },
    { path: '**', redirectTo: 'products' }
];

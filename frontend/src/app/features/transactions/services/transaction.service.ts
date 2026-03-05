import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transaction, TransactionTypeCode } from '../../../core/models/transaction.model';
import { PagedResult } from '../../../core/models/product.model';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5045/api/transactions';

    getTransactions(
        pageNumber: number = 1,
        pageSize: number = 10,
        type?: TransactionTypeCode,
        startDate?: string,
        endDate?: string
    ): Observable<PagedResult<Transaction>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);

        if (type) params = params.set('type', type);
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);

        return this.http.get<any>(this.apiUrl, { params }).pipe(
            map((res): PagedResult<Transaction> => {
                const rawItems = (res.items ?? res.Items ?? []) as any[];
                const items: Transaction[] = rawItems.map(t => ({
                    id: t.id ?? t.Id,
                    date: (t.date ?? t.Date)?.toString() ?? '',
                    transactionType: (t.transactionType ?? t.Type) as TransactionTypeCode,
                    productId: t.productId ?? t.ProductId,
                    quantity: t.quantity ?? t.Quantity ?? 0,
                    unitPrice: t.unitPrice ?? t.UnitPrice ?? 0,
                    totalPrice: t.totalPrice ?? t.TotalPrice ?? 0,
                    details: t.details ?? t.Detail ?? ''
                }));

                return {
                    items,
                    totalCount: res.totalCount ?? res.TotalCount ?? items.length,
                    pageNumber: res.pageNumber ?? res.PageNumber ?? pageNumber,
                    pageSize: res.pageSize ?? res.PageSize ?? pageSize,
                    totalPages: res.totalPages ?? res.TotalPages ?? 1
                };
            })
        );
    }

    createTransaction(payload: {
        transactionType: TransactionTypeCode;
        productId: string;
        quantity: number;
        unitPrice: number;
        details: string;
    }): Observable<Transaction> {
        const body = {
            type: payload.transactionType,
            productId: payload.productId,
            quantity: payload.quantity,
            unitPrice: payload.unitPrice,
            detail: payload.details
        };

        return this.http.post<any>(this.apiUrl, body).pipe(
            map(t => ({
                id: t.id ?? t.Id,
                date: (t.date ?? t.Date)?.toString() ?? '',
                transactionType: (t.transactionType ?? t.Type) as TransactionTypeCode,
                productId: t.productId ?? t.ProductId,
                quantity: t.quantity ?? t.Quantity ?? 0,
                unitPrice: t.unitPrice ?? t.UnitPrice ?? 0,
                totalPrice: t.totalPrice ?? t.TotalPrice ?? 0,
                details: t.details ?? t.Detail ?? ''
            }))
        );
    }
}

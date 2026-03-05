import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, PagedResult } from '../../../core/models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5134/api/products';

    getProducts(
        pageNumber: number = 1,
        pageSize: number = 10,
        search?: string,
        category?: string,
        minPrice?: number,
        maxPrice?: number
    ): Observable<PagedResult<Product>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize);

        if (search) params = params.set('search', search);
        if (category) params = params.set('category', category);
        if (minPrice !== undefined && minPrice !== null) params = params.set('minPrice', minPrice);
        if (maxPrice !== undefined && maxPrice !== null) params = params.set('maxPrice', maxPrice);

        return this.http.get<any>(this.apiUrl, { params }).pipe(
            map((res): PagedResult<Product> => {
                const rawItems = (res.items ?? res.Items ?? []) as any[];
                const items: Product[] = rawItems.map(p => ({
                    id: p.id ?? p.Id,
                    name: p.name ?? p.Name,
                    description: p.description ?? p.Description ?? '',
                    category: p.category ?? p.Category ?? '',
                    image: p.image ?? p.Image ?? '',
                    price: p.price ?? p.Price ?? 0,
                    stock: p.stock ?? p.Stock ?? 0
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

    getProductById(id: string): Observable<Product> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(p => ({
                id: p.id ?? p.Id,
                name: p.name ?? p.Name,
                description: p.description ?? p.Description ?? '',
                category: p.category ?? p.Category ?? '',
                image: p.image ?? p.Image ?? '',
                price: p.price ?? p.Price ?? 0,
                stock: p.stock ?? p.Stock ?? 0
            }))
        );
    }

    createProduct(product: Omit<Product, 'id'>): Observable<Product> {
        const body = {
            name: product.name,
            description: product.description,
            category: product.category,
            image: product.image,
            price: product.price,
            stock: product.stock
        };

        return this.http.post<any>(this.apiUrl, body).pipe(
            map(p => ({
                id: p.id ?? p.Id,
                name: p.name ?? p.Name,
                description: p.description ?? p.Description ?? '',
                category: p.category ?? p.Category ?? '',
                image: p.image ?? p.Image ?? '',
                price: p.price ?? p.Price ?? 0,
                stock: p.stock ?? p.Stock ?? 0
            }))
        );
    }

    updateProduct(id: string, product: Omit<Product, 'id'>): Observable<void> {
        const body = {
            id,
            name: product.name,
            description: product.description,
            category: product.category,
            image: product.image,
            price: product.price,
            stock: product.stock
        };

        return this.http.put<void>(`${this.apiUrl}/${id}`, body);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

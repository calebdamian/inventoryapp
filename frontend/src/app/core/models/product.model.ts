export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    image: string;
    price: number;
    stock: number;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

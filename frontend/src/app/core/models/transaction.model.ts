export type TransactionTypeCode = 'Purchase' | 'Sale';

export interface Transaction {
    id: string;
    date: string;
    transactionType: TransactionTypeCode;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    details: string;
}

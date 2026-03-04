using TransactionsAPI.Models;

namespace TransactionsAPI.DTOs;

public class RegisterTransactionDto
{
    public TransactionType Type { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string Detail { get; set; } = string.Empty;
}

using TransactionsAPI.DTOs;
using TransactionsAPI.Models;

namespace TransactionsAPI.Services;

public interface ITransactionService
{
    Task<Transaction> RegisterAsync(RegisterTransactionDto dto);
    Task<IEnumerable<Transaction>> GetByProductAsync(Guid productId);
    Task<PagedResult<Transaction>> GetPagedAsync(int pageNumber, int pageSize, string? type, DateTime? startDate, DateTime? endDate);
}

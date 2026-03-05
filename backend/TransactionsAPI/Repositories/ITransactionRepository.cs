using TransactionsAPI.DTOs;
using TransactionsAPI.Models;

namespace TransactionsAPI.Repositories;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction);
    Task<IEnumerable<Transaction>> GetByProductIdAsync(Guid productId);
    Task<PagedResult<Transaction>> GetPagedAsync(int pageNumber, int pageSize, string? type, DateTime? startDate, DateTime? endDate);
}

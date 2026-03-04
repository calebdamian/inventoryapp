using TransactionsAPI.Models;

namespace TransactionsAPI.Repositories;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction);
    Task<IEnumerable<Transaction>> GetByProductIdAsync(Guid productId);
}

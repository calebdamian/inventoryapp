using TransactionsAPI.Models;

namespace TransactionsAPI.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly List<Transaction> _transactions = new();

    public Task AddAsync(Transaction transaction)
    {
        _transactions.Add(transaction);
        return Task.CompletedTask;
    }

    public Task<IEnumerable<Transaction>> GetByProductIdAsync(Guid productId)
    {
        var result = _transactions.Where(t => t.ProductId == productId);
        return Task.FromResult(result);
    }
}

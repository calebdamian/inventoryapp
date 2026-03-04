using Microsoft.EntityFrameworkCore;
using TransactionsAPI.Data;
using TransactionsAPI.Models;

namespace TransactionsAPI.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly TransactionsDbContext _context;

    public TransactionRepository(TransactionsDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Transaction transaction)
    {
        await _context.Transactions.AddAsync(transaction);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Transaction>> GetByProductIdAsync(Guid productId)
    {
        return await _context.Transactions
            .AsNoTracking()
            .Where(t => t.ProductId == productId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }
}

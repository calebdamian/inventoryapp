using Microsoft.EntityFrameworkCore;
using TransactionsAPI.Data;
using TransactionsAPI.Models;
using TransactionsAPI.DTOs;

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

    public async Task<PagedResult<Transaction>> GetPagedAsync(int pageNumber, int pageSize, string? type, DateTime? startDate, DateTime? endDate)
    {
        var query = _context.Transactions.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(type))
        {
            if (Enum.TryParse<TransactionType>(type, true, out var parsedType))
            {
                query = query.Where(t => t.Type == parsedType);
            }
        }

        if (startDate.HasValue)
        {
            query = query.Where(t => t.Date >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            // End of day consideration could be handled here or assumed to be handled by the client
            query = query.Where(t => t.Date <= endDate.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.Date)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Transaction>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }
}

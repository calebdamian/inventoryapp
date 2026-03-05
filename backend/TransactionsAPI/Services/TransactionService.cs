using TransactionsAPI.DTOs;
using TransactionsAPI.Models;
using TransactionsAPI.Repositories;

namespace TransactionsAPI.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _repository;

    public TransactionService(ITransactionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Transaction> RegisterAsync(RegisterTransactionDto dto)
    {
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow,
            Type = dto.Type,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            UnitPrice = dto.UnitPrice,
            TotalPrice = dto.Quantity * dto.UnitPrice,
            Detail = dto.Detail
        };

        await _repository.AddAsync(transaction);
        return transaction;
    }

    public async Task<IEnumerable<Transaction>> GetByProductAsync(Guid productId)
    {
        return await _repository.GetByProductIdAsync(productId);
    }

    public async Task<PagedResult<Transaction>> GetPagedAsync(int pageNumber, int pageSize, string? type, DateTime? startDate, DateTime? endDate)
    {
        return await _repository.GetPagedAsync(pageNumber, pageSize, type, startDate, endDate);
    }
}

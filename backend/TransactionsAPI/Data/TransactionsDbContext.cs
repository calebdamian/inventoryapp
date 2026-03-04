using Microsoft.EntityFrameworkCore;
using TransactionsAPI.Models;

namespace TransactionsAPI.Data;

public class TransactionsDbContext : DbContext
{
    public TransactionsDbContext(DbContextOptions<TransactionsDbContext> options) : base(options)
    {
    }

    public DbSet<Transaction> Transactions { get; set; }
}

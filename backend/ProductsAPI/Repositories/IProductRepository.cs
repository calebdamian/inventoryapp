using ProductsAPI.DTOs;
using ProductsAPI.Models;

namespace ProductsAPI.Repositories;

public interface IProductRepository
{
    Task<PagedResult<Product>> GetPagedAsync(int pageNumber, int pageSize, string? search, string? category, decimal? minPrice, decimal? maxPrice);
    Task<Product?> GetByIdAsync(Guid id);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Guid id);
}

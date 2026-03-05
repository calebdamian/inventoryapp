using ProductsAPI.DTOs;
using ProductsAPI.Models;

namespace ProductsAPI.Services;

public interface IProductService
{
    Task<PagedResult<Product>> GetPagedAsync(int pageNumber, int pageSize, string? search, string? category, decimal? minPrice, decimal? maxPrice);
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product> CreateAsync(CreateProductDto dto);
    Task UpdateAsync(UpdateProductDto dto);
    Task DeleteAsync(Guid id);
}

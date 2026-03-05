using ProductsAPI.DTOs;
using ProductsAPI.Models;
using ProductsAPI.Repositories;

namespace ProductsAPI.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;

    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<Product>> GetPagedAsync(int pageNumber, int pageSize, string? search, string? category, decimal? minPrice, decimal? maxPrice)
    {
        return await _repository.GetPagedAsync(pageNumber, pageSize, search, category, minPrice, maxPrice);
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Product> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            Image = dto.Image,
            Price = dto.Price,
            Stock = dto.Stock
        };

        await _repository.AddAsync(product);
        return product;
    }

    public async Task UpdateAsync(UpdateProductDto dto)
    {
        var existingProduct = await _repository.GetByIdAsync(dto.Id);
        if (existingProduct == null)
            return;

        existingProduct.Name = dto.Name;
        existingProduct.Description = dto.Description;
        existingProduct.Category = dto.Category;
        existingProduct.Image = dto.Image;
        existingProduct.Price = dto.Price;
        existingProduct.Stock = dto.Stock;

        await _repository.UpdateAsync(existingProduct);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _repository.DeleteAsync(id);
    }
}

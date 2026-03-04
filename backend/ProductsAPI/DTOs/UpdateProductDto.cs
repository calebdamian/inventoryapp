namespace ProductsAPI.DTOs;

public class UpdateProductDto : CreateProductDto
{
    public Guid Id { get; set; }
}

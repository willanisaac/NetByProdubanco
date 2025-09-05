using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using netby.application.DTOs;
using netby.application.Services;
using netby.domain.Entities;
using netby.domain.Interfaces;

namespace ProductService.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repo;
    public ProductService(IProductRepository repo) => _repo = repo;

    public async Task<ProductDto> CreateAsync(ProductDto dto)
    {
        var entity = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            ImageUrl = dto.ImageUrl,
            Price = dto.Price,
            Stock = dto.Stock
        };

        var created = await _repo.AddAsync(entity);
        return Map(created);
    }

    public async Task DeleteAsync(Guid id) => await _repo.DeleteAsync(id);

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
        => (await _repo.GetAllAsync()).Select(Map);

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var p = await _repo.GetByIdAsync(id);
        return p is null ? null : Map(p);
    }

    public async Task<ProductDto?> UpdateAsync(ProductDto dto)
    {
        var existing = await _repo.GetByIdAsync(dto.Id);
        if (existing is null) return null;

        existing.Name = dto.Name;
        existing.Description = dto.Description;
        existing.Category = dto.Category;
        existing.ImageUrl = dto.ImageUrl;
        existing.Price = dto.Price;
        existing.Stock = dto.Stock;

        var updated = await _repo.UpdateAsync(existing);
        return Map(updated);
    }

    private static ProductDto Map(Product p) =>
        new(p.Id, p.Name, p.Description, p.Category, p.ImageUrl, p.Price, p.Stock);
}
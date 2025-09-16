using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using netby.application.DTOs;


namespace netby.application.Services;


public interface IProductService
{
    Task<ProductDto> CreateAsync(ProductDto dto);
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<ProductDto>> GetAllAsync();
    Task<ProductDto?> UpdateAsync(ProductDto dto);
    Task DeleteAsync(Guid id);
}
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using netby.domain.Entities;


namespace netby.domain.Interfaces;


public interface IProductRepository
{
    Task<Product> AddAsync(Product product);
    Task<Product?> GetByIdAsync(Guid id);
    Task<IEnumerable<Product>> GetAllAsync();
    Task<Product> UpdateAsync(Product product);
    Task DeleteAsync(Guid id);
}
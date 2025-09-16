using Microsoft.EntityFrameworkCore;
using netby.domain.Entities;
using netby.domain.Interfaces;
using netby.infraestructute.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace netby.infraestructute.Repositories;


public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _ctx;
    public ProductRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Product> AddAsync(Product product)
    {
        var e = await _ctx.Products.AddAsync(product);
        await _ctx.SaveChangesAsync();
        return e.Entity;
    }

    public async Task DeleteAsync(Guid id)
    {
        var p = await _ctx.Products.FindAsync(id);
        if (p is null) return;
        _ctx.Products.Remove(p);
        await _ctx.SaveChangesAsync();
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
        => await _ctx.Products.AsNoTracking().ToListAsync();

    public async Task<Product?> GetByIdAsync(Guid id)
        => await _ctx.Products.FindAsync(id);

    public async Task<Product> UpdateAsync(Product product)
    {
        _ctx.Products.Update(product);
        await _ctx.SaveChangesAsync();
        return product;
    }
}
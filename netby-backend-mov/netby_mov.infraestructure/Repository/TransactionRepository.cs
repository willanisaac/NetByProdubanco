using Microsoft.EntityFrameworkCore;
using netby_mov.domain.Entities;
using netby_mov.domain.Interfaces;
using netby_mov.infraestructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace netby_mov.infraestructure.Repository;


public class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _ctx;
    public TransactionRepository(AppDbContext ctx) => _ctx = ctx;

    public async Task<Transaction> AddAsync(Transaction transaction)
    {
        var e = await _ctx.Transactions.AddAsync(transaction);
        await _ctx.SaveChangesAsync();
        return e.Entity;
    }

    public async Task DeleteAsync(Guid id)
    {
        var t = await _ctx.Transactions.FindAsync(id);
        if (t is null) return;
        _ctx.Transactions.Remove(t);
        await _ctx.SaveChangesAsync();
    }

    public async Task<IEnumerable<Transaction>> GetAllAsync()
        => await _ctx.Transactions.AsNoTracking().ToListAsync();

    public async Task<Transaction?> GetByIdAsync(Guid id)
        => await _ctx.Transactions.FindAsync(id);
}
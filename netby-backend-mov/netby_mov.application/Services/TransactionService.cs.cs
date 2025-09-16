using netby_mov.application.DTOs;
using netby_mov.domain.Entities;
using netby_mov.domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace netby_mov.application.Services;

public class TransactionService : ITransactionService

{
    private readonly ITransactionRepository _repo;
    public TransactionService(ITransactionRepository repo) => _repo = repo;

    public async Task<TransactionDto> CreateAsync(TransactionDto dto)
    {
        var entity = new Transaction
        {
            Date = dto.Date,
            Type = dto.Type,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            UnitPrice = dto.UnitPrice,
            TotalPrice = dto.Quantity * dto.UnitPrice, // cálculo automático
            Detail = dto.Detail
        };

        var created = await _repo.AddAsync(entity);
        return Map(created);
    }

    public async Task DeleteAsync(Guid id) => await _repo.DeleteAsync(id);

    public async Task<IEnumerable<TransactionDto>> GetAllAsync()
        => (await _repo.GetAllAsync()).Select(Map);

    public async Task<TransactionDto?> GetByIdAsync(Guid id)
    {
        var t = await _repo.GetByIdAsync(id);
        return t is null ? null : Map(t);
    }

    private static TransactionDto Map(Transaction t) =>
        new(t.Id, t.Date, t.Type, t.ProductId, t.Quantity, t.UnitPrice, t.TotalPrice, t.Detail);
}
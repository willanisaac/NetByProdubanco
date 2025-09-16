using netby_mov.application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace netby_mov.application.Services;

public interface ITransactionService
{
    Task<TransactionDto> CreateAsync(TransactionDto dto);
    Task<TransactionDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<TransactionDto>> GetAllAsync();
    Task DeleteAsync(Guid id);
}
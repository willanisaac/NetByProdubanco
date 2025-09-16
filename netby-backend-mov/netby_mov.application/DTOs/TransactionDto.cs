using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace netby_mov.application.DTOs;

public record TransactionDto(
    Guid Id,
    DateTime Date,
    string Type,
    Guid ProductId,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice,
    string? Detail
);
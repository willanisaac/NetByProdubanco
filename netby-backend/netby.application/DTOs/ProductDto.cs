using System;

namespace netby.application.DTOs;

public record ProductDto(
    Guid Id,
    string Name,
    string? Description,
    string? Category,
    string? ImageUrl,
    decimal Price,
    int Stock
);
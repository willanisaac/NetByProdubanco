using System;
using System.ComponentModel.DataAnnotations;

namespace netby.domain.Entities;

public class Product
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();


    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = null!;


    [MaxLength(2000)]
    public string? Description { get; set; }


    [MaxLength(200)]
    public string? Category { get; set; }


    // Puede ser una URL o ruta en blob storage
    [MaxLength(1000)]
    public string? ImageUrl { get; set; }


    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }


    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
}
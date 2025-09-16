using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace netby_mov.domain.Entities;


public class Transaction
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [Required, MaxLength(20)]
    public string Type { get; set; } = null!; // "Compra" o "Venta"

    [Required]
    public Guid ProductId { get; set; }   // Relación con microservicio de Productos

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Range(0, (double)decimal.MaxValue)]
    public decimal UnitPrice { get; set; }

    [Range(0, (double)decimal.MaxValue)]
    public decimal TotalPrice { get; set; }

    [MaxLength(2000)]
    public string? Detail { get; set; }
}
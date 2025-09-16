using Microsoft.EntityFrameworkCore;
using netby_mov.domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace netby_mov.infraestructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

    public DbSet<Transaction> Transactions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transaction>(b =>
        {
            b.ToTable("Transactions");
            b.HasKey(x => x.Id);
            b.Property(x => x.Type).HasMaxLength(20).IsRequired();
            b.Property(x => x.Quantity).IsRequired();
            b.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
            b.Property(x => x.TotalPrice).HasColumnType("decimal(18,2)");
            b.Property(x => x.Detail).HasMaxLength(2000);
        });
    }
}
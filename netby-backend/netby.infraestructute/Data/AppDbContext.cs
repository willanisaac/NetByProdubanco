using Microsoft.EntityFrameworkCore;
using netby.domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace netby.infraestructute.Data;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

    public DbSet<Product> Products { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(b =>
        {
            b.ToTable("Products");
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).HasMaxLength(200).IsRequired();
            b.Property(x => x.Description).HasMaxLength(2000);
            b.Property(x => x.Category).HasMaxLength(200);
            b.Property(x => x.ImageUrl).HasMaxLength(1000);
            b.Property(x => x.Price).HasColumnType("decimal(18,2)");
            b.Property(x => x.Stock);
        });
    }
}
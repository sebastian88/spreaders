using spreaders.lib.models.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.context
{
  public class StorageContext : DbContext
  {
    public StorageContext() : base("DefaultConnection")
    {

    }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Group> Groups { get; set; }
    public virtual DbSet<Person> People { get; set; }
    public virtual DbSet<Transaction> Transactions { get; set; }



    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
      modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
      modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
    }
  }
}

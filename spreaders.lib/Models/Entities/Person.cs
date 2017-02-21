using spreaders.lib.Models.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.models.Entities
{
  public class Person : IEntity
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public string Name { get; set; }
    public bool Deleted { get; set; }


    [InverseProperty("Payees")]
    public ICollection<Transaction> TransactionsIsPayeeOf { get; set; }



    public Guid GroupId { get; set; }

    [ForeignKey("GroupId")]
    public virtual Group Group { get; set; }

    public Person()
    {
      TransactionsIsPayeeOf = new HashSet<Transaction>();
    }
  }
}
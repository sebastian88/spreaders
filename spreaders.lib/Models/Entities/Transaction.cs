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
  public class Transaction : IEntity
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public bool IsDeleted { get; set; }


    public Guid PayerId { get; set; }

    [ForeignKey("PayerId")]
    public virtual Person Payer { get; set; }


    public virtual ICollection<Person> Payees { get; set; }


    public Guid GroupId { get; set; }

    [ForeignKey("GroupId")]
    public virtual Group Group { get; set; }

    public Transaction()
    {
      Payees = new HashSet<Person>();
    }
  }
}

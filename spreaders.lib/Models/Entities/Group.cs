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
  public class Group : IEntity
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    public string Name { get; set; }
		public virtual ICollection<Transaction> Transactions { get; set; }
    public virtual ICollection<Person> People { get; set; }
    public virtual ICollection<User> Users { get; set; }

    public Group()
    {
      Transactions = new HashSet<Transaction>();
      People = new HashSet<Person>();
      Users = new HashSet<User>();
    }
  }
}

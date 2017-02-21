using spreaders.lib.Models.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Models.Dtos.General
{
  public class AddedEntity<T> where T : IEntity
  {
    public int ClientId { get; set; }
    public T Entity { get; set; }
  }
}

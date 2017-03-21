using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Models.Dtos.Json
{
  public class ApiUpdateJsonReturnModel
  {
    public List<JsonGroup> GroupsToUpdate { get; set; }
    public List<JsonPerson> PeopleToUpdate { get; set; }
    public List<JsonTransaction> TransactionsToUpdate { get; set; }

    public ApiUpdateJsonReturnModel()
    {
      GroupsToUpdate = new List<JsonGroup>();
      PeopleToUpdate = new List<JsonPerson>();
      TransactionsToUpdate = new List<JsonTransaction>();
    }
  }

  public class CreatedId
  {
    public Guid Id { get; set; }
    public int ClientId { get; set; }
  }
}

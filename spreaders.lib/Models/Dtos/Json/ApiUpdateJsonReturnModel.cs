using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Models.Dtos.Json
{
  public class ApiUpdateJsonReturnModel
  {
    public List<CreatedId> AddedGroups { get; set; }
    public List<CreatedId> AddedPeople { get; set; }
    public List<CreatedId> AddedTransactions { get; set; }

    public ApiUpdateJsonReturnModel()
    {
      AddedGroups = new List<CreatedId>();
      AddedPeople = new List<CreatedId>();
      AddedTransactions = new List<CreatedId>();
    }
  }

  public class CreatedId
  {
    public Guid Id { get; set; }
    public int ClientId { get; set; }
  }
}

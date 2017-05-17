using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Models.Dtos.Json
{
  public class ApiGetGroupReturnModel
  {
    public JsonGroup Group { get; set; }
    public List<JsonPerson> People { get; set; }
    public List<JsonTransaction> Transactions { get; set; }

    public ApiGetGroupReturnModel()
    {
      People = new List<JsonPerson>();
      Transactions = new List<JsonTransaction>();
    }
  }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Models.Dtos.Json
{
  [DataContract(Name = "group")]
  public class ApiGetGroupReturnModel
  {
    [DataMember(Name = "group")]
    public JsonGroup Group { get; set; }
    [DataMember(Name = "people")]
    public List<JsonPerson> People { get; set; }
    [DataMember(Name = "transactions")]
    public List<JsonTransaction> Transactions { get; set; }

    public ApiGetGroupReturnModel()
    {
      People = new List<JsonPerson>();
      Transactions = new List<JsonTransaction>();
    }
  }
}

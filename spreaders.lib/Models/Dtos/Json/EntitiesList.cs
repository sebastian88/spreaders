using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace spreaders.lib.Models.Dtos.Json
{
  [DataContract]
  public class Entities
  {
    [DataMember(Name = "groups")]
    public List<JsonGroup> Groups { get; set; }
    [DataMember(Name = "people")]
    public List<JsonPerson> People { get; set; }
    [DataMember(Name = "transactions")]
    public List<JsonTransaction> Transactions { get; set; }

    public Entities()
    {
      Groups = new List<JsonGroup>();
      People = new List<JsonPerson>();
      Transactions = new List<JsonTransaction>();
    }
  }
}
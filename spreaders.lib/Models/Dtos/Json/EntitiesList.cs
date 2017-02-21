using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace spreaders.lib.Models.Dtos.Json
{
  public class EntitiesList
  {
    public List<JsonGroup> Groups { get; set; }
    public List<JsonPerson> People { get; set; }
    public List<JsonTransaction> Transactions { get; set; }

    public EntitiesList()
    {
      Groups = new List<JsonGroup>();
      People = new List<JsonPerson>();
      Transactions = new List<JsonTransaction>();
    }
  }
}
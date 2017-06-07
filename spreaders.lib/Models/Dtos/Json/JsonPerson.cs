using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace spreaders.lib.Models.Dtos.Json
{
  public class JsonPerson
  {
    public int ClientId { get; set; }
    public Guid Id { get; set; }
    public string Name { get; set; }
    public bool IsDeleted { get; set; } 
    public int GroupClientId { get; set; }
    public Guid GroupId { get; set; }
  }
}
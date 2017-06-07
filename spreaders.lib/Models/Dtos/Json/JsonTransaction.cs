using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace spreaders.lib.Models.Dtos.Json
{
  public class JsonTransaction
  {
    public int ClientId { get; set; }
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public bool IsDeleted { get; set; }
    public int PayerClientId { get; set; }
    public Guid PayerId { get; set; }
    public List<int> PayeesClientIds { get; set; }
    public List<Guid> Payees { get; set; }
    public int GroupClientId { get; set; }
    public Guid GroupId { get; set; }

    public JsonTransaction()
    {
      PayeesClientIds = new List<int>();
      Payees = new List<Guid>();
    }
  }
}
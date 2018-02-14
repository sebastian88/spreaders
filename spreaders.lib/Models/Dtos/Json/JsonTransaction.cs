using spreaders.lib.Models.Dtos.Json.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace spreaders.lib.Models.Dtos.Json
{
  [DataContract(Name = "Transaction")]
  public class JsonTransaction : IJsonEntity
  {
    [DataMember(Name = "id")]
    public Guid Id { get; set; }
    [DataMember(Name = "amount")]
    public decimal Amount { get; set; }
    [DataMember(Name = "description")]
    public string Description { get; set; }
    [DataMember(Name = "isDeleted")]
    public bool IsDeleted { get; set; }
    [DataMember(Name = "createdOn")]
    public long CreatedOnUnixTimeStamp { get; set; }
    [DataMember(Name = "updatedOn")]
    public long UpdatedOnUnixTimeStamp { get; set; }
    [DataMember(Name = "payerId")]
    public Guid PayerId { get; set; }
    [DataMember(Name = "payees")]
    public List<Guid> Payees { get; set; }
    [DataMember(Name = "groupId")]
    public Guid GroupId { get; set; }

    public JsonTransaction()
    {
      Payees = new List<Guid>();
    }
  }
}
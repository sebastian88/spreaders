using spreaders.lib.Models.Dtos.Json.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace spreaders.lib.Models.Dtos.Json
{
  [DataContract(Name = "group")]
  public class JsonGroup : IJsonEntity
  {
    [DataMember(Name = "id")]
    public Guid Id { get; set; }
    [DataMember(Name = "name")]
    public string Name { get; set; }
    [DataMember(Name = "isDeleted")]
    public bool IsDeleted { get; set; }
    [DataMember(Name = "createdOn")]
    public long CreatedOnUnixTimeStamp { get; set; }
    [DataMember(Name = "updatedOn")]
    public long UpdatedOnUnixTimeStamp { get; set; }
  }
}
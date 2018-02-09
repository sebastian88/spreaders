using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace spreaders.lib.Models.Dtos.Json
{
  [DataContract(Name = "Person")]
  public class JsonPerson
  {
    [DataMember(Name = "id")]
    public Guid Id { get; set; }
    [DataMember(Name = "name")]
    public string Name { get; set; }
    [DataMember(Name = "colour")]
    public string Colour { get; set; }
    [DataMember(Name = "isDeleted")]
    public bool IsDeleted { get; set; }
    [DataMember(Name = "groupId")]
    public Guid GroupId { get; set; }
  }
}
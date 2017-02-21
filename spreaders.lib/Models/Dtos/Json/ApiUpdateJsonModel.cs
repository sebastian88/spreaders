using System;
using System.Collections.Generic;

namespace spreaders.lib.Models.Dtos.Json
{
  public class ApiUpdateJsonModel
  {
    public EntitiesList CreatedObjects { get; set; }
    public EntitiesList UpdatedObjects { get; set; }

    public ApiUpdateJsonModel()
    {
      CreatedObjects = new EntitiesList();
      UpdatedObjects = new EntitiesList();
    }
  }
}
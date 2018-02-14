using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Models.Dtos.Json.Interfaces
{
  public interface IJsonEntity
  {
    long CreatedOnUnixTimeStamp { get; set; }
    long UpdatedOnUnixTimeStamp { get; set; }
  }
}

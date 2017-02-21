using spreaders.lib.context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Context.Interfaces
{
  public interface IUnitOfWork
  {
    StorageContext StorageContext { get; }

    void Commit();
  }
}

using spreaders.lib.context;
using spreaders.lib.Context.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Context
{
  public class UnitOfWork : IUnitOfWork
  {


    private StorageContext _storageContext;

    public UnitOfWork()
    {
      _storageContext = new StorageContext();
    }

    public UnitOfWork(StorageContext storageContext)
    {
      _storageContext = storageContext;
    }
    
    public StorageContext StorageContext { get { return _storageContext; } }
    
    public void Commit()
    {
      _storageContext.SaveChanges();
    }
  }
}

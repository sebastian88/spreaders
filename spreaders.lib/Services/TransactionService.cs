using spreaders.lib.Context.Interfaces;
using spreaders.lib.models.Entities;
using spreaders.lib.Models.Dtos.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Services
{
  public class TransactionService
  {
    IUnitOfWork _unitOfWork;
    EntityService _entityService;
    public TransactionService(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
      _entityService = new EntityService();
    }

    public Transaction Get(Guid id)
    {
      return _unitOfWork.StorageContext.Transactions.Where(x => x.Id == id).FirstOrDefault();
    }

    public void Add(Transaction transaction)
    {
      _unitOfWork.StorageContext.Transactions.Add(transaction);
    }

    public Transaction CreateFromJsonTransaction(JsonTransaction jsonTransaction)
    {
      var transaction = new Transaction { Id = jsonTransaction.Id };
      Add(transaction);
      UpdateFromJsonPerson(transaction, jsonTransaction);
      return transaction;
    }

    public Transaction UpdateFromJsonPerson(Transaction transaction, JsonTransaction jsonTransaction)
    {
      if (jsonTransaction == null)
        throw new Exception("jsontransaction is null");
      
      transaction.Amount = jsonTransaction.Amount;
      transaction.IsDeleted = jsonTransaction.IsDeleted;
      transaction.Description = jsonTransaction.Description;
      transaction.GroupId = jsonTransaction.GroupId;
      transaction.PayerId = jsonTransaction.PayerId;

      transaction.Payees = new HashSet<Person>();
      if (jsonTransaction.Payees != null)
      {
        foreach (Guid payeeId in jsonTransaction.Payees)
        {
          Person payee = _unitOfWork.StorageContext.People.Where(x => x.Id == payeeId).FirstOrDefault();
          if (payee != null)
            transaction.Payees.Add(payee);
        }
      }

      return _entityService.UpdateFromJson(transaction, jsonTransaction);
    }
  }
}

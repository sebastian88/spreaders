using spreaders.lib.Context.Interfaces;
using spreaders.lib.models.Entities;
using spreaders.lib.Models.Dtos.General;
using spreaders.lib.Models.Dtos.Json;
using spreaders.lib.Models.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Services
{
  public class ApiSyncService
  {
    IUnitOfWork _unitOfWork;
    GroupService _groupService;
    PersonService _personService;
    TransactionService _transactionService;

    EntitiesList _model;

    public ApiSyncService(IUnitOfWork unitOfWork, EntitiesList model)
    {
      _unitOfWork = unitOfWork;
      _groupService = new GroupService(_unitOfWork);
      _personService = new PersonService(_unitOfWork);
      _transactionService = new TransactionService(_unitOfWork);

      _model = model;
    }

    public void ProcessRequest()
    {
      if (_model == null || _model == null)
        return;

      foreach(JsonGroup jsonGroup in _model.Groups)
      {
        Group group = _groupService.Get(jsonGroup.Id);
        group = _groupService.PopulateGroup(group, jsonGroup);
      }

      foreach (JsonPerson jsonPerson in _model.People)
      {
        Person person = _personService.Get(jsonPerson.Id);
        person = _personService.PopulatePerson(person, jsonPerson);
      }

      foreach (JsonTransaction jsonTransaction in _model.Transactions)
      {
        Transaction transaction = _transactionService.Get(jsonTransaction.Id);
        transaction = _transactionService.PopulateTransaction(transaction, jsonTransaction);
      }
      _unitOfWork.Commit();
    }
  }
}

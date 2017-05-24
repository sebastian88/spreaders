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
      if (_model == null)
        return;

      foreach (JsonGroup jsonGroup in _model.Groups)
        ProcessGroup(jsonGroup);

      foreach (JsonPerson jsonPerson in _model.People)
        ProcessPerson(jsonPerson);

      foreach (JsonTransaction jsonTransaction in _model.Transactions)
        ProcessTransaction(jsonTransaction);

      _unitOfWork.Commit();
    }

    private void ProcessGroup(JsonGroup jsonGroup)
    {
      Group group = _groupService.Get(jsonGroup.Id);
      if (group == null)
        _groupService.AddFromJsonGroup(jsonGroup);
      else
        _groupService.UpdateFromJsonGroup(group, jsonGroup);
    }

    private void ProcessPerson(JsonPerson jsonPerson)
    {
      Person person = _personService.Get(jsonPerson.Id);
      if (person == null)
        _personService.AddFromJsonPerson(jsonPerson);
      else
        _personService.UpdateFromJsonPerson(person, jsonPerson);
    }

    private void ProcessTransaction(JsonTransaction jsonTransaction)
    {
      Transaction transaction = _transactionService.Get(jsonTransaction.Id);
      if (transaction == null)
        _transactionService.CreateFromJsonTransaction(jsonTransaction);
      else
        _transactionService.UpdateFromJsonPerson(transaction, jsonTransaction);
    }

  }
}

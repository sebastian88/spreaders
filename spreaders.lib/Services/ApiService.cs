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
  public class ApiService
  {
    IUnitOfWork _unitOfWork;
    GroupService _groupService;
    PersonService _personService;
    TransactionService _transactionService;

    ApiUpdateJsonModel _model;
    List<AddedEntity<Group>> _addedGroups;
    List<AddedEntity<Person>> _addedPeople;
    List<AddedEntity<Transaction>> _addedTransactions;
    ApiUpdateJsonReturnModel _returnModel;

    public ApiService(IUnitOfWork unitOfWork, ApiUpdateJsonModel model)
    {
      _unitOfWork = unitOfWork;
      _groupService = new GroupService(_unitOfWork);
      _personService = new PersonService(_unitOfWork);
      _transactionService = new TransactionService(_unitOfWork);

      _model = model;
      _addedGroups = new List<AddedEntity<Group>>();
      _addedPeople = new List<AddedEntity<Person>>();
      _addedTransactions = new List<AddedEntity<Transaction>>();
      _returnModel = new ApiUpdateJsonReturnModel();
    }

    public ApiUpdateJsonReturnModel ProcessCreatedObjects()
    {
      if (_model == null || _model.CreatedObjects == null)
        return null;

      ProcessGroups();
      _unitOfWork.Commit();
      UpdateModelWithNewGroupIds();

      ProcessPeople();
      _unitOfWork.Commit();
      UpdateModelWithNewPeopleIds();

      ProcessTransactions();

      _returnModel.AddedGroups = GenerateEntityInReturnList(_addedGroups);
      _returnModel.AddedPeople = GenerateEntityInReturnList(_addedPeople);
      _returnModel.AddedTransactions = GenerateEntityInReturnList(_addedTransactions);

      return _returnModel;
    }

    public void ProcessUpdatedObjects()
    {
      if (_model == null || _model.UpdatedObjects == null)
        return;

      foreach(JsonGroup jsonGroup in _model.UpdatedObjects.Groups)
      {
        Group group = _groupService.Get(jsonGroup.Id);
        group = _groupService.PopulateGroup(group, jsonGroup);
      }

      foreach (JsonPerson jsonPerson in _model.UpdatedObjects.People)
      {
        Person person = _personService.Get(jsonPerson.Id);
        person = _personService.PopulatePerson(person, jsonPerson);
      }

      foreach (JsonTransaction jsonTransaction in _model.UpdatedObjects.Transactions)
      {
        Transaction transaction = _transactionService.Get(jsonTransaction.Id);
        transaction = _transactionService.PopulateTransaction(transaction, jsonTransaction);
      }
      _unitOfWork.Commit();
    }

    private void ProcessGroups()
    {
      foreach (JsonGroup jsonGroup in _model.CreatedObjects.Groups)
      {
        Group group = _groupService.PopulateGroup(new Group(), jsonGroup);
        _groupService.Add(group);
        _addedGroups.Add(new AddedEntity<Group>() {
          ClientId = jsonGroup.ClientId,
          Entity = group
        });
      }
    }

    private void UpdateModelWithNewGroupIds()
    {
      UpdatePeopleWithNewGroupIds();
      UpdateJsonTransactionsWithNewGroupIds();
    }

    private void UpdatePeopleWithNewGroupIds()
    {
      foreach (JsonPerson person in _model.CreatedObjects.People)
        UpdateJsonPersonEmptyGroupId(person);

      foreach(JsonPerson person in _model.UpdatedObjects.People)
        UpdateJsonPersonEmptyGroupId(person);
    }

    private void UpdateJsonPersonEmptyGroupId(JsonPerson person)
    {
      if (person.GroupId == Guid.Empty)
      {
        AddedEntity<Group> addedGroup = _addedGroups.Where(x => x.ClientId == person.GroupClientId).FirstOrDefault();
        if (addedGroup != null)
          person.GroupId = addedGroup.Entity.Id;
      }
    }

    private void UpdateJsonTransactionsWithNewGroupIds()
    {
      foreach (JsonTransaction transaction in _model.CreatedObjects.Transactions)
        UpdateJsonTransactionEmptyGroupId(transaction);
      
      foreach (JsonTransaction transaction in _model.UpdatedObjects.Transactions)
        UpdateJsonTransactionEmptyGroupId(transaction);
    }

    private void UpdateJsonTransactionEmptyGroupId(JsonTransaction transaction)
    {
      if (transaction.GroupId == Guid.Empty)
      {
        AddedEntity<Group> addedGroup = _addedGroups.Where(x => x.ClientId == transaction.GroupClientId).FirstOrDefault();
        if (addedGroup != null)
          transaction.GroupId = addedGroup.Entity.Id;
      }
    }

    private void ProcessPeople()
    {
      foreach (JsonPerson jsonPerson in _model.CreatedObjects.People)
      {
        Person person = _personService.PopulatePerson(new Person(),jsonPerson);
        _personService.Add(person);
        _addedPeople.Add(new AddedEntity<Person>()
        {
          Entity = person,
          ClientId = jsonPerson.ClientId
        });
      }
    }

    private void UpdateModelWithNewPeopleIds()
    {
      foreach (JsonTransaction transaction in _model.CreatedObjects.Transactions)
        UpdateJsonTransactionWithNewPeopleIds(transaction);

      foreach (JsonTransaction transaction in _model.UpdatedObjects.Transactions)
        UpdateJsonTransactionWithNewPeopleIds(transaction);
    }

    private void UpdateJsonTransactionWithNewPeopleIds(JsonTransaction transaction)
    {
      foreach (int payeeClientId in transaction.PayeesClientIds)
      {
        AddedEntity<Person> payee = _addedPeople.Where(x => x.ClientId == payeeClientId).FirstOrDefault();
        if (payee != null && payee.Entity != null)
          transaction.Payees.Add(payee.Entity.Id);
      }

      AddedEntity<Person> payer = _addedPeople.Where(x => x.ClientId == transaction.PayerClientId).FirstOrDefault();
      if (payer != null && payer.Entity != null)
        transaction.PayerId = payer.Entity.Id;
    }

    private void ProcessTransactions()
    {
      foreach (JsonTransaction jsonTransaction in _model.CreatedObjects.Transactions)
      {
        try
        {
          Transaction transaction = _transactionService.PopulateTransaction(new Transaction(), jsonTransaction);
          _unitOfWork.StorageContext.Transactions.Add(transaction);
          _addedTransactions.Add(new AddedEntity<Transaction>()
          {
            Entity = transaction,
            ClientId = jsonTransaction.ClientId
          });
        }
        catch(Exception e)
        {
          //log error
        }
      }
    }

    private List<CreatedId> GenerateEntityInReturnList<T>(List<AddedEntity<T>> addedEntities) where T : IEntity
    {
      List<CreatedId> createdIds = new List<CreatedId>();
      foreach(AddedEntity<T> addedEntity in addedEntities)
      {
        createdIds.Add(new CreatedId()
        {
          ClientId = addedEntity.ClientId,
          Id = addedEntity.Entity.Id
        });
      }
      return createdIds;
    }
  }
}

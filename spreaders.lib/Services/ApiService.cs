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
    List<AddedEntity<Group>> _groupsToUpdate;
    List<AddedEntity<Person>> _peopleToUpdate;
    List<AddedEntity<Transaction>> _transactionsToUpdate;

    public ApiService(IUnitOfWork unitOfWork, ApiUpdateJsonModel model)
    {
      _unitOfWork = unitOfWork;
      _groupService = new GroupService(_unitOfWork);
      _personService = new PersonService(_unitOfWork);
      _transactionService = new TransactionService(_unitOfWork);

      _model = model;
      _groupsToUpdate = new List<AddedEntity<Group>>();
      _peopleToUpdate = new List<AddedEntity<Person>>();
      _transactionsToUpdate = new List<AddedEntity<Transaction>>();
    }

    public void ProcessCreatedObjects()
    {
      if (_model == null || _model.CreatedObjects == null)
        return;

      ProcessGroups();
      _unitOfWork.Commit();
      UpdateModelWithNewGroupIds();

      ProcessPeople();
      _unitOfWork.Commit();
      UpdateModelWithNewPeopleIds();

      ProcessTransactions();
    }

    public void ProcessUpdatedObjects()
    {
      if (_model == null || _model.UpdatedObjects == null)
        return;

      foreach(JsonGroup jsonGroup in _model.UpdatedObjects.Groups)
      {
        Group group = _groupService.Get(jsonGroup.Id);
        group = _groupService.PopulateGroup(group, jsonGroup);
        _groupsToUpdate.Add(new AddedEntity<Group>(group, jsonGroup.ClientId));
      }

      foreach (JsonPerson jsonPerson in _model.UpdatedObjects.People)
      {
        Person person = _personService.Get(jsonPerson.Id);
        person = _personService.PopulatePerson(person, jsonPerson);
        _peopleToUpdate.Add(new AddedEntity<Person>(person, jsonPerson.ClientId));
      }

      foreach (JsonTransaction jsonTransaction in _model.UpdatedObjects.Transactions)
      {
        Transaction transaction = _transactionService.Get(jsonTransaction.Id);
        transaction = _transactionService.PopulateTransaction(transaction, jsonTransaction);
        _transactionsToUpdate.Add(new AddedEntity<Transaction>(transaction, jsonTransaction.ClientId));
      }
      _unitOfWork.Commit();
    }

    public ApiUpdateJsonReturnModel GenerateReturnModel()
    {
      ApiUpdateJsonReturnModel returnModel = returnModel = new ApiUpdateJsonReturnModel();

      returnModel.GroupsToUpdate = GenerateGroupsInReturnList(_groupsToUpdate);
      returnModel.PeopleToUpdate = GeneratePeopleInReturnList(_peopleToUpdate);
      returnModel.TransactionsToUpdate = GenerateTransactionsInReturnList(_transactionsToUpdate);

      return returnModel;
    }

    private void ProcessGroups()
    {
      foreach (JsonGroup jsonGroup in _model.CreatedObjects.Groups)
      {
        Group group = _groupService.PopulateGroup(new Group(), jsonGroup);
        _groupService.Add(group);
        _groupsToUpdate.Add(new AddedEntity<Group>(group, jsonGroup.ClientId));
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
        AddedEntity<Group> addedGroup = _groupsToUpdate.Where(x => x.ClientId == person.GroupClientId).FirstOrDefault();
        if (addedGroup != null)
        {
          person.GroupId = addedGroup.Entity.Id;
        }
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
        AddedEntity<Group> addedGroup = _groupsToUpdate.Where(x => x.ClientId == transaction.GroupClientId).FirstOrDefault();
        if (addedGroup != null)
          transaction.GroupId = addedGroup.Entity.Id;
      }
    }

    private void ProcessPeople()
    {
      foreach (JsonPerson jsonPerson in _model.CreatedObjects.People)
      {
        Person person = _personService.PopulatePerson(new Person(), jsonPerson);
        _personService.Add(person);
        _peopleToUpdate.Add(new AddedEntity<Person>(person, jsonPerson.ClientId));
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
        AddedEntity<Person> payee = _peopleToUpdate.Where(x => x.ClientId == payeeClientId).FirstOrDefault();
        if (payee != null && payee.Entity != null)
          transaction.Payees.Add(payee.Entity.Id);
      }

      AddedEntity<Person> payer = _peopleToUpdate.Where(x => x.ClientId == transaction.PayerClientId).FirstOrDefault();
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
          _transactionsToUpdate.Add(new AddedEntity<Transaction>(transaction, jsonTransaction.ClientId));
        }
        catch
        {
          //log error
        }
      }
    }

    private List<JsonGroup> GenerateGroupsInReturnList(List<AddedEntity<Group>> addedEntities)
    {
      List<JsonGroup> createdGroups = new List<JsonGroup>();
      foreach (AddedEntity<Group> addedEntity in addedEntities.Distinct())
      {
        createdGroups.Add(new JsonGroup()
        {
          ClientId = addedEntity.ClientId,
          Id = addedEntity.Entity.Id,
          Name = addedEntity.Entity.Name
        });
      }
      return createdGroups;
    }

    private List<JsonPerson> GeneratePeopleInReturnList(List<AddedEntity<Person>> addedEntities)
    {
      List<JsonPerson> createdPeople = new List<JsonPerson>();
      foreach (AddedEntity<Person> addedEntity in addedEntities.Distinct())
      {
        createdPeople.Add(new JsonPerson()
        {
          ClientId = addedEntity.ClientId,
          Id = addedEntity.Entity.Id,
          Name = addedEntity.Entity.Name,
          Deleted = addedEntity.Entity.Deleted,
          GroupId = addedEntity.Entity.GroupId
        });
      }
      return createdPeople;
    }

    private List<JsonTransaction> GenerateTransactionsInReturnList(List<AddedEntity<Transaction>> addedEntities)
    {
      List<JsonTransaction> createdTransactions = new List<JsonTransaction>();
      foreach (AddedEntity<Transaction> addedEntity in addedEntities.Distinct())
      {
        createdTransactions.Add(new JsonTransaction()
        {
          ClientId = addedEntity.ClientId,
          Id = addedEntity.Entity.Id,
          GroupId = addedEntity.Entity.GroupId,
          Payees = addedEntity.Entity.Payees.Select(x => x.Id).ToList<Guid>(),
          PayerId = addedEntity.Entity.PayerId,
          Deleted = addedEntity.Entity.Deleted,
          Amount = addedEntity.Entity.Amount,
          Description = addedEntity.Entity.Description
        });
      }
      return createdTransactions;
    }
  }
}

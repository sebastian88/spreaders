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
  public class ApiGroupService
  {
    private IUnitOfWork _unitOfWork;
    private EntityService _entityService;
    public ApiGroupService(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
      _entityService = new EntityService();
    }

    public ApiGetGroupReturnModel GenerateReturnModel(Group group)
    {
      ApiGetGroupReturnModel model = new ApiGetGroupReturnModel();
      if(group != null)
      {
        model.Group = MapToJsonGroup(group);
        model.Transactions = MapToJsonTransactions(group.Transactions);
        model.People = MapToJsonPeople(group.People);
      }
      return model;
    }

    private JsonGroup MapToJsonGroup(Group group)
    {
      var jsonGroup = new JsonGroup
      {
        Id = group.Id,
        Name = group.Name
      };
      return _entityService.UpdateJsonFromEntity(jsonGroup, group);
    }

    private List<JsonTransaction> MapToJsonTransactions(ICollection<Transaction> transactions)
    {
      List<JsonTransaction> jsonTransactions = new List<JsonTransaction>();
      foreach(Transaction transaction in transactions)
        jsonTransactions.Add(MapToJsonTransaction(transaction));
      return jsonTransactions;
    }

    private JsonTransaction MapToJsonTransaction(Transaction transaction)
    {
      var jsonTransaction = new JsonTransaction
      {
        Id = transaction.Id,
        Amount = transaction.Amount,
        IsDeleted = transaction.IsDeleted,
        Description = transaction.Description,
        GroupId = transaction.GroupId,
        Payees = transaction.Payees.Select(x => x.Id).ToList(),
        PayerId = transaction.PayerId
      };

      return _entityService.UpdateJsonFromEntity(jsonTransaction, transaction);
    }

    private List<JsonPerson> MapToJsonPeople(ICollection<Person> people)
    {
      List<JsonPerson> jsonPeople = new List<JsonPerson>();
      foreach (Person person in people)
        jsonPeople.Add(MaptoJsonPerson(person));
      return jsonPeople;
    }
        
    private JsonPerson MaptoJsonPerson(Person person)
    {
      var jsonPerson = new JsonPerson
      {
        Id = person.Id,
        Name = person.Name,
        Colour = person.Colour,
        IsDeleted = person.IsDeleted,
        GroupId = person.GroupId
      };

      return _entityService.UpdateJsonFromEntity(jsonPerson, person);
    }
  }
}

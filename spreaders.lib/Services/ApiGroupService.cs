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
    public ApiGroupService(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
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
      return new JsonGroup
      {
        Id = group.Id,
        Name = group.Name
      };
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
      return new JsonTransaction
      {
        Id = transaction.Id,
        Amount = transaction.Amount,
        Deleted = transaction.Deleted,
        Description = transaction.Description,
        GroupId = transaction.GroupId,
        Payees = transaction.Payees.Select(x => x.Id).ToList(),
        PayerId = transaction.PayerId
      };
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
      return new JsonPerson
      {
        Id = person.Id,
        Name = person.Name,
        Deleted = person.Deleted,
        GroupId = person.GroupId
      };
    }
  }
}

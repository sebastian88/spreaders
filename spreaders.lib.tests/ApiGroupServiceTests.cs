using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using spreaders.lib.Services;
using spreaders.lib.Models.Dtos.Json;
using spreaders.lib.models.Entities;
using System.Collections.Generic;
using System.Linq;

namespace spreaders.lib.tests
{
  [TestClass]
  public class ApiGroupServiceTests
  {
    public ApiGroupService Setup()
    {
      return new ApiGroupService(null);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_NullGroup_ReturnedModelIsNotNull()
    {
      ApiGroupService service = Setup();

      ApiGetGroupReturnModel model = service.GetReturnModel(null);

      Assert.IsNotNull(model);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_NullGroup_ReturnedModelsGroupIsNull()
    {
      ApiGroupService service = Setup();

      ApiGetGroupReturnModel model = service.GetReturnModel(null);

      Assert.IsNull(model.Group);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_NullGroup_ReturnedModelsPeopleIsNotNull()
    {
      ApiGroupService service = Setup();

      ApiGetGroupReturnModel model = service.GetReturnModel(null);

      Assert.IsNotNull(model.People);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_NullGroup_ReturnedModelsTransactionsIsNotNull()
    {
      ApiGroupService service = Setup();

      ApiGetGroupReturnModel model = service.GetReturnModel(null);

      Assert.IsNotNull(model.Transactions);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_GroupNameSet_ReturnedModelContainsGroupName()
    {
      ApiGroupService service = Setup();
      Group group = new Group { Name = "Test1" };

      ApiGetGroupReturnModel model = service.GetReturnModel(group);

      Assert.AreEqual("Test1", model.Group.Name);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_GroupIdSet_ReturnedModelContainsGroupId()
    {
      ApiGroupService service = Setup();
      Guid expectedId = new Guid("88888888-4444-4444-4444-222222222222");
      Group group = new Group { Id = expectedId };

      ApiGetGroupReturnModel model = service.GetReturnModel(group);

      Assert.AreEqual(expectedId, model.Group.Id);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_GroupHas1Transaction_ReturnedModelContains1Transaction()
    {
      ApiGroupService service = Setup();
      List<Transaction> transactions = new List<Transaction> { new Transaction() };
      Group group = new Group { Transactions = transactions };

      ApiGetGroupReturnModel model = service.GetReturnModel(group);

      Assert.AreEqual(1, model.Transactions.Count);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_GroupHas2Transactions_ReturnedModelContains2Transactions()
    {
      ApiGroupService service = Setup();
      List<Transaction> transactions = new List<Transaction> { new Transaction(), new Transaction() };
      Group group = new Group { Transactions = transactions };

      ApiGetGroupReturnModel model = service.GetReturnModel(group);

      Assert.AreEqual(2, model.Transactions.Count);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_TransactionWithAmount10_ReturnedModelContainsTransactionWithAmount10()
    {
      ApiGroupService service = Setup();
      List<Transaction> transactions = new List<Transaction> { new Transaction { Amount = 10 }};
      Group group = new Group { Transactions = transactions };

      ApiGetGroupReturnModel model = service.GetReturnModel(group);

      Assert.AreEqual(10, model.Transactions.FirstOrDefault().Amount);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_TransactionWithAmount12_ReturnedModelContainsTransactionWithAmount12()
    {
      ApiGroupService service = Setup();
      List<Transaction> transactions = new List<Transaction> { new Transaction { Amount = 12 } };
      Group group = new Group { Transactions = transactions };

      ApiGetGroupReturnModel model = service.GetReturnModel(group);

      Assert.AreEqual(12, model.Transactions.FirstOrDefault().Amount);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_TransactionWith1Payee_ReturnedModelContainsTransactionWith1Payee()
    {
      ApiGroupService service = Setup();
      List<Transaction> transactions = new List<Transaction> { new Transaction { Payees = new List<Person> { new Person() } } };
      Group group = new Group { Transactions = transactions };

      ApiGetGroupReturnModel model = service.GetReturnModel(group);

      Assert.AreEqual(1, model.Transactions.FirstOrDefault().Payees.Count);
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_TransactionWithPayee_ReturnedModelContainsTransactionWithCorrectPayeeGuid()
    {
      ApiGroupService service = Setup();
      Guid expectedId = new Guid("88888888-4444-4444-4444-222222222222");
      List<Transaction> transactions = new List<Transaction> { new Transaction { Payees = new List<Person> { new Person { Id = expectedId } } } };
      Group group = new Group { Transactions = transactions };

      ApiGetGroupReturnModel model = service.GetReturnModel(group);

      Assert.AreEqual(expectedId, model.Transactions.First().Payees.First());
    }

    [TestMethod]
    public void ApiGroupService_GetReturnModel_TransactionWithPayer_ReturnedModelContainsTransactionWithCorrectPayerGuid()
    {
      ApiGroupService service = Setup();
      Guid expectedId = new Guid("88888888-4444-4444-4444-222222222222");
      List<Transaction> transactions = new List<Transaction> { new Transaction { Payer = new Person { Id = expectedId } } };
      Group group = new Group { Transactions = transactions };

      ApiGetGroupReturnModel model = service.GetReturnModel(group);

      Assert.AreEqual(expectedId, model.Transactions.First().PayerId);
    }


  }
}

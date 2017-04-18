using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using spreaders.lib.Services;
using spreaders.lib.models.Entities;
using System.Collections.Generic;
using System.Data.Entity;
using Moq;
using System.Linq;
using spreaders.lib.Context.Interfaces;
using spreaders.lib.context;
using spreaders.lib.Context;
using spreaders.lib.Models.Dtos.Json;

namespace spreaders.lib.tests
{
  [TestClass]
  public class ApiServiceTests
  {

    private IUnitOfWork Setup()
    {
      List<Group> groups = new List<Group>();
      List<Person> people = new List<Person>();
      List<Transaction> transactions = new List<Transaction>();

      var mockContext = new Mock<StorageContext>();
      mockContext.Setup(m => m.Groups).Returns(CreateMockDbSet<Group>(groups));
      mockContext.Setup(m => m.People).Returns(CreateMockDbSet<Person>(people));
      mockContext.Setup(m => m.Transactions).Returns(CreateMockDbSet<Transaction>(transactions));

      var mockRep = new Mock<UnitOfWork>(mockContext.Object)
                     .As<IUnitOfWork>();

      mockRep.CallBase = true;
      mockRep.Setup(x => x.Commit()).Callback(() => {
        groups.ForEach(delegate (Group group)
        {
          if(group.Id == Guid.Empty)
            group.Id = Guid.NewGuid();
        });
        people.ForEach(delegate (Person person)
        {
          if (person.Id == Guid.Empty)
            person.Id = Guid.NewGuid();
        });
        transactions.ForEach(delegate (Transaction transaction)
        {
          if (transaction.Id == Guid.Empty)
            transaction.Id = Guid.NewGuid();
        });
      });

      IUnitOfWork unitOfWork = new UnitOfWork(mockContext.Object);

      return mockRep.Object;
    }

    private DbSet<T> CreateMockDbSet<T>(List<T> data) where T : class
    {
      var mockDocumentDbSet = new Mock<DbSet<T>>();
      mockDocumentDbSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(data.AsQueryable().Provider);
      mockDocumentDbSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(data.AsQueryable().Expression);
      mockDocumentDbSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(data.AsQueryable().ElementType);
      mockDocumentDbSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
      mockDocumentDbSet.Setup(m => m.Add(It.IsAny<T>())).Callback<T>(data.Add);

      return mockDocumentDbSet.Object;
    }

    private ApiUpdateJsonModel SetupGroupsForAdd(List<string> names)
    {
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      foreach (string name in names)
      {
        model.CreatedObjects.Groups.Add(new JsonGroup()
        {
          Name = name
        });
      }
      return model;
    }

    private ApiUpdateJsonModel SetupPeopleForAdd(List<string> names)
    {
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      foreach (string name in names)
      {
        model.CreatedObjects.People.Add(new JsonPerson()
        {
          Name = name,
        });
      }
      return model;
    }

    private void AddTransactionToModel(
      ApiUpdateJsonModel model, 
      int id = 1, 
      decimal amount = 10, 
      string description = "", 
      int groupClientId = 1,
      Guid groupId = new Guid(),
      int payerClientId = 1,
      Guid payerId = new Guid(),
      List<int> payeesClientIds = null,
      List<Guid> payeesIds = null
      )
    {
      model.CreatedObjects.Transactions.Add(new JsonTransaction()
      {
        ClientId = id,
        Amount = amount,
        Description = description,
        GroupClientId = groupClientId,
        GroupId = groupId,
        PayerClientId = payerClientId,
        PayerId = payerId,
        PayeesClientIds = payeesClientIds ?? new List<int>(),
        Payees = payeesIds ?? new List<Guid>()
      });
    }

    private void AddGroupToStorage(IUnitOfWork unitOfWork, Guid id, string name)
    {
      unitOfWork.StorageContext.Groups.Add(new Group()
      {
        Id = id,
        Name = "test1"
      });
    }

    private void AddPersonToStorage(IUnitOfWork unitOfWork, Guid id, string name, Guid groupId)
    {
      unitOfWork.StorageContext.People.Add(new Person()
      {
        Id = id,
        Name = "test1",
        GroupId = groupId
      });
    }

    private void AddTransactionIntoStorage(
      IUnitOfWork unitOfWork, 
      Guid id, 
      decimal amount, 
      Guid groupId = new Guid(), 
      Guid payerId = new Guid(),
      HashSet<Person> payeeIds = null)
    {
      if (payeeIds == null)
        payeeIds = new HashSet<Person>();

      unitOfWork.StorageContext.Transactions.Add(new Transaction()
      {
        Id = id,
        Amount = amount,
        GroupId = groupId,
        PayerId = payerId,
        Payees = payeeIds
      });
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_NullModel_DoesNotError()
    {
      ApiService apiService = new ApiService(null, null);

      try
      {
        apiService.ProcessCreatedObjects();
      }
      catch (Exception ex)
      {
        Assert.Fail("Expected no exception, but got: " + ex.Message);
      }
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_EmptyModel_DoesNotError()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiService apiService = new ApiService(unitOfWork, new ApiUpdateJsonModel());

      try
      {
        apiService.ProcessCreatedObjects();
      }
      catch (Exception ex)
      {
        Assert.Fail("Expected no exception, but got: " + ex.Message);
      }
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_ModelWithOneGroup_GroupAddedToStorage()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "one" });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.AreEqual(unitOfWork.StorageContext.Groups.Count(), 1);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_ModelWithTwoGroup_GroupsAddedToStorage()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "one", "two" });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.AreEqual(unitOfWork.StorageContext.Groups.Count(), 2);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddGroupWithName_NameOfGroupIsSaved()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "test" });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.AreEqual(unitOfWork.StorageContext.Groups.First().Name, "test");
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTwoGroupsWithNames_NamesOfGroupsAreSaved()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "test1", "test2" });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Group group = unitOfWork.StorageContext.Groups.Where(x => string.Equals(x.Name, "test2")).FirstOrDefault();
      Assert.AreEqual(group.Name, "test2");
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddGroup_ReturnedObjectNotNull()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "test1" });
      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Assert.IsNotNull(returnModel);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddGroup_CreatedIdInReturnedObject()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "test1" });
      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Assert.IsNotNull(returnModel.GroupsToUpdate.First().Id);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddGroup_ReturnedObjectGroupCountIs1()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "test1" });
      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Assert.AreEqual(1, returnModel.GroupsToUpdate.Count);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_Add2Groups_ReturnedObjectGroupCountIs2()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "test1", "test2" });
      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Assert.AreEqual(2, returnModel.GroupsToUpdate.Count);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddGroup_ReturnedObjectContaineNewGroupId()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "test1" });
      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Assert.AreEqual(unitOfWork.StorageContext.Groups.First().Id, returnModel.GroupsToUpdate.First().Id);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_Add2Groups_ReturnedObjectContainsSecondNewGroupId()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupGroupsForAdd(new List<string>() { "test1", "test2" });
      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();


			Assert.AreEqual(unitOfWork.StorageContext.Groups.Skip(1).First().Id, returnModel.GroupsToUpdate.Skip(1).First().Id);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_ModelWithOnePerson_PersonAddedToStorage()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupPeopleForAdd(new List<string>() { "one" });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.AreEqual(unitOfWork.StorageContext.People.Count(), 1);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_ModelWithTwoPeople_PeopleStorageCountEquals2()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupPeopleForAdd(new List<string>() { "one", "two" });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.AreEqual(unitOfWork.StorageContext.People.Count(), 2);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddPersonWithName_NameOfPersonIsSaved()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupPeopleForAdd(new List<string>() { "test1" });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Person person = unitOfWork.StorageContext.People.FirstOrDefault();
      Assert.AreEqual(person.Name, "test1");
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddPeopleWithNames_NamesOfPeopleAreSaved()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupPeopleForAdd(new List<string>() { "test1", "test2" });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Person person = unitOfWork.StorageContext.People.Skip(1).FirstOrDefault();
      Assert.AreEqual(person.Name, "test2");
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddPeopleWithGroupId_GroupIdSaved()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.Groups.Add(new JsonGroup()
      {
        ClientId = 2,
        Name = "Group1"
      });
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        GroupClientId = 2,
        Name = "Person1"
      });

      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Group group = unitOfWork.StorageContext.Groups.First();
      Person person = unitOfWork.StorageContext.People.First();
      Assert.AreEqual(group.Id, person.GroupId);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddPerson_PersonIdIsAddedToReturnModel()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupPeopleForAdd(new List<string>() { "test1" });
      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Assert.AreEqual(unitOfWork.StorageContext.People.First().Id, returnModel.PeopleToUpdate.First().Id);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_Add2Peple_2stPersonAddedToReturnModel()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupPeopleForAdd(new List<string>() { "test1", "test2" });
      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Assert.AreEqual(unitOfWork.StorageContext.People.First().Id, returnModel.PeopleToUpdate.First().Id);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_Add2Peple_2ndPersonAddedToReturnModel()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = SetupPeopleForAdd(new List<string>() { "test1", "test2" });
      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Assert.AreEqual(unitOfWork.StorageContext.People.Skip(1).First().Id, returnModel.PeopleToUpdate.Skip(1).First().Id);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTrasaction_TransactionAddedToStorage()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      AddTransactionToModel(model);
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.AreEqual(1, unitOfWork.StorageContext.Transactions.Count());
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTrasaction_TransactionInStorageHasCorrectAmount()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      AddTransactionToModel(model, amount: 10);
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.AreEqual(10, unitOfWork.StorageContext.Transactions.First().Amount);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTrasaction_TransactionInStorageHasCorrectDescription()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      AddTransactionToModel(model, description: "test");
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.AreEqual("test", unitOfWork.StorageContext.Transactions.First().Description);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTrasaction_TransactionInStorageHasCorrectPayerId()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      Guid payerId = Guid.NewGuid();
      AddTransactionToModel(model, payerId: payerId);
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.AreEqual(payerId, unitOfWork.StorageContext.Transactions.First().PayerId);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTrasaction_TransactionInStorageHasCorrectPayee()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      Guid id1 = new Guid("88888888-4444-4444-4444-222222222222");
      Guid id2 = new Guid("88888888-4444-4444-4444-111111111111");
      unitOfWork.StorageContext.People.Add(new Person()
      {
        Id = id1,
        Name = "Person1"
      });
      unitOfWork.StorageContext.People.Add(new Person()
      {
        Id = id2,
        Name = "Person2"
      });
      AddTransactionToModel(model, payeesIds: new List<Guid>() { id1, id2 });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Assert.IsNotNull(unitOfWork.StorageContext.Transactions.First().Payees.Where(x => x.Id == id1).First());
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTransactionWithCientIds_TransactionInStorageHas2Payees()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      int id1 = 1;
      int id2 = 2;
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = id1
      });
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = id2
      });
      AddTransactionToModel(model, payeesClientIds: new List<int>() { id1, id2 });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();
      
      Assert.AreEqual(2, unitOfWork.StorageContext.Transactions.First().Payees.Count);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTransactionWithCientIds_TransactionInStorageHasCorrectPayeeId()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      int id1 = 1;
      int id2 = 2;
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = id1
      });
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = id2
      });
      AddTransactionToModel(model, payeesClientIds: new List<int>() { id1, id2 });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Guid payeeId = unitOfWork.StorageContext.People.First().Id;
      Assert.IsNotNull(unitOfWork.StorageContext.Transactions.First().Payees.Where(x => x.Id == payeeId).First());
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTransactionWithSameCientIds_TransactionInStorageHasCorrectPayeeId()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      int id1 = 1;
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = id1
      });
      AddTransactionToModel(model, payeesClientIds: new List<int>() { id1, id1 });
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Guid payeeId = unitOfWork.StorageContext.People.First().Id;
      Assert.AreEqual(1, unitOfWork.StorageContext.Transactions.First().Payees.Count);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTransactionWithPayerCientIds_TransactionInStorageHasCorrectPayerId()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      int id1 = 1;
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = id1
      });
      AddTransactionToModel(model, payerClientId: id1);
      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Guid payerId = unitOfWork.StorageContext.People.First().Id;
      Assert.AreEqual(unitOfWork.StorageContext.Transactions.First().PayerId, payerId);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTransactionWithGroupId_GroupIdSavedOnTransaction()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.Groups.Add(new JsonGroup()
      {
        ClientId = 2,
        Name = "Group1"
      });
      model.CreatedObjects.Transactions.Add(new JsonTransaction()
      {
        GroupClientId = 2
      });

      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();

      Group group = unitOfWork.StorageContext.Groups.First();
      Transaction transaction = unitOfWork.StorageContext.Transactions.First();
      Assert.AreEqual(group.Id, transaction.GroupId);
    }

    [TestMethod]
    public void ApiService_ProcessCreatedObjects_AddTransaction_NewIdAddedToReturnModel()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      AddTransactionToModel(model);

      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Assert.AreEqual(1, returnModel.TransactionsToUpdate.Count);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_NullModel_DoesNotError()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiService apiService = new ApiService(unitOfWork, null);

      try
      {
        apiService.ProcessUpdatedObjects();
      }
      catch (Exception ex)
      {
        Assert.Fail("Expected no exception, but got: " + ex.Message);
      }
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_NullUpdatedObjects_DoesNotError()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.UpdatedObjects = null;
      ApiService apiService = new ApiService(unitOfWork, model);

      try
      {
        apiService.ProcessUpdatedObjects();
      }
      catch (Exception ex)
      {
        Assert.Fail("Expected no exception, but got: " + ex.Message);
      }
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_EmptyModel_DoesNotError()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiService apiService = new ApiService(unitOfWork, new ApiUpdateJsonModel());

      try
      {
        apiService.ProcessUpdatedObjects();
      }
      catch (Exception ex)
      {
        Assert.Fail("Expected no exception, but got: " + ex.Message);
      }
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_UpdateGroupName_NameIsUpdated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid GroupId = new Guid("88888888-4444-4444-4444-222222222222");
      AddGroupToStorage(unitOfWork, GroupId, "test1");

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.UpdatedObjects.Groups.Add(new JsonGroup()
      {
        Id = GroupId,
        Name = "test2"
      });

      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessUpdatedObjects();

      Assert.AreEqual("test2", unitOfWork.StorageContext.Groups.First().Name);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_UpdatePersonName_NameIsUpdated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid personId = new Guid("88888888-4444-4444-4444-222222222222");
      AddPersonToStorage(unitOfWork, personId, "test1", Guid.Empty);

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.UpdatedObjects.People.Add(new JsonPerson()
      {
        Id = personId,
        Name = "test2"
      });

      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessUpdatedObjects();

      Assert.AreEqual("test2", unitOfWork.StorageContext.People.First().Name);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_UpdatePersonsGroup_GroupIsUpdated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid personId = new Guid("88888888-4444-4444-4444-222222222222");
      Guid group1Id = new Guid("88888888-1111-4444-4444-222222222222");
      Guid group2Id = new Guid("88888888-2222-4444-4444-222222222222");
      AddGroupToStorage(unitOfWork, group1Id, "group1");
      AddGroupToStorage(unitOfWork, group2Id, "group2");
      AddPersonToStorage(unitOfWork, personId, "test1", group1Id);

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.UpdatedObjects.People.Add(new JsonPerson()
      {
        Id = personId,
        Name = "test2",
        GroupId = group2Id
      });

      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessUpdatedObjects();

      Assert.AreEqual(group2Id, unitOfWork.StorageContext.People.First().GroupId);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_UpdateTransacionsAmount_AmountIsUpdated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid transactionId = new Guid("88888888-4444-4444-4444-222222222222");
      AddTransactionIntoStorage(unitOfWork, transactionId, 1);
      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.UpdatedObjects.Transactions.Add(new JsonTransaction()
      {
        Id = transactionId,
        Amount = 2
      });

      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessUpdatedObjects();

      Assert.AreEqual(2, unitOfWork.StorageContext.Transactions.First().Amount);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_CreateGroupAndUpdatePerson_PersonHasCorrectGroupId()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid person1Id = new Guid("88888888-4444-4444-4444-222222222222");
      Guid group1Id = new Guid("88888888-1111-4444-4444-222222222222");
      AddGroupToStorage(unitOfWork, group1Id, "group1");
      AddPersonToStorage(unitOfWork, person1Id, "test1", group1Id);

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.Groups.Add(new JsonGroup()
      {
        ClientId = 1,
        Name = "group2"
      });
      model.UpdatedObjects.People.Add(new JsonPerson()
      {
        Id = person1Id,
        Name = "test2",
        GroupClientId = 1
      });

      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			apiService.ProcessUpdatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Guid createdGroupId = returnModel.GroupsToUpdate.First().Id;
      Assert.AreEqual(createdGroupId, unitOfWork.StorageContext.People.First().GroupId);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_CreateGroupAndUpdateTransaction_TransactionHasCorrectGroupId()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid transaction1Id = new Guid("88888888-4444-4444-4444-222222222222");
      Guid group1Id = new Guid("88888888-1111-4444-4444-222222222222");
      AddGroupToStorage(unitOfWork, group1Id, "group1");
      AddTransactionIntoStorage(unitOfWork, transaction1Id, 10, group1Id);

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.Groups.Add(new JsonGroup()
      {
        ClientId = 1,
        Name = "group2"
      });
      model.UpdatedObjects.Transactions.Add(new JsonTransaction()
      {
        Id = transaction1Id,
        GroupClientId = 1
      });

      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			apiService.ProcessUpdatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Guid createdGroupId = returnModel.GroupsToUpdate.First().Id;
      Assert.AreEqual(createdGroupId, unitOfWork.StorageContext.Transactions.First().GroupId);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_CreatePersonAndUpdateTransaction_TransactionHasCorrectPayerId()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid transaction1Id = new Guid("88888888-4444-4444-4444-222222222222");
      Guid person1Id = new Guid("88888888-1111-4444-4444-222222222222");
      AddPersonToStorage(unitOfWork, person1Id, "person1", Guid.Empty);
      AddTransactionIntoStorage(unitOfWork, transaction1Id, 10, payerId: person1Id);

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = 1,
        Name = "person2"
      });
      model.UpdatedObjects.Transactions.Add(new JsonTransaction()
      {
        Id = transaction1Id,
        PayerClientId = 1
      });

      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			apiService.ProcessUpdatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Guid createdPersonId = returnModel.PeopleToUpdate.First().Id;
      Assert.AreEqual(createdPersonId, unitOfWork.StorageContext.Transactions.First().PayerId);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_CreatePersonAndUpdateTransaction_TransactionHasPayeeCountOf1()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid transaction1Id = new Guid("88888888-4444-4444-4444-222222222222");
      Guid person1Id = new Guid("88888888-1111-4444-4444-222222222222");
      AddPersonToStorage(unitOfWork, person1Id, "person1", Guid.Empty);
      AddTransactionIntoStorage(unitOfWork, transaction1Id, 10, payeeIds: new HashSet<Person>() { unitOfWork.StorageContext.People.First() });

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = 1,
        Name = "person2"
      });
      model.UpdatedObjects.Transactions.Add(new JsonTransaction()
      {
        Id = transaction1Id,
        PayeesClientIds = new List<int>() { 1 }
      });

      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();
      apiService.ProcessUpdatedObjects();
      
      Assert.AreEqual(1, unitOfWork.StorageContext.Transactions.First().Payees.Count);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_CreatePersonAndUpdateTransaction_TransactionCorrectPayeeId()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid transaction1Id = new Guid("88888888-4444-4444-4444-222222222222");
      Guid person1Id = new Guid("88888888-1111-4444-4444-222222222222");
      AddPersonToStorage(unitOfWork, person1Id, "person1", Guid.Empty);
      AddTransactionIntoStorage(unitOfWork, transaction1Id, 10, payeeIds: new HashSet<Person>() { unitOfWork.StorageContext.People.First() });

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = 1,
        Name = "person2"
      });
      model.UpdatedObjects.Transactions.Add(new JsonTransaction()
      {
        Id = transaction1Id,
        PayeesClientIds = new List<int>() { 1 }
      });

      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			apiService.ProcessUpdatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Guid createdPersonId = returnModel.PeopleToUpdate.First().Id;
      Assert.AreEqual(createdPersonId, unitOfWork.StorageContext.Transactions.First().Payees.First().Id);
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_UpdateTransactionMixOfClientAndDbIds_TransactionHasPayeeCountOf2()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid transaction1Id = new Guid("88888888-4444-4444-4444-222222222222");
      Guid person1Id = new Guid("88888888-1111-4444-4444-222222222222");
      AddPersonToStorage(unitOfWork, person1Id, "person1", Guid.Empty);
      AddTransactionIntoStorage(unitOfWork, transaction1Id, 10, payeeIds: new HashSet<Person>() { unitOfWork.StorageContext.People.First() });

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = 1,
        Name = "person2"
      });
      model.UpdatedObjects.Transactions.Add(new JsonTransaction()
      {
        Id = transaction1Id,
        Payees = new List<Guid>() { person1Id },
        PayeesClientIds = new List<int>() { 1 }
      });

      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();
      apiService.ProcessUpdatedObjects();
      
      Assert.AreEqual(2, unitOfWork.StorageContext.Transactions.First().Payees.Count);
    }
    
    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_UpdateTransactionMixOfClientAndDbIds_TransactionHasIdOfDbPayee()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid transaction1Id = new Guid("88888888-4444-4444-4444-222222222222");
      Guid person1Id = new Guid("88888888-1111-4444-4444-222222222222");
      AddPersonToStorage(unitOfWork, person1Id, "person1", Guid.Empty);
      AddTransactionIntoStorage(unitOfWork, transaction1Id, 10, payeeIds: new HashSet<Person>() { unitOfWork.StorageContext.People.First() });

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = 1,
        Name = "person2"
      });
      model.UpdatedObjects.Transactions.Add(new JsonTransaction()
      {
        Id = transaction1Id,
        Payees = new List<Guid>() { person1Id },
        PayeesClientIds = new List<int>() { 1 }
      });

      ApiService apiService = new ApiService(unitOfWork, model);

			apiService.ProcessCreatedObjects();
			apiService.ProcessUpdatedObjects();
			ApiUpdateJsonReturnModel returnModel = apiService.GenerateReturnModel();

			Guid createdPersonId = returnModel.PeopleToUpdate.First().Id;
      IEnumerable<Guid> payeeGuids = unitOfWork.StorageContext.Transactions.First().Payees.Select(x => x.Id).ToList();
      Assert.IsTrue(payeeGuids.Contains(createdPersonId));
    }

    [TestMethod]
    public void ApiService_ProcessUpdatedObjects_UpdateTransactionMixOfClientAndDbIds_TransactionHasIdOfClientPayee()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid transaction1Id = new Guid("88888888-4444-4444-4444-222222222222");
      Guid existingPayee = new Guid("88888888-1111-4444-4444-222222222222");
      AddPersonToStorage(unitOfWork, existingPayee, "person1", Guid.Empty);
      AddTransactionIntoStorage(unitOfWork, transaction1Id, 10, payeeIds: new HashSet<Person>() { unitOfWork.StorageContext.People.First() });

      ApiUpdateJsonModel model = new ApiUpdateJsonModel();
      model.CreatedObjects.People.Add(new JsonPerson()
      {
        ClientId = 1,
        Name = "person2"
      });
      model.UpdatedObjects.Transactions.Add(new JsonTransaction()
      {
        Id = transaction1Id,
        Payees = new List<Guid>() { existingPayee },
        PayeesClientIds = new List<int>() { 1 }
      });

      ApiService apiService = new ApiService(unitOfWork, model);

      apiService.ProcessCreatedObjects();
      apiService.ProcessUpdatedObjects();
      
      IEnumerable<Guid> payeeGuids = unitOfWork.StorageContext.Transactions.First().Payees.Select(x => x.Id).ToList();
      Assert.IsTrue(payeeGuids.Contains(existingPayee));
    }
  }
}

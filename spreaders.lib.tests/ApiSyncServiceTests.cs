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
  public class ApiSyncServiceTests
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

      var mockRep = new Mock<UnitOfWork>(mockContext.Object).As<IUnitOfWork>();

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
    public void ApiSyncService_ProcessRequest_NullModel_DoesNotError()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiSyncService apiService = new ApiSyncService(unitOfWork, null);

      try
      {
        apiService.ProcessRequest();
      }
      catch (Exception ex)
      {
        Assert.Fail("Expected no exception, but got: " + ex.Message);
      }
    }

    [TestMethod]
    public void ApiSyncService_ProcessRequest_EmptyModel_DoesNotError()
    {
      IUnitOfWork unitOfWork = Setup();
      ApiSyncService apiService = new ApiSyncService(unitOfWork, new Entities());

      try
      {
        apiService.ProcessRequest();
      }
      catch (Exception ex)
      {
        Assert.Fail("Expected no exception, but got: " + ex.Message);
      }
    }

    [TestMethod]
    public void ApiSyncService_ProcessRequest_CreateGroup_GroupIsCreated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid GroupId = new Guid("88888888-4444-4444-4444-222222222222");

      Entities model = new Entities();
      model.Groups.Add(new JsonGroup()
      {
        Id = GroupId,
        Name = "test"
      });

      ApiSyncService apiService = new ApiSyncService(unitOfWork, model);

      apiService.ProcessRequest();

      Assert.AreEqual("test", unitOfWork.StorageContext.Groups.First().Name);
    }

    [TestMethod]
    public void ApiSyncService_ProcessRequest_UpdateGroupName_NameIsUpdated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid GroupId = new Guid("88888888-4444-4444-4444-222222222222");
      AddGroupToStorage(unitOfWork, GroupId, "test1");

      Entities model = new Entities();
      model.Groups.Add(new JsonGroup()
      {
        Id = GroupId,
        Name = "test2"
      });

      ApiSyncService apiService = new ApiSyncService(unitOfWork, model);

      apiService.ProcessRequest();

      Assert.AreEqual("test2", unitOfWork.StorageContext.Groups.First().Name);
    }

    [TestMethod]
    public void ApiSyncService_ProcessRequest_CreatePerson_PersonIsCreated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid personId = new Guid("88888888-4444-4444-4444-222222222222");

      Entities model = new Entities();
      model.People.Add(new JsonPerson()
      {
        Id = personId,
        Name = "test1"
      });

      ApiSyncService apiService = new ApiSyncService(unitOfWork, model);

      apiService.ProcessRequest();

      Assert.AreEqual("test1", unitOfWork.StorageContext.People.First().Name);
    }

    [TestMethod]
    public void ApiSyncService_ProcessRequest_UpdatePersonName_NameIsUpdated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid personId = new Guid("88888888-4444-4444-4444-222222222222");
      AddPersonToStorage(unitOfWork, personId, "test1", Guid.Empty);

      Entities model = new Entities();
      model.People.Add(new JsonPerson()
      {
        Id = personId,
        Name = "test2"
      });

      ApiSyncService apiService = new ApiSyncService(unitOfWork, model);

      apiService.ProcessRequest();

      Assert.AreEqual("test2", unitOfWork.StorageContext.People.First().Name);
    }

    [TestMethod]
    public void ApiSyncService_ProcessRequest_UpdatePersonsGroup_GroupIsUpdated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid personId = new Guid("88888888-4444-4444-4444-222222222222");
      Guid group1Id = new Guid("88888888-1111-4444-4444-222222222222");
      Guid group2Id = new Guid("88888888-2222-4444-4444-222222222222");
      AddGroupToStorage(unitOfWork, group1Id, "group1");
      AddGroupToStorage(unitOfWork, group2Id, "group2");
      AddPersonToStorage(unitOfWork, personId, "test1", group1Id);

      Entities model = new Entities();
      model.People.Add(new JsonPerson()
      {
        Id = personId,
        Name = "test2",
        GroupId = group2Id
      });

      ApiSyncService apiService = new ApiSyncService(unitOfWork, model);

      apiService.ProcessRequest();

      Assert.AreEqual(group2Id, unitOfWork.StorageContext.People.First().GroupId);
    }

    [TestMethod]
    public void ApiSyncService_ProcessRequest_CreateTransaction_TransactionIsCreated()
    {
      IUnitOfWork unitOfWork = Setup();
      Entities model = new Entities();
      model.Transactions.Add(new JsonTransaction()
      {
        Id = new Guid("88888888-4444-4444-4444-222222222222"),
        Amount = 2
      });

      ApiSyncService apiService = new ApiSyncService(unitOfWork, model);

      apiService.ProcessRequest();

      Assert.AreEqual(2, unitOfWork.StorageContext.Transactions.First().Amount);
    }

    [TestMethod]
    public void ApiSyncService_ProcessRequest_UpdateTransacionsAmount_AmountIsUpdated()
    {
      IUnitOfWork unitOfWork = Setup();
      Guid transactionId = new Guid("88888888-4444-4444-4444-222222222222");
      AddTransactionIntoStorage(unitOfWork, transactionId, 1);
      Entities model = new Entities();
      model.Transactions.Add(new JsonTransaction()
      {
        Id = transactionId,
        Amount = 2
      });

      ApiSyncService apiService = new ApiSyncService(unitOfWork, model);

      apiService.ProcessRequest();

      Assert.AreEqual(2, unitOfWork.StorageContext.Transactions.First().Amount);
    }
  }
}

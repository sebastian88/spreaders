using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using spreaders.lib.Services;
using spreaders.lib.Models.Dtos.Json;

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
  }
}

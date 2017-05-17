using spreaders.lib.Context;
using spreaders.lib.Context.Interfaces;
using spreaders.lib.models.Entities;
using spreaders.lib.Models.Dtos.Json;
using spreaders.lib.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace spreaders.web.Controllers
{
  public class SpreadersApiController : ApiController
  {
    private IUnitOfWork _unitOfWork;

    public SpreadersApiController() : base()
    {
      _unitOfWork = new UnitOfWork();
    }
    public SpreadersApiController(IUnitOfWork unitOfWork) : base()
    {
      _unitOfWork = unitOfWork;
    }

    // POST api/<controller>
    public ApiUpdateJsonReturnModel Sync([FromBody]ApiUpdateJsonModel model)
    {
      ApiSyncService apiService = new ApiSyncService(_unitOfWork, model);

      apiService.ProcessCreatedObjects();
      apiService.ProcessUpdatedObjects();

      return apiService.GenerateReturnModel();
    }

    // POST api/<controller>
    public ApiGetGroupReturnModel GetGroupInfo(Guid id)
    {
      GroupService groupService = new GroupService(_unitOfWork);
      ApiGroupService apiGroupService = new ApiGroupService(_unitOfWork);

      Group group = groupService.Get(id);

      return apiGroupService.GenerateReturnModel(group);
    }
  }
}
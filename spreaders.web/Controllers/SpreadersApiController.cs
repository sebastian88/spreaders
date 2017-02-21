using spreaders.lib.Context;
using spreaders.lib.Context.Interfaces;
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

    // GET api/<controller>
    //public IEnumerable<string> Get()
    //{
    //  return new string[] { "value1", "value2" };
    //}

    // GET api/<controller>/5
    //public string Get(int id)
    //{
    //  return "value";
    //}

    // POST api/<controller>
    public ApiUpdateJsonReturnModel Sync([FromBody]ApiUpdateJsonModel model)
    {
      ApiService apiService = new ApiService(_unitOfWork, model);

      ApiUpdateJsonReturnModel returnModel = apiService.ProcessCreatedObjects();
      apiService.ProcessUpdatedObjects();

      return returnModel;
    }

    //// PUT api/<controller>/5
    //public void Put(int id, [FromBody]string value)
    //{
    //}

    //// DELETE api/<controller>/5
    //public void Delete(int id)
    //{
    //}
  }
}
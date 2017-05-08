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

    public ApiGetGroupReturnModel GetReturnModel(Group group)
    {
      ApiGetGroupReturnModel model = new ApiGetGroupReturnModel();
      return model;
    }
  }
}

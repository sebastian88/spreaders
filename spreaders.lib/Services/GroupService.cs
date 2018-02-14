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
  public class GroupService
  {
    private IUnitOfWork _unitOfWork;
    private EntityService _entityService;
    public GroupService(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
      _entityService = new EntityService();
    }
    public void Add(Group group)
    {
      _unitOfWork.StorageContext.Groups.Add(group);
    }

    public Group Get(Guid id)
    {
      return _unitOfWork.StorageContext.Groups.Where(x => x.Id == id).FirstOrDefault();
    }

    public Group AddFromJsonGroup(JsonGroup jsonGroup)
    {
      Group group = UpdateFromJsonGroup(new Group { Id = jsonGroup.Id }, jsonGroup);
      Add(group);
      return group;
    }

    public Group UpdateFromJsonGroup(Group group, JsonGroup jsonGroup)
    {
      group.Name = jsonGroup.Name;
      group.IsDeleted = jsonGroup.IsDeleted;
      return _entityService.UpdateFromJson(group, jsonGroup);
    }
  }
}

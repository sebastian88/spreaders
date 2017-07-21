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
  public class PersonService
  {
    private IUnitOfWork _unitOfWork;

    public PersonService(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
    }

    public void Add(Person person)
    {
      _unitOfWork.StorageContext.People.Add(person);
    }

    public Person Get(Guid id)
    {
      return _unitOfWork.StorageContext.People.Where(x => x.Id == id).FirstOrDefault();
    }

    public Person AddFromJsonPerson(JsonPerson jsonPerson)
    {
      Person person = UpdateFromJsonPerson(new Person { Id = jsonPerson.Id }, jsonPerson);
      Add(person);
      return person;
    }

    public Person UpdateFromJsonPerson(Person person, JsonPerson jsonPerson)
    {
      person.Name = jsonPerson.Name;
      person.GroupId = jsonPerson.GroupId;
      return person;
    }
  }
}

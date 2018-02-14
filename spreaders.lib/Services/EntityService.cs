using spreaders.lib.Models.Dtos.Json.Interfaces;
using spreaders.lib.Models.Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace spreaders.lib.Services
{
  public class EntityService
  {
    public T UpdateFromJson<T>(T entity, IJsonEntity jsonEntity) where T : IEntity
    {
      entity.CreatedOn = UnixTimeStampToDateTime(jsonEntity.CreatedOnUnixTimeStamp);
      entity.UpdatedOn = UnixTimeStampToDateTime(jsonEntity.UpdatedOnUnixTimeStamp);
      return entity;
    }

    public T UpdateJsonFromEntity<T>(T jsonEntity, IEntity entity) where T : IJsonEntity
    {
      jsonEntity.CreatedOnUnixTimeStamp = DateTimeToUnixTimeStamp(entity.CreatedOn);
      jsonEntity.UpdatedOnUnixTimeStamp = DateTimeToUnixTimeStamp(entity.UpdatedOn);
      return jsonEntity;
    }

    private DateTime UnixTimeStampToDateTime(long unixTimeStamp)
    {
      System.DateTime unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
      return unixEpoch.AddSeconds(unixTimeStamp).ToUniversalTime();
    }

    private long DateTimeToUnixTimeStamp(DateTime dateTime)
    {
      return (long)(dateTime.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
    }
  }
}
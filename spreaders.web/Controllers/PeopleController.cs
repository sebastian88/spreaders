using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace spreaders.web.Controllers
{
  public class PeopleController : Controller
  {
    // GET: People
    public ActionResult Add(string groupId)
    {
      return View();
    }
  }
}
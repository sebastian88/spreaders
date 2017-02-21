using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace spreaders.web.Controllers
{
  public class TransactionsController : Controller
  {
    // GET: Transactions
    public ActionResult Index(string groupId)
    {
      return View();
    }

    public ActionResult AddEdit(string groupId, string trasactionId)
    {
      return View();
    }
  }
}
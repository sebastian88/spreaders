using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace spreaders.web
{
  public class RouteConfig
  {
    public static void RegisterRoutes(RouteCollection routes)
    {
      routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

      //routes.MapRoute(
      //  name: "Group",
      //  url: "groups/{id}",
      //  defaults: new { controller = "Tranasctions", action = "Index" }
      //);


      routes.MapRoute(
        name: "Transactions",
        url: "groups/{groupid}/transactions",
        defaults: new { controller = "Transactions", action = "Index", id = UrlParameter.Optional }
      );

      routes.MapRoute(
        name: "TransactionAdd",
        url: "groups/{groupid}/transactions/add",
        defaults: new { controller = "Transactions", action = "AddEdit", id = UrlParameter.Optional }
      );

      routes.MapRoute(
        name: "transactionEdit",
        url: "groups/{groupid}/transactions/{trasactionId}",
        defaults: new { controller = "Transactions", action = "AddEdit", id = UrlParameter.Optional }
      );

      routes.MapRoute(
        name: "Default",
        url: "{controller}/{action}/{id}",
        defaults: new { controller = "Groups", action = "Index", id = UrlParameter.Optional }
      );
    }
  }
}

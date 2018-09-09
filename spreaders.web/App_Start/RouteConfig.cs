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
            routes.IgnoreRoute("*.json");

            //routes.MapRoute(
            //  name: "Group",
            //  url: "groups/{id}",
            //  defaults: new { controller = "Tranasctions", action = "Index" }
            //);

            routes.MapRoute(
              name: "TransactionsGeneric",
              url: "groups/transactions",
              defaults: new { controller = "Transactions", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              name: "Transactions",
              url: "groups/{groupid}/transactions",
              defaults: new { controller = "Transactions", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              name: "TransactionAddGeneric",
              url: "groups/transactions/add",
              defaults: new { controller = "Transactions", action = "AddEdit", id = UrlParameter.Optional }
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
              name: "peopleGeneric",
              url: "groups/people",
              defaults: new { controller = "People", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              name: "people",
              url: "groups/{groupid}/people",
              defaults: new { controller = "People", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              name: "personEditGeneric",
              url: "groups/people/edit",
              defaults: new { controller = "People", action = "Edit", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              name: "personEdit",
              url: "groups/{groupid}/people/{personId}",
              defaults: new { controller = "People", action = "Edit", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              name: "payUp",
              url: "groups/{groupid}/payup/",
              defaults: new { controller = "PayUp", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
        name: "Default",
        url: "{controller}/{action}/{id}",
        defaults: new { controller = "Groups", action = "Index", id = UrlParameter.Optional }
      );
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace spreaders.web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/js/live/library").Include(
                "~/js/scripts/namespaces.js",
                "~/js/scripts/maths.js",
                "~/js/scripts/model/group.js",
                "~/js/scripts/model/person.js",
                "~/js/scripts/model/personTotal.js",
                "~/js/scripts/model/transaction.js",
                "~/js/scripts/view/personFormList.js",
                "~/js/scripts/view/addPerson.js",
                "~/js/scripts/view/editablePerson.js",
                "~/js/scripts/view/payeeCheckboxes.js",
                "~/js/scripts/view/payerRadio.js",
                "~/js/scripts/view/transaction.js",
                "~/js/scripts/pageContext.js",
                "~/js/scripts/urlService.js",
                "~/js/scripts/apiService.js",
                "~/js/scripts/storageIndexedDb.js",
                "~/js/scripts/storage.js",
                "~/js/scripts/synchroniser.js",
                "~/js/scripts/observer.js"
            ));

            bundles.Add(new ScriptBundle("~/js/live/pages/groups").Include("~/js/pages/groups.js"));
            bundles.Add(new ScriptBundle("~/js/live/pages/people").Include("~/js/pages/people.js"));
            bundles.Add(new ScriptBundle("~/js/live/pages/person").Include("~/js/pages/person.js"));
            bundles.Add(new ScriptBundle("~/js/live/pages/transaction").Include("~/js/pages/transaction.js"));
            bundles.Add(new ScriptBundle("~/js/live/pages/transactions").Include("~/js/pages/transactions.js"));
        }
    }
}
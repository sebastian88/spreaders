namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ApiChanges : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Groups", "ExternalId");
            DropColumn("dbo.People", "ExternalId");
            DropColumn("dbo.Transactions", "ExternalId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Transactions", "ExternalId", c => c.Int(nullable: false));
            AddColumn("dbo.People", "ExternalId", c => c.Int(nullable: false));
            AddColumn("dbo.Groups", "ExternalId", c => c.Int(nullable: false));
        }
    }
}

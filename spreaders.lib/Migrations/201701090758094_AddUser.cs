namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "ExternalId", c => c.Int(nullable: false));
            AddColumn("dbo.People", "ExternalId", c => c.Int(nullable: false));
            AddColumn("dbo.Transactions", "ExternalId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Transactions", "ExternalId");
            DropColumn("dbo.People", "ExternalId");
            DropColumn("dbo.Groups", "ExternalId");
        }
    }
}

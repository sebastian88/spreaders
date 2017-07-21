namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class StuffUpdate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "IsDeleted", c => c.Boolean(nullable: false));
            AddColumn("dbo.People", "IsDeleted", c => c.Boolean(nullable: false));
            AddColumn("dbo.Transactions", "IsDeleted", c => c.Boolean(nullable: false));
            DropColumn("dbo.People", "Deleted");
            DropColumn("dbo.Transactions", "Deleted");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Transactions", "Deleted", c => c.Boolean(nullable: false));
            AddColumn("dbo.People", "Deleted", c => c.Boolean(nullable: false));
            DropColumn("dbo.Transactions", "IsDeleted");
            DropColumn("dbo.People", "IsDeleted");
            DropColumn("dbo.Groups", "IsDeleted");
        }
    }
}

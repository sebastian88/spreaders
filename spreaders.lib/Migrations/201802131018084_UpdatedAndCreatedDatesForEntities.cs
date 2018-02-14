namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdatedAndCreatedDatesForEntities : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "CreatedOn", c => c.DateTime(nullable: false));
            AddColumn("dbo.Groups", "UpdatedOn", c => c.DateTime(nullable: false));
            AddColumn("dbo.People", "CreatedOn", c => c.DateTime(nullable: false));
            AddColumn("dbo.People", "UpdatedOn", c => c.DateTime(nullable: false));
            AddColumn("dbo.Transactions", "CreatedOn", c => c.DateTime(nullable: false));
            AddColumn("dbo.Transactions", "UpdatedOn", c => c.DateTime(nullable: false));
            AddColumn("dbo.Users", "CreatedOn", c => c.DateTime(nullable: false));
            AddColumn("dbo.Users", "UpdatedOn", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "UpdatedOn");
            DropColumn("dbo.Users", "CreatedOn");
            DropColumn("dbo.Transactions", "UpdatedOn");
            DropColumn("dbo.Transactions", "CreatedOn");
            DropColumn("dbo.People", "UpdatedOn");
            DropColumn("dbo.People", "CreatedOn");
            DropColumn("dbo.Groups", "UpdatedOn");
            DropColumn("dbo.Groups", "CreatedOn");
        }
    }
}

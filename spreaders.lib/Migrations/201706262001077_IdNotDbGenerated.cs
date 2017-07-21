namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IdNotDbGenerated : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.People", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.Transactions", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.UserGroups", "Group_Id", "dbo.Groups");
            DropForeignKey("dbo.Transactions", "PayerId", "dbo.People");
            DropForeignKey("dbo.PersonTransactions", "Person_Id", "dbo.People");
            DropForeignKey("dbo.PersonTransactions", "Transaction_Id", "dbo.Transactions");
            DropPrimaryKey("dbo.Groups");
            DropPrimaryKey("dbo.People");
            DropPrimaryKey("dbo.Transactions");
            AlterColumn("dbo.Groups", "Id", c => c.Guid(nullable: false));
            AlterColumn("dbo.People", "Id", c => c.Guid(nullable: false));
            AlterColumn("dbo.Transactions", "Id", c => c.Guid(nullable: false));
            AddPrimaryKey("dbo.Groups", "Id");
            AddPrimaryKey("dbo.People", "Id");
            AddPrimaryKey("dbo.Transactions", "Id");
            AddForeignKey("dbo.People", "GroupId", "dbo.Groups", "Id");
            AddForeignKey("dbo.Transactions", "GroupId", "dbo.Groups", "Id");
            AddForeignKey("dbo.UserGroups", "Group_Id", "dbo.Groups", "Id");
            AddForeignKey("dbo.Transactions", "PayerId", "dbo.People", "Id");
            AddForeignKey("dbo.PersonTransactions", "Person_Id", "dbo.People", "Id");
            AddForeignKey("dbo.PersonTransactions", "Transaction_Id", "dbo.Transactions", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PersonTransactions", "Transaction_Id", "dbo.Transactions");
            DropForeignKey("dbo.PersonTransactions", "Person_Id", "dbo.People");
            DropForeignKey("dbo.Transactions", "PayerId", "dbo.People");
            DropForeignKey("dbo.UserGroups", "Group_Id", "dbo.Groups");
            DropForeignKey("dbo.Transactions", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.People", "GroupId", "dbo.Groups");
            DropPrimaryKey("dbo.Transactions");
            DropPrimaryKey("dbo.People");
            DropPrimaryKey("dbo.Groups");
            AlterColumn("dbo.Transactions", "Id", c => c.Guid(nullable: false, identity: true));
            AlterColumn("dbo.People", "Id", c => c.Guid(nullable: false, identity: true));
            AlterColumn("dbo.Groups", "Id", c => c.Guid(nullable: false, identity: true));
            AddPrimaryKey("dbo.Transactions", "Id");
            AddPrimaryKey("dbo.People", "Id");
            AddPrimaryKey("dbo.Groups", "Id");
            AddForeignKey("dbo.PersonTransactions", "Transaction_Id", "dbo.Transactions", "Id");
            AddForeignKey("dbo.PersonTransactions", "Person_Id", "dbo.People", "Id");
            AddForeignKey("dbo.Transactions", "PayerId", "dbo.People", "Id");
            AddForeignKey("dbo.UserGroups", "Group_Id", "dbo.Groups", "Id");
            AddForeignKey("dbo.Transactions", "GroupId", "dbo.Groups", "Id");
            AddForeignKey("dbo.People", "GroupId", "dbo.Groups", "Id");
        }
    }
}

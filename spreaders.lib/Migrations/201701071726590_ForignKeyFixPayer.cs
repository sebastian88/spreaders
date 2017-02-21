namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ForignKeyFixPayer : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.TransactionPersons", "Transaction_Id", "dbo.Transactions");
            DropForeignKey("dbo.TransactionPersons", "Person_Id", "dbo.People");
            DropForeignKey("dbo.People", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.Transactions", "GroupId", "dbo.Groups");
            DropIndex("dbo.TransactionPersons", new[] { "Transaction_Id" });
            DropIndex("dbo.TransactionPersons", new[] { "Person_Id" });
            AddColumn("dbo.People", "Transaction_Id", c => c.Guid());
            AddColumn("dbo.Transactions", "PayerId", c => c.Guid(nullable: false));
            AddColumn("dbo.Transactions", "Person_Id", c => c.Guid());
            CreateIndex("dbo.People", "Transaction_Id");
            CreateIndex("dbo.Transactions", "PayerId");
            CreateIndex("dbo.Transactions", "Person_Id");
            AddForeignKey("dbo.People", "Transaction_Id", "dbo.Transactions", "Id");
            AddForeignKey("dbo.Transactions", "PayerId", "dbo.People", "Id");
            AddForeignKey("dbo.Transactions", "Person_Id", "dbo.People", "Id");
            AddForeignKey("dbo.People", "GroupId", "dbo.Groups", "Id");
            AddForeignKey("dbo.Transactions", "GroupId", "dbo.Groups", "Id");
            DropTable("dbo.TransactionPersons");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.TransactionPersons",
                c => new
                    {
                        Transaction_Id = c.Guid(nullable: false),
                        Person_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Transaction_Id, t.Person_Id });
            
            DropForeignKey("dbo.Transactions", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.People", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.Transactions", "Person_Id", "dbo.People");
            DropForeignKey("dbo.Transactions", "PayerId", "dbo.People");
            DropForeignKey("dbo.People", "Transaction_Id", "dbo.Transactions");
            DropIndex("dbo.Transactions", new[] { "Person_Id" });
            DropIndex("dbo.Transactions", new[] { "PayerId" });
            DropIndex("dbo.People", new[] { "Transaction_Id" });
            DropColumn("dbo.Transactions", "Person_Id");
            DropColumn("dbo.Transactions", "PayerId");
            DropColumn("dbo.People", "Transaction_Id");
            CreateIndex("dbo.TransactionPersons", "Person_Id");
            CreateIndex("dbo.TransactionPersons", "Transaction_Id");
            AddForeignKey("dbo.Transactions", "GroupId", "dbo.Groups", "Id", cascadeDelete: true);
            AddForeignKey("dbo.People", "GroupId", "dbo.Groups", "Id", cascadeDelete: true);
            AddForeignKey("dbo.TransactionPersons", "Person_Id", "dbo.People", "Id");
            AddForeignKey("dbo.TransactionPersons", "Transaction_Id", "dbo.Transactions", "Id");
        }
    }
}

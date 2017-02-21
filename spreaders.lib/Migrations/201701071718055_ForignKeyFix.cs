namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ForignKeyFix : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.People", "Transaction_Id", "dbo.Transactions");
            DropForeignKey("dbo.Transactions", "Payer_Id", "dbo.People");
            DropIndex("dbo.People", new[] { "Transaction_Id" });
            DropIndex("dbo.Transactions", new[] { "Payer_Id" });
            CreateTable(
                "dbo.TransactionPersons",
                c => new
                    {
                        Transaction_Id = c.Guid(nullable: false),
                        Person_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Transaction_Id, t.Person_Id })
                .ForeignKey("dbo.Transactions", t => t.Transaction_Id)
                .ForeignKey("dbo.People", t => t.Person_Id)
                .Index(t => t.Transaction_Id)
                .Index(t => t.Person_Id);
            
            DropColumn("dbo.People", "Transaction_Id");
            DropColumn("dbo.Transactions", "Payer_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Transactions", "Payer_Id", c => c.Guid());
            AddColumn("dbo.People", "Transaction_Id", c => c.Guid());
            DropForeignKey("dbo.TransactionPersons", "Person_Id", "dbo.People");
            DropForeignKey("dbo.TransactionPersons", "Transaction_Id", "dbo.Transactions");
            DropIndex("dbo.TransactionPersons", new[] { "Person_Id" });
            DropIndex("dbo.TransactionPersons", new[] { "Transaction_Id" });
            DropTable("dbo.TransactionPersons");
            CreateIndex("dbo.Transactions", "Payer_Id");
            CreateIndex("dbo.People", "Transaction_Id");
            AddForeignKey("dbo.Transactions", "Payer_Id", "dbo.People", "Id");
            AddForeignKey("dbo.People", "Transaction_Id", "dbo.Transactions", "Id");
        }
    }
}

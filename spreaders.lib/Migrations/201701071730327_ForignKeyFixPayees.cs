namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ForignKeyFixPayees : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.People", "Transaction_Id", "dbo.Transactions");
            DropForeignKey("dbo.Transactions", "Person_Id", "dbo.People");
            DropIndex("dbo.People", new[] { "Transaction_Id" });
            DropIndex("dbo.Transactions", new[] { "Person_Id" });
            CreateTable(
                "dbo.PersonTransactions",
                c => new
                    {
                        Person_Id = c.Guid(nullable: false),
                        Transaction_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Person_Id, t.Transaction_Id })
                .ForeignKey("dbo.People", t => t.Person_Id)
                .ForeignKey("dbo.Transactions", t => t.Transaction_Id)
                .Index(t => t.Person_Id)
                .Index(t => t.Transaction_Id);
            
            DropColumn("dbo.People", "Transaction_Id");
            DropColumn("dbo.Transactions", "Person_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Transactions", "Person_Id", c => c.Guid());
            AddColumn("dbo.People", "Transaction_Id", c => c.Guid());
            DropForeignKey("dbo.PersonTransactions", "Transaction_Id", "dbo.Transactions");
            DropForeignKey("dbo.PersonTransactions", "Person_Id", "dbo.People");
            DropIndex("dbo.PersonTransactions", new[] { "Transaction_Id" });
            DropIndex("dbo.PersonTransactions", new[] { "Person_Id" });
            DropTable("dbo.PersonTransactions");
            CreateIndex("dbo.Transactions", "Person_Id");
            CreateIndex("dbo.People", "Transaction_Id");
            AddForeignKey("dbo.Transactions", "Person_Id", "dbo.People", "Id");
            AddForeignKey("dbo.People", "Transaction_Id", "dbo.Transactions", "Id");
        }
    }
}

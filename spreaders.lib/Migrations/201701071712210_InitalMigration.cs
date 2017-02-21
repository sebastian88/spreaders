namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitalMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Groups",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.People",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        Name = c.String(),
                        Deleted = c.Boolean(nullable: false),
                        GroupId = c.Guid(nullable: false),
                        Transaction_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Groups", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.Transactions", t => t.Transaction_Id)
                .Index(t => t.GroupId)
                .Index(t => t.Transaction_Id);
            
            CreateTable(
                "dbo.Transactions",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Description = c.String(),
                        Deleted = c.Boolean(nullable: false),
                        GroupId = c.Guid(nullable: false),
                        Payer_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Groups", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.People", t => t.Payer_Id)
                .Index(t => t.GroupId)
                .Index(t => t.Payer_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Transactions", "Payer_Id", "dbo.People");
            DropForeignKey("dbo.People", "Transaction_Id", "dbo.Transactions");
            DropForeignKey("dbo.Transactions", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.People", "GroupId", "dbo.Groups");
            DropIndex("dbo.Transactions", new[] { "Payer_Id" });
            DropIndex("dbo.Transactions", new[] { "GroupId" });
            DropIndex("dbo.People", new[] { "Transaction_Id" });
            DropIndex("dbo.People", new[] { "GroupId" });
            DropTable("dbo.Transactions");
            DropTable("dbo.People");
            DropTable("dbo.Groups");
        }
    }
}

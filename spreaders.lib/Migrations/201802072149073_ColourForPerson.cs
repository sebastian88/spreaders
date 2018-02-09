namespace spreaders.lib.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ColourForPerson : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.People", "Colour", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.People", "Colour");
        }
    }
}

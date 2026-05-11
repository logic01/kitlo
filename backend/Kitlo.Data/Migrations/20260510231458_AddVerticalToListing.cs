using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kitlo.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddVerticalToListing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Existing rows pre-pivot are all hunting optics — backfill them so the
            // single legacy seed pair (Pulsar Thermion, ATN X-Sight) lands under the
            // HuntingOptics vertical. New rows are written explicitly by the API.
            migrationBuilder.AddColumn<int>(
                name: "Vertical",
                table: "Listings",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateTable(
                name: "WaitlistEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Zip = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    FirstRental = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    InterestedAsLister = table.Column<bool>(type: "boolean", nullable: false),
                    Source = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ConvertedUserId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WaitlistEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WaitlistEntries_Users_ConvertedUserId",
                        column: x => x.ConvertedUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Listings_Vertical_Status",
                table: "Listings",
                columns: new[] { "Vertical", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_WaitlistEntries_ConvertedUserId",
                table: "WaitlistEntries",
                column: "ConvertedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_WaitlistEntries_CreatedAt",
                table: "WaitlistEntries",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_WaitlistEntries_Email",
                table: "WaitlistEntries",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WaitlistEntries_Zip",
                table: "WaitlistEntries",
                column: "Zip");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WaitlistEntries");

            migrationBuilder.DropIndex(
                name: "IX_Listings_Vertical_Status",
                table: "Listings");

            migrationBuilder.DropColumn(
                name: "Vertical",
                table: "Listings");
        }
    }
}

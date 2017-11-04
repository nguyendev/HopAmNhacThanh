using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace HopAmNhacThanh.Migrations
{
    public partial class EditLinkSong : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LinkSong_Song_SongID",
                table: "LinkSong");

            migrationBuilder.AlterColumn<long>(
                name: "SongID",
                table: "LinkSong",
                nullable: true,
                oldClrType: typeof(long));

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "LinkSong",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Audio",
                columns: table => new
                {
                    ID = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Active = table.Column<string>(maxLength: 1, nullable: true),
                    Approved = table.Column<string>(maxLength: 1, nullable: true),
                    AuthorID = table.Column<string>(nullable: true),
                    CreateDT = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: true),
                    Note = table.Column<string>(maxLength: 200, nullable: true),
                    Source = table.Column<string>(maxLength: 150, nullable: true),
                    UpdateDT = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Audio", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Audio_AspNetUsers_AuthorID",
                        column: x => x.AuthorID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Audio_AuthorID",
                table: "Audio",
                column: "AuthorID");

            migrationBuilder.AddForeignKey(
                name: "FK_LinkSong_Song_SongID",
                table: "LinkSong",
                column: "SongID",
                principalTable: "Song",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LinkSong_Song_SongID",
                table: "LinkSong");

            migrationBuilder.DropTable(
                name: "Audio");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "LinkSong");

            migrationBuilder.AlterColumn<long>(
                name: "SongID",
                table: "LinkSong",
                nullable: false,
                oldClrType: typeof(long),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_LinkSong_Song_SongID",
                table: "LinkSong",
                column: "SongID",
                principalTable: "Song",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

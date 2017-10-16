using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace HopAmNhacThanh.Data.Migrations
{
    public partial class VietnamesLyric : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VietnameseLyric",
                table: "Song",
                newName: "VietnameseLyricID");

            migrationBuilder.AddColumn<int>(
                name: "NumberSongInAlbum",
                table: "Song",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VietnameseLyric",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Content = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VietnameseLyric", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Song_VietnameseLyricID",
                table: "Song",
                column: "VietnameseLyricID");

            migrationBuilder.AddForeignKey(
                name: "FK_Song_VietnameseLyric_VietnameseLyricID",
                table: "Song",
                column: "VietnameseLyricID",
                principalTable: "VietnameseLyric",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Song_VietnameseLyric_VietnameseLyricID",
                table: "Song");

            migrationBuilder.DropTable(
                name: "VietnameseLyric");

            migrationBuilder.DropIndex(
                name: "IX_Song_VietnameseLyricID",
                table: "Song");

            migrationBuilder.DropColumn(
                name: "NumberSongInAlbum",
                table: "Song");

            migrationBuilder.RenameColumn(
                name: "VietnameseLyricID",
                table: "Song",
                newName: "VietnameseLyric");
        }
    }
}

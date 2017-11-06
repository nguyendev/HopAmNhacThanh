using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HopAmNhacThanh.Migrations
{
    public partial class EditSheetMusic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SheetMusic_Song_SongID",
                table: "SheetMusic");

            migrationBuilder.AlterColumn<long>(
                name: "SongID",
                table: "SheetMusic",
                nullable: true,
                oldClrType: typeof(long));

            migrationBuilder.AddColumn<int>(
                name: "Number",
                table: "SheetMusic",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "SheetMusic",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SheetMusic_Song_SongID",
                table: "SheetMusic",
                column: "SongID",
                principalTable: "Song",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SheetMusic_Song_SongID",
                table: "SheetMusic");

            migrationBuilder.DropColumn(
                name: "Number",
                table: "SheetMusic");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "SheetMusic");

            migrationBuilder.AlterColumn<long>(
                name: "SongID",
                table: "SheetMusic",
                nullable: false,
                oldClrType: typeof(long),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SheetMusic_Song_SongID",
                table: "SheetMusic",
                column: "SongID",
                principalTable: "Song",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HopAmNhacThanh.Migrations
{
    public partial class _14 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "Album");

            migrationBuilder.AddColumn<int>(
                name: "ImageID",
                table: "Album",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Album_ImageID",
                table: "Album",
                column: "ImageID");

            migrationBuilder.AddForeignKey(
                name: "FK_Album_Images_ImageID",
                table: "Album",
                column: "ImageID",
                principalTable: "Images",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Album_Images_ImageID",
                table: "Album");

            migrationBuilder.DropIndex(
                name: "IX_Album_ImageID",
                table: "Album");

            migrationBuilder.DropColumn(
                name: "ImageID",
                table: "Album");

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Album",
                nullable: true);
        }
    }
}

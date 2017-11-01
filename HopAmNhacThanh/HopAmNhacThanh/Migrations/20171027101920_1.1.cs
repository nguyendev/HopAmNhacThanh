using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HopAmNhacThanh.Migrations
{
    public partial class _11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Image",
                table: "SingleSong",
                newName: "Description");

            migrationBuilder.AddColumn<int>(
                name: "ImageID",
                table: "SingleSong",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "AuthorSong",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SingleSong_ImageID",
                table: "SingleSong",
                column: "ImageID");

            migrationBuilder.AddForeignKey(
                name: "FK_SingleSong_Images_ImageID",
                table: "SingleSong",
                column: "ImageID",
                principalTable: "Images",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SingleSong_Images_ImageID",
                table: "SingleSong");

            migrationBuilder.DropIndex(
                name: "IX_SingleSong_ImageID",
                table: "SingleSong");

            migrationBuilder.DropColumn(
                name: "ImageID",
                table: "SingleSong");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "AuthorSong");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "SingleSong",
                newName: "Image");
        }
    }
}

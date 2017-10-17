using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HopAmNhacThanh.Data.Migrations
{
    public partial class TypeVideo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsYoutube",
                table: "Video");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Video",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "SingleSong",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Video");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "SingleSong");

            migrationBuilder.AddColumn<bool>(
                name: "IsYoutube",
                table: "Video",
                nullable: false,
                defaultValue: false);
        }
    }
}

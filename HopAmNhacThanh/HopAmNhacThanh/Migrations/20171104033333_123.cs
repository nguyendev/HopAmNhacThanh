using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HopAmNhacThanh.Migrations
{
    public partial class _123 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ImageID",
                table: "Video",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Video",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PicBook",
                table: "Images",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PicFull",
                table: "Images",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PicPeople",
                table: "Images",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PicVideo",
                table: "Images",
                maxLength: 200,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Video_ImageID",
                table: "Video",
                column: "ImageID");

            migrationBuilder.AddForeignKey(
                name: "FK_Video_Images_ImageID",
                table: "Video",
                column: "ImageID",
                principalTable: "Images",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Video_Images_ImageID",
                table: "Video");

            migrationBuilder.DropIndex(
                name: "IX_Video_ImageID",
                table: "Video");

            migrationBuilder.DropColumn(
                name: "ImageID",
                table: "Video");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Video");

            migrationBuilder.DropColumn(
                name: "PicBook",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "PicFull",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "PicPeople",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "PicVideo",
                table: "Images");
        }
    }
}

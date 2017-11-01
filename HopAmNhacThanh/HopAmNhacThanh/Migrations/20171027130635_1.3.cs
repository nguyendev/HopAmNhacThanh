using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HopAmNhacThanh.Migrations
{
    public partial class _13 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Category",
                newName: "Description");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "VietnameseLyric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Style",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ImageID",
                table: "Style",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ImageID",
                table: "Category",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Style_ImageID",
                table: "Style",
                column: "ImageID");

            migrationBuilder.CreateIndex(
                name: "IX_Category_ImageID",
                table: "Category",
                column: "ImageID");

            migrationBuilder.AddForeignKey(
                name: "FK_Category_Images_ImageID",
                table: "Category",
                column: "ImageID",
                principalTable: "Images",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Style_Images_ImageID",
                table: "Style",
                column: "ImageID",
                principalTable: "Images",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_Images_ImageID",
                table: "Category");

            migrationBuilder.DropForeignKey(
                name: "FK_Style_Images_ImageID",
                table: "Style");

            migrationBuilder.DropIndex(
                name: "IX_Style_ImageID",
                table: "Style");

            migrationBuilder.DropIndex(
                name: "IX_Category_ImageID",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "VietnameseLyric");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Style");

            migrationBuilder.DropColumn(
                name: "ImageID",
                table: "Style");

            migrationBuilder.DropColumn(
                name: "ImageID",
                table: "Category");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Category",
                newName: "Image");
        }
    }
}

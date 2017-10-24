using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace HopAmNhacThanh.Migrations
{
    public partial class EditorVietnameseLyricAndAuthoSong : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "VietnameseLyric");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "AuthorSong");

            migrationBuilder.AddColumn<int>(
                name: "ImageID",
                table: "VietnameseLyric",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "VietnameseLyric",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ImageID",
                table: "AuthorSong",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ALT = table.Column<string>(maxLength: 150, nullable: true),
                    Active = table.Column<string>(maxLength: 1, nullable: true),
                    Approved = table.Column<string>(maxLength: 1, nullable: true),
                    AuthorID = table.Column<string>(nullable: true),
                    CreateDT = table.Column<DateTime>(nullable: true),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: true),
                    Note = table.Column<string>(maxLength: 200, nullable: true),
                    Title = table.Column<string>(maxLength: 150, nullable: true),
                    UpdateDT = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Images_AspNetUsers_AuthorID",
                        column: x => x.AuthorID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VietnameseLyric_ImageID",
                table: "VietnameseLyric",
                column: "ImageID");

            migrationBuilder.CreateIndex(
                name: "IX_AuthorSong_ImageID",
                table: "AuthorSong",
                column: "ImageID");

            migrationBuilder.CreateIndex(
                name: "IX_Images_AuthorID",
                table: "Images",
                column: "AuthorID");

            migrationBuilder.AddForeignKey(
                name: "FK_AuthorSong_Images_ImageID",
                table: "AuthorSong",
                column: "ImageID",
                principalTable: "Images",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VietnameseLyric_Images_ImageID",
                table: "VietnameseLyric",
                column: "ImageID",
                principalTable: "Images",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthorSong_Images_ImageID",
                table: "AuthorSong");

            migrationBuilder.DropForeignKey(
                name: "FK_VietnameseLyric_Images_ImageID",
                table: "VietnameseLyric");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropIndex(
                name: "IX_VietnameseLyric_ImageID",
                table: "VietnameseLyric");

            migrationBuilder.DropIndex(
                name: "IX_AuthorSong_ImageID",
                table: "AuthorSong");

            migrationBuilder.DropColumn(
                name: "ImageID",
                table: "VietnameseLyric");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "VietnameseLyric");

            migrationBuilder.DropColumn(
                name: "ImageID",
                table: "AuthorSong");

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "VietnameseLyric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "AuthorSong",
                nullable: true);
        }
    }
}

using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HopAmNhacThanh.Data.Migrations
{
    public partial class EditNotNull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Song_Album_AlbumID",
                table: "Song");

            migrationBuilder.DropForeignKey(
                name: "FK_Song_AuthorSong_AuthorSongID",
                table: "Song");

            migrationBuilder.AlterColumn<int>(
                name: "AuthorSongID",
                table: "Song",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "AlbumID",
                table: "Song",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Song_Album_AlbumID",
                table: "Song",
                column: "AlbumID",
                principalTable: "Album",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Song_AuthorSong_AuthorSongID",
                table: "Song",
                column: "AuthorSongID",
                principalTable: "AuthorSong",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Song_Album_AlbumID",
                table: "Song");

            migrationBuilder.DropForeignKey(
                name: "FK_Song_AuthorSong_AuthorSongID",
                table: "Song");

            migrationBuilder.AlterColumn<int>(
                name: "AuthorSongID",
                table: "Song",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AlbumID",
                table: "Song",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Song_Album_AlbumID",
                table: "Song",
                column: "AlbumID",
                principalTable: "Album",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Song_AuthorSong_AuthorSongID",
                table: "Song",
                column: "AuthorSongID",
                principalTable: "AuthorSong",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

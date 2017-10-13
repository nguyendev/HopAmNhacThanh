using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HopAmNhacThanh.Data.Migrations
{
    public partial class EditSongId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chords_Song_SongID1",
                table: "Chords");

            migrationBuilder.DropIndex(
                name: "IX_Chords_SongID1",
                table: "Chords");

            migrationBuilder.DropColumn(
                name: "SongID1",
                table: "Chords");

            migrationBuilder.AlterColumn<string>(
                name: "Version",
                table: "Chords",
                maxLength: 60,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 60);

            migrationBuilder.AlterColumn<string>(
                name: "Tone",
                table: "Chords",
                maxLength: 5,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 5);

            migrationBuilder.AlterColumn<long>(
                name: "SongID",
                table: "Chords",
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "Chords",
                maxLength: 30,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 30);

            migrationBuilder.AlterColumn<string>(
                name: "Lyric",
                table: "Chords",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "InfoShort",
                table: "Chords",
                maxLength: 30,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 30);

            migrationBuilder.AddColumn<string>(
                name: "Intro",
                table: "Chords",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Chords_SongID",
                table: "Chords",
                column: "SongID");

            migrationBuilder.AddForeignKey(
                name: "FK_Chords_Song_SongID",
                table: "Chords",
                column: "SongID",
                principalTable: "Song",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chords_Song_SongID",
                table: "Chords");

            migrationBuilder.DropIndex(
                name: "IX_Chords_SongID",
                table: "Chords");

            migrationBuilder.DropColumn(
                name: "Intro",
                table: "Chords");

            migrationBuilder.AlterColumn<string>(
                name: "Version",
                table: "Chords",
                maxLength: 60,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 60,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Tone",
                table: "Chords",
                maxLength: 5,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SongID",
                table: "Chords",
                nullable: false,
                oldClrType: typeof(long));

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "Chords",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 30,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Lyric",
                table: "Chords",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "InfoShort",
                table: "Chords",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 30,
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "SongID1",
                table: "Chords",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Chords_SongID1",
                table: "Chords",
                column: "SongID1");

            migrationBuilder.AddForeignKey(
                name: "FK_Chords_Song_SongID1",
                table: "Chords",
                column: "SongID1",
                principalTable: "Song",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using HopAmNhacThanh.Data;

namespace HopAmNhacThanh.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20171010082712_init2")]
    partial class init2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("HopAmNhacThanh.Models.Album", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Active")
                        .HasMaxLength(1);

                    b.Property<string>("Approved")
                        .HasMaxLength(1);

                    b.Property<string>("AuthorID");

                    b.Property<DateTime?>("CreateDT");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name");

                    b.Property<string>("Note")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("UpdateDT");

                    b.HasKey("ID");

                    b.HasIndex("AuthorID");

                    b.ToTable("Album");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("About")
                        .HasMaxLength(1000);

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<DateTime?>("CreateDT");

                    b.Property<string>("DateofBirth")
                        .HasMaxLength(100);

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("Facebook")
                        .HasMaxLength(100);

                    b.Property<string>("FullName")
                        .HasMaxLength(100);

                    b.Property<string>("GooglePlus")
                        .HasMaxLength(100);

                    b.Property<string>("IdentityFacebook")
                        .HasMaxLength(100);

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Linkedin")
                        .HasMaxLength(100);

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("Picture65x65")
                        .HasMaxLength(100);

                    b.Property<string>("PictureBig")
                        .HasMaxLength(100);

                    b.Property<string>("PictureSmall")
                        .HasMaxLength(100);

                    b.Property<int>("Score");

                    b.Property<string>("SecurityStamp");

                    b.Property<string>("Slug")
                        .HasMaxLength(50);

                    b.Property<string>("Twitter")
                        .HasMaxLength(100);

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.Property<string>("Website")
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.AuthorSong", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Active")
                        .HasMaxLength(1);

                    b.Property<string>("Approved")
                        .HasMaxLength(1);

                    b.Property<string>("AuthorID");

                    b.Property<string>("Content");

                    b.Property<DateTime?>("CreateDT");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name");

                    b.Property<string>("Note")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("UpdateDT");

                    b.HasKey("ID");

                    b.HasIndex("AuthorID");

                    b.ToTable("AuthorSong");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.Category", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(60);

                    b.Property<string>("Note");

                    b.HasKey("ID");

                    b.ToTable("Category");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.Chords", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Active")
                        .HasMaxLength(1);

                    b.Property<string>("Approved")
                        .HasMaxLength(1);

                    b.Property<string>("AuthorID");

                    b.Property<DateTime?>("CreateDT");

                    b.Property<string>("Info");

                    b.Property<string>("InfoShort")
                        .IsRequired()
                        .HasMaxLength(30);

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Lyric")
                        .IsRequired();

                    b.Property<string>("Note")
                        .HasMaxLength(200);

                    b.Property<string>("Slug")
                        .IsRequired()
                        .HasMaxLength(30);

                    b.Property<int>("SongID");

                    b.Property<long?>("SongID1");

                    b.Property<int?>("StyleID");

                    b.Property<string>("Tone")
                        .IsRequired()
                        .HasMaxLength(5);

                    b.Property<DateTime?>("UpdateDT");

                    b.Property<string>("Version")
                        .IsRequired()
                        .HasMaxLength(60);

                    b.HasKey("ID");

                    b.HasIndex("AuthorID");

                    b.HasIndex("SongID1");

                    b.HasIndex("StyleID");

                    b.ToTable("Chords");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.LinkSong", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Active")
                        .HasMaxLength(1);

                    b.Property<string>("Approved")
                        .HasMaxLength(1);

                    b.Property<string>("AuthorID");

                    b.Property<DateTime?>("CreateDT");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Link")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Note")
                        .HasMaxLength(200);

                    b.Property<int?>("SingleSongID");

                    b.Property<long>("SongID");

                    b.Property<string>("Tone")
                        .HasMaxLength(5);

                    b.Property<DateTime?>("UpdateDT");

                    b.HasKey("ID");

                    b.HasIndex("AuthorID");

                    b.HasIndex("SingleSongID");

                    b.HasIndex("SongID");

                    b.ToTable("LinkSong");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.SheetMusic", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Active")
                        .HasMaxLength(1);

                    b.Property<string>("Approved")
                        .HasMaxLength(1);

                    b.Property<string>("AuthorID");

                    b.Property<DateTime?>("CreateDT");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name");

                    b.Property<string>("Note")
                        .HasMaxLength(200);

                    b.Property<long>("SongID");

                    b.Property<string>("Type");

                    b.Property<DateTime?>("UpdateDT");

                    b.HasKey("ID");

                    b.HasIndex("AuthorID");

                    b.HasIndex("SongID");

                    b.ToTable("SheetMusic");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.SingleSong", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Active")
                        .HasMaxLength(1);

                    b.Property<string>("Approved")
                        .HasMaxLength(1);

                    b.Property<string>("AuthorID");

                    b.Property<string>("Content");

                    b.Property<DateTime?>("CreateDT");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Note")
                        .HasMaxLength(200);

                    b.Property<DateTime?>("UpdateDT");

                    b.HasKey("ID");

                    b.HasIndex("AuthorID");

                    b.ToTable("SingleSong");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.Song", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Active")
                        .HasMaxLength(1);

                    b.Property<int?>("AlbumID")
                        .IsRequired();

                    b.Property<string>("Approved")
                        .HasMaxLength(1);

                    b.Property<string>("AuthorID");

                    b.Property<int?>("AuthorSongID")
                        .IsRequired();

                    b.Property<int>("CategoryID");

                    b.Property<DateTime?>("CreateDT");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(60);

                    b.Property<string>("Note")
                        .HasMaxLength(200);

                    b.Property<string>("OrtherName")
                        .HasMaxLength(60);

                    b.Property<string>("Slug")
                        .IsRequired()
                        .HasMaxLength(30);

                    b.Property<DateTime?>("UpdateDT");

                    b.Property<int?>("VietnameseLyric");

                    b.Property<int>("Views");

                    b.Property<string>("YearPublish");

                    b.HasKey("ID");

                    b.HasIndex("AlbumID");

                    b.HasIndex("AuthorID");

                    b.HasIndex("AuthorSongID");

                    b.HasIndex("CategoryID");

                    b.ToTable("Song");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.Style", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(60);

                    b.Property<string>("Note");

                    b.HasKey("ID");

                    b.ToTable("Style");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.Video", b =>
                {
                    b.Property<long>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsYoutube");

                    b.Property<string>("Link");

                    b.Property<string>("Name");

                    b.Property<long>("SongID");

                    b.HasKey("ID");

                    b.HasIndex("SongID");

                    b.ToTable("Video");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.Album", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorID");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.AuthorSong", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorID");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.Chords", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorID");

                    b.HasOne("HopAmNhacThanh.Models.Song")
                        .WithMany("ListChords")
                        .HasForeignKey("SongID1");

                    b.HasOne("HopAmNhacThanh.Models.Style", "Style")
                        .WithMany()
                        .HasForeignKey("StyleID");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.LinkSong", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorID");

                    b.HasOne("HopAmNhacThanh.Models.SingleSong", "SingleSong")
                        .WithMany()
                        .HasForeignKey("SingleSongID");

                    b.HasOne("HopAmNhacThanh.Models.Song")
                        .WithMany("ListLinkSong")
                        .HasForeignKey("SongID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.SheetMusic", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorID");

                    b.HasOne("HopAmNhacThanh.Models.Song")
                        .WithMany("ListSheetMusic")
                        .HasForeignKey("SongID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.SingleSong", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorID");
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.Song", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.Album", "Album")
                        .WithMany()
                        .HasForeignKey("AlbumID")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorID");

                    b.HasOne("HopAmNhacThanh.Models.AuthorSong", "AuthorSong")
                        .WithMany()
                        .HasForeignKey("AuthorSongID")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HopAmNhacThanh.Models.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HopAmNhacThanh.Models.Video", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.Song")
                        .WithMany("ListVideos")
                        .HasForeignKey("SongID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HopAmNhacThanh.Models.ApplicationUser")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}

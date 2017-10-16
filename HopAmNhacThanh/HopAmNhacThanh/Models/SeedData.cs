using HopAmNhacThanh.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public static class SeedData
    {
        public const string USER_ID = "2f157c91-5448-4110-b85a-3cf653219e4e";
        public static void SampleCategory(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (context.Category.Any())
                {
                    return;
                }
                context.Category.AddRange(
                    new Category
                    {
                        Name = "Hôn lễ",
                        Note = "Nhạc dùng cho hôm lễ"
                    },
                    new Category
                    {
                        Name = "Ngợi khen thờ phượng",
                        Note = "Nhạc dùng cho ngợi khen thờ phượng"
                    },
                    new Category
                    {
                        Name = "Giáng sinh",
                        Note = "Nhạc dùng cho giáng sinh"
                    }
                    );
                context.SaveChanges();


            }
        }
        public static void SampleStyle(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (context.Style.Any())
                {
                    return;
                }
                context.Style.AddRange(
                    new Style
                    {
                        Name = "Ballad",
                    },
                    new Style
                    {
                        Name = "Slow",
                    },
                    new Style
                    {
                        Name = "Blues",
                    },
                    new Style
                    {
                        Name = "Bollero",
                    },
                    new Style
                    {
                        Name = "Disco",
                    },
                    new Style
                    {
                        Name = "Slow Rock",
                    },
                    new Style
                    {
                        Name = "Valse",
                    },
                    new Style
                    {
                        Name = "Chachacha",
                    },
                    new Style
                    {
                        Name = "Boston",
                    },
                    new Style
                    {
                        Name = "Rock",
                    },
                    new Style
                    {
                        Name = "Fox",
                    },
                    new Style
                    {
                        Name = "Pop",
                    },
                    new Style
                    {
                        Name = "Rhumba",
                    },
                    new Style
                    {
                        Name = "Bossa Nova",
                    },
                    new Style
                    {
                        Name = "Điệu Tango",
                    }
                    );
                context.SaveChanges();


            }
        }

        public static void SampleAuthorSong(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (context.AuthorSong.Any())
                {
                    return;
                }
                context.AuthorSong.AddRange(
                    new AuthorSong
                    {
                        Name = "Davit dong",
                        Content = "Test",
                        Note = "Nhạc dùng cho hôm lễ"
                    }
                    );
                context.SaveChanges();


            }
        }
        public static void SampleSingleSong(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (context.SingleSong.Any())
                {
                    return;
                }
                context.SingleSong.AddRange(
                    new SingleSong
                    {
                        Name = "Isaac Thái",
                        Content = "Test",
                        Note = "Nhạc dùng cho hôm lễ",
                        Active = "A",
                        Approved = "A",
                        AuthorID = USER_ID,
                        CreateDT = DateTime.Now,
                        IsDeleted = false,
                        UpdateDT = DateTime.Now,
                    }
                    );
                context.SaveChanges();


            }
        }


        public static void SampleAlbum(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
               serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (context.Album.Any())
                {
                    return;
                }
                context.Album.AddRange(
                    new Album
                    {
                        Name = "Tôn Vinh Chúa Hằng Hữu",
                        Active = "A",
                        Approved = "A",
                        AuthorID = USER_ID,
                        CreateDT = DateTime.Now,
                        UpdateDT = DateTime.Now,
                        IsDeleted = false,
                    },
                    new Album
                    {
                        Name = "Dâng lời ca",
                        Active = "A",
                        Approved = "A",
                        AuthorID = USER_ID,
                        CreateDT = DateTime.Now,
                        UpdateDT = DateTime.Now,
                        IsDeleted = false,
                    },
                    new Album
                    {
                        Name = "Thánh ca",
                        Active = "A",
                        Approved = "A",
                        AuthorID = USER_ID,
                        CreateDT = DateTime.Now,
                        UpdateDT = DateTime.Now,
                        IsDeleted = false,
                    }
                );
                context.SaveChanges();
            }
        }

        public static void SampleSong(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(
               serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (context.Song.Count() >= 10)
                {
                    return;
                }
                Song song = new Song
                {
                    AlbumID = 2,
                    NumberSongInAlbum = 1,
                    AuthorSongID = 1,
                    CategoryID = 1,
                    YearPublish = "2015",

                    Name = "Ân Chúa dẫy đầy",
                    Active = "A",
                    Approved = "A",
                    AuthorID = USER_ID,
                    CreateDT = DateTime.Now,
                    UpdateDT = DateTime.Now,
                    IsDeleted = false,
                    Slug = "an-chua-day-day",
                };
                context.Song.Add(song);
                context.SaveChanges();

                LinkSong linkSong = new LinkSong
                {
                    CreateDT = DateTime.Now,
                    Active = "A",
                    Approved = "A",
                    AuthorID = USER_ID,
                    IsDeleted = false,
                    Link = "http://c34.vdc.nixcdn.com/65ad28f51891a0c8ebe3dbec5cfe34eb/59e4415b/NhacCuaTui235/AnChuaDayDay-IsaacThai_44yxp.mp3?t=1508131530579",
                    Note = "",
                    SongID = song.ID,
                    UpdateDT = null,
                    Tone = "",
                };
                linkSong.SingleSongID = 1;
                context.LinkSong.Add(linkSong);
                context.SaveChanges();

                Chords chords = new Chords
                {
                    CreateDT = DateTime.Now,
                    Active = "A",
                    Approved = "A",
                    AuthorID = USER_ID,
                    IsDeleted = false,
                    Note = "",
                    Info = "",
                    Intro = "Intro: Chưa có",
                    Lyric = "1 / [C] Lòng mong[F]ước có Chúa[G7]Jêsus trong tâm[Csus4]linh[C]này.<br>" +
"[C7]Lòng mong[F]ước Chúa chiếm hữu[G7]con sống trong người[C]con. [E7]<br>" +
"Xin cho[Am]lòng cảm[Am7 / G]nhận được ơn cứu[F]diệu kỳ.<br>" +
"Nguyện lòng[Dm]con đây tràn[D7]dâng Thánh Linh[Gsus4 G7]<br>" +
"<br>" +
"2 / Lòng mong[F]ước có thể[G7]đổi thay tâm ô[Csus4]dơ[C]này,<br>" +
"[C7]hàn gắn[F]hết những mảnh vở[G7]trong trái tim của[C]con.<br>" +
"[E7]Với hy[Am]vọng đặt[Am7]/[G]trong bàn tay của[F]Cha thiên thượng.<br>" +
"Nguyện Chúa[Dm]dẫn dắt đời[D7]con Chúa ôi! [Gsus4] [G7]<br>" +
"br" +
"ĐK: <br>" +
"Được sống trong[F]Ngài còn[G7]chi ước[C]muốn nào. [C7]<br>" +
"Được Chúa ngự[F] vào lòng còn[E7]chi tâm hồn sầu[Am]lo." +
"Nguyện xin[F]Chúa lấp đầy, Thần Linh[Gsus4]Chúa[G] tuôn[F]tràn[G7] trong[C]con" +
"Nguyện xin[F] Chúa lấp đầy, Thần Linh[Gsus4] Chúa[G]luôn[F] ngự[G7]trong[C] con.",
                    InfoShort = "",
                    Tone = "C",
                    Slug = "phien-ban-1",
                    SongID = song.ID,
                    StyleID = 1,
                    UpdateDT = DateTime.Now,
                    Version = "",
                };
                context.Chords.Add(chords);
                context.SaveChanges();

                Video video = new Video
                {
                    IsYoutube = true,
                    Link = "https://www.youtube.com/embed/poZ_PiHU3-M",
                    SongID = song.ID,
                    Name = "Ân Chúa Dẫy Đầy"

                };
                context.Video.Add(video);

                context.SaveChanges();
                SheetMusic sheetMusic = new SheetMusic
                {
                    CreateDT = DateTime.Now,
                    Active = "A",
                    Approved = "A",
                    AuthorID = USER_ID,
                    IsDeleted = false,
                    Note = "",
                    Name = "https://photos.app.goo.gl/h5orOnPc0mZ6c1d23",
                    SongID = song.ID,
                    Type = "PNG",
                    UpdateDT = null
                };
                context.SheetMusic.Add(sheetMusic);
                context.SaveChanges();
            }
        }
    }
}


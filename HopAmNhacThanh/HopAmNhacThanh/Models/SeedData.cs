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
        public static void SamepleCategory(IServiceProvider serviceProvider)
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

        public static void SamepleAuthorSong(IServiceProvider serviceProvider)
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
    }
}

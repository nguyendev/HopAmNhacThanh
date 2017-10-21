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
        public static void FinalCategory(IServiceProvider serviceProvider)
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
                        Name = "Ca ngợi thờ phượng",
                        Note = "Nhạc dùng cho ngợi khen thờ phượng",
                        Slug = "ca-ngoi-tho-phuong"
                    },
                    new Category
                    {
                        Name = "Đức Chúa Trời",
                        Note = "Ba ngôi, thuộc tính, gìn giữ, dẫn dắt",
                        Slug = "duc-chua-troi"
                    },
                    new Category
                    {
                        Name = "Chúa Giê-xu Christ",
                        Note = "Giáng sinh, bản tánh, đời sống và chức vụ, Chịu khổ và chết, phục sinh, thăng thiên, tái lâm",
                        Slug = "chua-gie-xu-christ"
                    },
                    new Category
                    {
                        Name = "Đức Thánh Linh",
                        Note = "",
                        Slug = "chua-gie-xu-christ"
                    },
                    new Category
                    {
                        Name = "Hội Thánh",
                        Note = "",
                        Slug = "hoi-thanh"
                    },
                    new Category
                    {
                        Name = "Kinh Thánh",
                        Note = "",
                        Slug = "kinh-thanh"
                    },
                    new Category
                    {
                        Name = "Tin lành",
                        Note = "",
                        Slug = "tin-lanh"
                    },
                    new Category
                    {
                        Name = "Đời tín đồ",
                        Note = "",
                        Slug = "tin-lanh"
                    },
                    new Category
                    {
                        Name = "Cõi lai sanh",
                        Note = "Sống lại và chịu phán xét",
                        Slug = "Thiên đàng"
                    },
                    new Category
                    {
                        Name = "Thiếu nhi",
                        Note = "Nhạc dùng cho thanh niên",
                        Slug = "thieu-nhi"
                    },
                    new Category
                    {
                        Name = "Thanh niên",
                        Note = "Nhạc dùng cho thanh niên",
                        Slug = "thanh-nien"
                    },
                    new Category
                    {
                        Name = "Đơn ca - Song ca",
                        Note = "Nhạc dùng riêng cho đơn ca, song ca",
                        Slug = "don-ca-song-ca"
                    },
                    new Category
                    {
                        Name = "Truyền giảng",
                        Note = "Nhạc dùng cho truyền giảng, truyền giáo",
                        Slug = "truyen-giang"
                    },
                    new Category
                    {
                        Name = "Lễ nghi",
                        Note = "Dâng con, báp têm, tiệc thánh",
                        Slug = "le-nghi"
                    },
                    new Category
                    {
                        Name = "Biệt lễ ca",
                        Note = "Hôn lễ, tang lễ, năm mới, từ giả, phong chức mục sư ...",
                        Slug = "bap-tem"
                    },
                    new Category
                    {
                        Name = "Đoản ca",
                        Note = "Nhạc dùng cho đoản ca",
                        Slug = "bap-tem"
                    },
                    new Category
                    {
                        Name = "Hợp ca",
                        Note = "Nhạc dùng cho đoản ca",
                        Slug = "bap-tem"
                    },
                    new Category
                    {
                        Name = "Việt Nam ca",
                        Note = "Nhạc dùng cho đoản ca",
                        Slug = "bap-tem"
                    }
                    );
                context.SaveChanges();


            }
        }
        public static void FinalStyle(IServiceProvider serviceProvider)
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
        public static void FinalAlbum(IServiceProvider serviceProvider)
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
                        Slug = "ton-vinh-chua-hang-huu",
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
                        Slug = "dang-loi-ca",
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
                        Slug="thang-ca",
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

    }
}


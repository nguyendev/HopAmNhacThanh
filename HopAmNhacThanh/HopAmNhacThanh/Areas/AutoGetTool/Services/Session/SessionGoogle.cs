using HopAmNhacThanh.Areas.AutoGetTool.ViewModels;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.AutoGetTool.Services.Session
{
    public class SessionGoogle
    {
        public static void SetSessionGoogleSearch(List<SearchViewModel> listsearch, HttpContext http)
        {
            try
            {
                int i = 0;
                foreach (var item in listsearch)
                {
                    http.Session.SetString($"Title{i}", item.Title);
                    http.Session.SetString($"Link{i}", item.Link);
                    http.Session.SetString($"Des{i}", item.Description);
                    i++;
                }
                http.Session.SetInt32("number", i);
            }
            catch { }
        }

        public static List<SearchViewModel> GetSessionGoogleSearch(HttpContext http)
        {
            try
            {
                List<SearchViewModel> listSearch = new List<SearchViewModel>();
                int? count = http.Session.GetInt32("number");
                if (count.HasValue)
                {
                    for (int i = 0; i < count; i++)
                    {
                        var Title = http.Session.GetString($"Title{i}");
                        var Link = http.Session.GetString($"Link{i}");
                        var Des = http.Session.GetString($"Des{i}");
                        listSearch.Add(new SearchViewModel(Title, Des, Link));
                    }
                }
                return listSearch;
            }
            catch
            {
                return null;
            }
        }
    }
}
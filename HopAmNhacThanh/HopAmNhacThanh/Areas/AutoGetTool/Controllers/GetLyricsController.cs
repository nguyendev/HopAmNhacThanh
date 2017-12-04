using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HopAmNhacThanh.Areas.AutoGetTool.ViewModels;
using System.Net.Http;
using System.Text;
using HtmlAgilityPack;
using System.Net;
using HopAmNhacThanh.Areas.AutoGetTool.Services.Session;

namespace HopAmNhacThanh.Areas.AutoGetTool.Controllers
{
    [Area("AutoGetTool")]
    [Authorize(Roles = "Admin, Manager")]
    public class GetLyricsController : Controller
    {
        public const int TYPE_CHORDS = 1;
        public const int TYPE_LYRICS = 2;
        [Route("tu-dong/loi-va-hop-am-bai-hat")]
        public async Task<IActionResult> Index(string searchString,int type, string number)
        {
            if (String.IsNullOrEmpty(number))
                number = "10";

            var items = new List<SearchViewModel>();
            if (!String.IsNullOrEmpty(searchString))
            {
                switch (type)
                {
                    case TYPE_CHORDS:
                        searchString = "hop am " + searchString;
                        break;
                    case TYPE_LYRICS:
                        searchString = "loi bai hat " + searchString;
                        break;
                    default:
                        searchString = "hop am " + searchString;
                        break;
                }
                ViewData["CurrentNumber"] = Int32.Parse(number);
                items = await getContentGoogleAsync(searchString, Int32.Parse(number));
                ViewData["Type"] = type;
            }
            
            if (items.Count > 0)
                return View(items);
            return View();
        }


        public async Task<List<SearchViewModel>> getContentGoogleAsync(string Search, int number)
        {
            string url = "https://www.google.com.vn/search?num=" + number + "&q=" + Search +
                "&ie=utf-8&oe=utf-8";
            List<SearchViewModel> listSearch = new List<SearchViewModel>();
            HttpClient http = new HttpClient();
            var response = await http.GetByteArrayAsync(url);
            String source = Encoding.GetEncoding("utf-8").GetString(response, 0, response.Length - 1);
            source = WebUtility.HtmlDecode(source);
            HtmlDocument document = new HtmlDocument();


            // Load trang web, nạp html vào document
            // HtmlDocument document = htmlWeb.Load(url);
            document.LoadHtml(source);
            ViewData["Text"] = source;
            var threadItems = document.DocumentNode.SelectNodes(".//div[@class='g']").ToList();
            foreach (var item in threadItems)
            {
                try
                {
                    var linkNode = item.SelectSingleNode(".//h3[@class='r']/a");
                    var link = linkNode.Attributes["href"].Value;
                    //Format UTF 8
                    link = System.Uri.UnescapeDataString(link);
                    var title = linkNode.InnerText;
                    var Desciption = item.SelectSingleNode(".//span[@class='st']").InnerText;
                    if (link.Contains("http"))
                        listSearch.Add(new SearchViewModel(title, Desciption, link));
                }
                catch { }
            }
            //ViewData["Text"] = items;
            ////Load các tag div trong tag div id="rso'

            //var threadItems = document.DocumentNode.QuerySelectorAll("div#rso > div").ToList();
            //if (threadItems != null)
            SessionGoogle.SetSessionGoogleSearch(listSearch, this.HttpContext);
            return listSearch;
        }

    }
}
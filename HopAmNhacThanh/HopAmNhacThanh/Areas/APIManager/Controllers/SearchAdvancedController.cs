using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HtmlAgilityPack;
using HopAmNhacThanh.Areas.AutoGetTool.Services;
using DoVuiHaiNao.Services;

namespace HopAmNhacThanh.Areas.APIManager.Controllers
{
    [Produces("application/json")]
    [Route(GlobalAPI.SEARCH_ADVANCED_ROOT)]
    public class SearchAdvancedController : Controller
    {
        [HttpGet(GlobalAPI.GET_SEARCH)]
        public async Task<IActionResult> Search(string searchString)
        {
            //search = search.Replace(" ", "-");
            string url = "https://hopamviet.vn/chord/search.html?song=" + searchString;
            return Json(await GetListSong(url));
        }
        
        public async Task<List<SimpleSongDomain>> GetListSong(string url)
        {
            string source = await NhanDienMauServices.FormatHtml(url);
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(source);
            List<SimpleSongDomain> list = new List<SimpleSongDomain>();
            try
            {
                for (int i = 1; i <= 20; i++)
                {
                    
                    //*[@id="list_sub_featured"]/li[1]/a[1]
                    //string nodestring = ".//*[@id='aspnetForm']/div[5]/div[1]/div[1]/div[1]/div[1]/div[2]/ul/li[" + i + "]/h4/a";
                    string xpathTagA = "/html/body/div[1]/div/div[1]/div[2]/div/div["+i+"]/h4/a";
                    var tagA = doc.DocumentNode.SelectSingleNode(xpathTagA);
                    SimpleSongDomain simpleSong = new SimpleSongDomain
                    {
                        Title = tagA.InnerText,
                        URL = tagA.Attributes["href"].Value,

                    };
                    string xpathTagEm = "/html/body/div[1]/div/div[1]/div[2]/div/div["+i+"]/em";
                    var tagEm = doc.DocumentNode.SelectSingleNode(xpathTagEm);
                    simpleSong.Description = tagEm.InnerText;

                    simpleSong.Title = simpleSong.Title.Replace("\n", "");
                    simpleSong.Description =SEOExtension.GetStringToLengthNoEndLine(simpleSong.Description.Replace("\n", ""), Global.LENGTH_LYRIC_MOBILE);
                    simpleSong.URL = simpleSong.URL.Replace("https://hopamviet.vn/chord/song/", "");
                    simpleSong.URL = simpleSong.URL.Replace("/", "_");
                    list.Add(simpleSong);
                }
            }
            catch { }
            return list;
        }

        [HttpGet(GlobalAPI.SEARCH_ADVANCED_GET_SINGLE)]
        public async Task<string> GetSingle(string url)
        {
            url = url.Replace("_", "/");
            url = "https://hopamviet.vn/chord/song/" + url;
            string source = await NhanDienMauServices.FormatHtml(url);
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(source);

            string lyric = "";
            try
            {
                string xpathLyric = ".//*[@id='lyric']";
                var tagLyric = doc.DocumentNode.SelectSingleNode(xpathLyric);
                lyric = tagLyric.InnerText;
                lyric = lyric.Replace("\n", "<br />");
            }
            catch { }
            return lyric;
        }
        public static async Task<string> FormatHtml(string url)
        {
            try
            {
                HtmlDocument document = new HtmlDocument();
                document = await HtmlAgilityPackServices.InitAsync(url);
                //document = HtmlAgilityPackServices.RemoveStyleAttributes(document);
                //document = HtmlAgilityPackServices.RemoveScripts(document);
                //document = HtmlAgilityPackServices.RemoveAllAttributes(document);
                // document = HtmlAgilityPackServices.RemoveAllText(document);
                //var parser = new HtmlParser();
                //var document = parser.Parse(source);
                string source = document.DocumentNode.InnerHtml;
                return source;
                //remove comment
                //var nodes = document.DocumentNode.SelectNodes("//comment()");
                //if (nodes != null)
                //{
                //    foreach (var comment in nodes)
                //    {
                //        comment.ParentNode.RemoveChild(comment);
                //    }
                //}
                //Content content = new Content();

                //await ParserExtension.GetText(Search.Link);
                //string[] text = new string[ParserExtension.Count];
                //text = ParserExtension.Text;
                //return new ParserViewModel(Search.Title, Search.Link, text);

            }
            catch (Exception e)
            {
                String error = e.StackTrace;
            }
            return null;
        }
    }
    public class SimpleSongDomain
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string URL { get; set; }
    }
}
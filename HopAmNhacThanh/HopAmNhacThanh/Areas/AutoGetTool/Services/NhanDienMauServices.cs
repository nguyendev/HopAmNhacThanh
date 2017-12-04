using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.AutoGetTool.Services
{
    public class NhanDienMauServices
    {
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
}

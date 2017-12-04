using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.AutoGetTool.Services
{
    public static class HtmlAgilityPackServices
    {
        public static async Task<HtmlDocument> InitAsync(string url)
        {
            HttpClient http = new HttpClient();
            //Format UTF 8
            var link = System.Uri.UnescapeDataString(url);

            var response = await http.GetByteArrayAsync(link);
            String source = Encoding.GetEncoding("utf-8").GetString(response, 0, response.Length - 1);
            source = WebUtility.HtmlDecode(source);

            HtmlDocument document = new HtmlDocument();
            //Load trang web, nạp html vào document
            document.LoadHtml(source);
            return document;
        }

        public static HtmlDocument RemoveStyleAttributes(this HtmlDocument html)
        {
            var elementsWithStyleAttribute = html.DocumentNode.SelectNodes("//@style");

            if (elementsWithStyleAttribute != null)
            {
                foreach (var element in elementsWithStyleAttribute)
                {
                    element.Attributes["style"].Remove();
                }
            }
            return html;

        }
        public static HtmlDocument RemoveAllAttributes(this HtmlDocument html)
        {
            var elementsWithAttribute = html.DocumentNode.SelectNodes("//@*");
            if (elementsWithAttribute != null)
            {
                foreach (var element in elementsWithAttribute)
                {
                    element.Attributes.RemoveAll();
                }
            }
            return html;

        }
        public static HtmlDocument RemoveAllText(HtmlDocument html)
        {
            var elementsWithText = html.DocumentNode.SelectNodes("//body//text()");
            if (elementsWithText != null)
            {
                foreach (var element in elementsWithText)
                {
                    element.RemoveAll();
                }
            }
            return html;
        }
        public static HtmlAgilityPack.HtmlDocument RemoveScripts(HtmlAgilityPack.HtmlDocument webDocument)
        {

            // Get all Nodes: script
            HtmlAgilityPack.HtmlNodeCollection Nodes = webDocument.DocumentNode.SelectNodes("//script");

            // Make sure not Null:
            if (Nodes == null)
                return webDocument;

            // Remove all Nodes:
            foreach (HtmlNode node in Nodes)
                node.Remove();

            return webDocument;

        }
    }
}
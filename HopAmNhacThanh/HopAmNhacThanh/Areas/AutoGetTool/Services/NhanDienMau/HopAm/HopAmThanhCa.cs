using HopAmNhacThanh.Areas.AutoGetTool.ViewModels;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.AutoGetTool.Services.NhanDienMau.HopAm
{
    public class HopAmThanhCa
    {
        public static bool Check(HtmlDocument doc)
        {
            var nodeH1 = doc.DocumentNode.SelectSingleNode(".//*[@id='songContent']");
            if (nodeH1 == null)
                return false;
            return true;
        }
        public static NhanDienLyricViewModel GetContent(HtmlDocument doc, string url)
        {
            string lyric = "";
            string[] pTemp = new string[100];
            var nodeText = doc.DocumentNode.SelectNodes(".//*[@id='songContent']");

            foreach (var item in nodeText)
            {
                lyric += item.InnerText + "<br>";
            }

            return new NhanDienLyricViewModel(url, lyric, "HopAmThanhCa");
        }
    }
}
using HopAmNhacThanh.Areas.AutoGetTool.ViewModels;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.AutoGetTool.Services.NhanDienMau.HopAm
{
    public class HopAmVnchord
    {
        public static bool Check(HtmlDocument doc)
        {
            var nodeP = doc.DocumentNode.SelectSingleNode(".//*[@id='chord_lyric']");
            if (nodeP == null)
                return false;
            if (nodeP.InnerText.Length <= GlobalChordAndLyric.MIN_MAIN_CONTENT)
                return false;
            //foreach (var item in nodeText)
            //{
            //     if (item.ParentNode.ParentNode != parentNodeH1)
            //        return false;
            //}
            return true;
        }
        public static NhanDienLyricViewModel GetContent(HtmlDocument doc, string url)
        {
            string lyrics = "";
            var nodeLyric = doc.DocumentNode.SelectSingleNode(".//*[@id='chord_lyric']");
            lyrics = nodeLyric.InnerText;

            return new NhanDienLyricViewModel(url, lyrics, "HopAmVnChord");
        }
    }
}

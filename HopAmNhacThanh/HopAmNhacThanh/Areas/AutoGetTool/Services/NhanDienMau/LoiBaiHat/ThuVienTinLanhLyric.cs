﻿using HopAmNhacThanh.Areas.AutoGetTool.ViewModels;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.AutoGetTool.Services.NhanDienMau.LoiBaiHat
{
    public class Mp3ZingLyric
    {
        public static bool Check(HtmlDocument doc)///div
        {
            var nodeP = doc.DocumentNode.SelectSingleNode(".//*[@id='lyrics10739266801']/p");
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
            string[] pTemp = new string[100];
            var nodeLyric = doc.DocumentNode.SelectSingleNode(".//*[@id='lyrics10739266801']/p");
            lyrics = nodeLyric.InnerText;

            return new NhanDienLyricViewModel(url, lyrics, "mp3zinglyric");
        }
    }
}
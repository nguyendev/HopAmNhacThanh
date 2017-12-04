using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Areas.AutoGetTool.Services.Session;
using HopAmNhacThanh.Areas.AutoGetTool.ViewModels;
using HtmlAgilityPack;
using HopAmNhacThanh.Areas.AutoGetTool.Services;
using HopAmNhacThanh.Areas.AutoGetTool.Services.NhanDienMau.HopAm;
using HopAmNhacThanh.Areas.AutoGetTool.Services.NhanDienMau.LoiBaiHat;

namespace HopAmNhacThanh.Areas.AutoGetTool.Controllers
{
    [Area("AutoGetTool")]
    public class NhanDienMauController : Controller
    {
        public async Task<IActionResult> GetChords()
        {
            List<SearchViewModel> listSearch = SessionGoogle.GetSessionGoogleSearch(this.HttpContext);
            List<NhanDienLyricViewModel> listResult = new List<NhanDienLyricViewModel>();
            foreach (var item in listSearch)
            {
                bool daThem = false;
                try
                {
                    string source = await NhanDienMauServices.FormatHtml(item.Link);
                    HtmlDocument doc = new HtmlDocument();
                    doc.LoadHtml(source);

                    bool isChuan = HopAmChuan.Check(doc);
                    bool isChuanLink = HopAmChuanLink.Check(doc);
                    bool isGuitar = HopAmGuitar.Check(doc);
                    bool isPro = HopAmPro.Check(doc);
                    bool isThanhCa = HopAmThanhCa.Check(doc);
                    bool isViet = HopAmViet.Check(doc);
                    bool isVnChord = HopAmVnchord.Check(doc);
                    if (isChuan)
                    {
                        listResult.Add(HopAmChuan.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isChuanLink)
                    {
                        listResult.Add(HopAmChuanLink.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isGuitar)
                    {
                        listResult.Add(HopAmGuitar.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isPro)
                    {
                        listResult.Add(HopAmPro.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isThanhCa)
                    {
                        listResult.Add(HopAmThanhCa.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isViet)
                    {
                        listResult.Add(HopAmViet.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isVnChord)
                    {
                        listResult.Add(HopAmVnchord.GetContent(doc, item.Link));
                        daThem = true;
                    }
                }
                catch { }
                if (!daThem)
                    listResult.Add(new NhanDienLyricViewModel(item.Link, "Không tìm thấy", "Not Template"));
            }
            return View("GetLyric",listResult);
        }

        public async Task<IActionResult> GetLyrics()
        {
            List<SearchViewModel> listSearch = SessionGoogle.GetSessionGoogleSearch(this.HttpContext);
            List<NhanDienLyricViewModel> listResult = new List<NhanDienLyricViewModel>();
            foreach (var item in listSearch)
            {
                bool daThem = false;
                try
                {
                    string source = await NhanDienMauServices.FormatHtml(item.Link);
                    HtmlDocument doc = new HtmlDocument();
                    doc.LoadHtml(source);
                    bool isLoiBaiHatBiz = LoiBaiHatBizLyric.Check(doc);
                    bool isLoiBaiHatMobie = LoiBaiHatMobiLyric.Check(doc);
                    bool isMp3Zing = Mp3ZingLyric.Check(doc);
                    bool isNhacCuaTui = NhacCuaTuiLyric.Check(doc);
                    bool isNhacHay = NhacHayLyric.Check(doc);
                    bool isTaiNhacMp3 = TaiNhacMp3Lyric.Check(doc);
                    bool isThuVienTinLanh = ThuVienTinLanhLyric.Check(doc);

                    bool isChuan = HopAmChuan.Check(doc);
                    bool isChuanLink = HopAmChuanLink.Check(doc);
                    bool isGuitar = HopAmGuitar.Check(doc);
                    bool isPro = HopAmPro.Check(doc);
                    bool isThanhCa = HopAmThanhCa.Check(doc);
                    bool isViet = HopAmViet.Check(doc);
                    bool isVnChord = HopAmVnchord.Check(doc);

                    if (isLoiBaiHatBiz)
                    {
                        listResult.Add(LoiBaiHatBizLyric.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isLoiBaiHatMobie)
                    {
                        listResult.Add(LoiBaiHatMobiLyric.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isMp3Zing)
                    {
                        listResult.Add(Mp3ZingLyric.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isNhacCuaTui)
                    {
                        listResult.Add(NhacCuaTuiLyric.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isNhacHay)
                    {
                        listResult.Add(NhacHayLyric.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isTaiNhacMp3)
                    {
                        listResult.Add(TaiNhacMp3Lyric.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isThuVienTinLanh)
                    {
                        listResult.Add(ThuVienTinLanhLyric.GetContent(doc, item.Link));
                        daThem = true;
                    }

                    if (isChuan)
                    {
                        listResult.Add(HopAmChuan.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isChuanLink)
                    {
                        listResult.Add(HopAmChuanLink.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isGuitar)
                    {
                        listResult.Add(HopAmGuitar.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isPro)
                    {
                        listResult.Add(HopAmPro.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isThanhCa)
                    {
                        listResult.Add(HopAmThanhCa.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isViet)
                    {
                        listResult.Add(HopAmViet.GetContent(doc, item.Link));
                        daThem = true;
                    }
                    if (isVnChord)
                    {
                        listResult.Add(HopAmVnchord.GetContent(doc, item.Link));
                        daThem = true;
                    }
                }
                catch { }
                if (!daThem)
                    listResult.Add(new NhanDienLyricViewModel(item.Link, "Không tìm thấy hoặc chưa có mẫu này", "Not Template"));
            }
            return View("GetLyric", listResult);
        }
    }
}
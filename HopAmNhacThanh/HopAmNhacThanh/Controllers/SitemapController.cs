using DoVuiHaiNao.Services;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Controllers
{
    public class SitemapController : Controller
    {
        public const string APPROVED = "A";
        public const string UNAPPROVED = "U";
        private readonly ApplicationDbContext _blogService;
        public SitemapController(ApplicationDbContext blogService)
        {
            _blogService = blogService;
        }

        [Route("sitemap.xml")]
        public async Task<ActionResult> Sitemap()
        {
            string scheme = HttpContext.Request.Scheme;
            string host = HttpContext.Request.Host.Host;
            string port = HttpContext.Request.Host.Port.ToString();
            string root = string.Format("{0}://{1}", scheme, host);

            // get last modified date of the home page
            var siteMapBuilder = new SitemapBuilder();

            // add the home page to the sitemap
            siteMapBuilder.AddUrl(root, modified: DateTime.UtcNow, changeFrequency: ChangeFrequency.Weekly, priority: 1.0);
#region song, sheet, chord
            var song = await _blogService.Song
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            string DIR_SONG= root + "/bai-hat/";
            string DIR_SHEET = root + "/sheet/";
            string DIR_DOWNLOAD_SHEET = root + "/sheet/tai-ve/";
            foreach (var item in song)
            {
                var chords = await _blogService.Chords
                        .Where(p => p.SongID == item.ID)
                        .Where(p => p.Approved == APPROVED)
                        .ToListAsync();
                foreach(var itemChord in chords)
                {
                    siteMapBuilder.AddUrl(DIR_SONG + item.Slug + "/" + itemChord.Slug, modified: itemChord.CreateDT, changeFrequency: null, priority: 0.9);
                }
                var sheet = await _blogService.SheetMusic
                    .Where(p => p.SongID == item.ID)
                        .Where(p => p.Approved == APPROVED)
                        .ToListAsync();
                if (sheet.Any()) { 
                    siteMapBuilder.AddUrl(DIR_SHEET +item.Slug, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
                    siteMapBuilder.AddUrl(DIR_DOWNLOAD_SHEET + item.Slug, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
                }
            }
#endregion
            #region singleSong
            var singleSong = await _blogService.SingleSong
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            string DIR_SINGLESONG = "/ca-sy/";
            foreach (var item in singleSong)
            {
                siteMapBuilder.AddUrl(DIR_SINGLESONG + item.Slug, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            }
            #endregion

            #region album
            var album = await _blogService.Album
                .Where(p => p.Approved == Global.APPROVED)
                .Where(p => p.CreateDT <= DateTime.Now)
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            string DIR_ALBUM = "/album/";
            foreach (var item in album)
            {
                siteMapBuilder.AddUrl(DIR_ALBUM + item.Slug, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            }
            #endregion

            #region Category
            var category = await _blogService.Category
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            string DIR_CATEGORY = "/danh-muc/";
            foreach (var item in category)
            {
                siteMapBuilder.AddUrl(DIR_CATEGORY + item.Slug, null, changeFrequency: null, priority: 0.9);
            }
            #endregion

            #region Style
            var style = await _blogService.Style
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            string DIR_STYLE = "/dieu/";
            foreach (var item in style)
            {
                siteMapBuilder.AddUrl(DIR_STYLE + item.Slug, null, changeFrequency: null, priority: 0.9);
            }
            #endregion

            #region VietnameseLyric
            var vietnames = await _blogService.VietnameseLyric
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            string DIR_VN = "/loi-viet/";
            foreach (var item in vietnames)
            {
                siteMapBuilder.AddUrl(DIR_VN + item.Slug, null, changeFrequency: null, priority: 0.9);
            }
            #endregion

            #region audio in wwwroot
            var audio = await _blogService.LinkSong
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            string DIR_LINKSONG = "/audio/";
            foreach (var item in audio)
            {
                siteMapBuilder.AddUrl(DIR_LINKSONG + item.Name, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            }
            #endregion

            #region sheet in wwwroot
            var sheetmusic = await _blogService.LinkSong
                .Where(p => !p.IsDeleted)
                .ToListAsync();
            string DIR_SHEETMUSIC_WWW = "/sheetmusic/";
            foreach (var item in sheetmusic)
            {
                siteMapBuilder.AddUrl(DIR_SHEETMUSIC_WWW + item.Name, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            }
            #endregion

            // generate the sitemap xml
            string xml = siteMapBuilder.ToString();
            return Content(xml, "text/xml");
        }
    }
}
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
            // get a list of published articles
            //var images = await _blogService.Images.ToListAsync();



            //string picFull = root + "/images/";
            //string pic640x480 = root + "/images/640x480/";

            //// add the blog posts to the sitemap
            //foreach (var item in images)
            //{
            //    siteMapBuilder.AddUrl(picFull + item.Name, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            //    siteMapBuilder.AddUrl(pic640x480 + item.Name, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            //}

            //var singlePuzzles = await _blogService.SinglePuzzle
            //    .Where(p => !p.IsMMultiPuzzle && p.Approved == "A" && !p.IsDeleted)
            //    .Where(p => p.CreateDT < DateTime.Now)
            //    .ToListAsync();
            //string singlePuzzlesRoot = root + "/cau-do-moi-ngay/";
            //foreach (var item in singlePuzzles)
            //{
            //    siteMapBuilder.AddUrl(singlePuzzlesRoot + item.Slug, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            //}

            //var multiPuzzles = await _blogService.MultiPuzzle
            //    .Where(p => p.Approved == "A" && !p.IsDeleted)
            //    .Where(p => p.CreateDT < DateTime.Now)
            //    .ToListAsync();
            //string multiPuzzlesRoot = root + "/cau-do-dac-biet/";
            //foreach (var item in multiPuzzles)
            //{
            //    siteMapBuilder.AddUrl(multiPuzzlesRoot + item.Slug, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            //}

            //var blogs = await _blogService.Post
            //    .Where(p => p.Approved == "A" && !p.IsDeleted)
            //    .Where(p => p.CreateDT < DateTime.Now)
            //    .ToListAsync();
            //string blogRoot = root + "/blogs/";
            //foreach (var item in blogs)
            //{
            //    siteMapBuilder.AddUrl(blogRoot + item.Slug, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            //}

            //var tags = await _blogService.Tag
            //    .Where(p => p.CreateDT < DateTime.Now)
            //    .ToListAsync();
            //string tagsRoot = root + "/the/";
            //foreach (var item in tags)
            //{
            //    siteMapBuilder.AddUrl(tagsRoot + item.Slug, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            //}

            //var member = await _blogService.Member
            //    .Where(p => p.CreateDT < DateTime.Now)
            //    .ToListAsync();
            //string memberRoot = root + "/thanh-vien/";
            //foreach (var item in member)
            //{
            //    siteMapBuilder.AddUrl(memberRoot + item.Slug, modified: item.CreateDT, changeFrequency: null, priority: 0.9);
            //}

            var song = await _blogService.Song
                .Where(p => p.CreateDT < DateTime.Now)
                .ToListAsync();
            string songRoot = root + "/bai-hat/";
            foreach (var item in song)
            {
                var chords = await _blogService.Chords
                        .Where(p => p.SongID == item.ID)
                        .Where(p => p.Approved == APPROVED)
                        .ToListAsync();
                foreach(var itemChord in chords)
                {
                    siteMapBuilder.AddUrl(songRoot + item.Slug + "/" + item.Slug);
                }
            }

            // generate the sitemap xml
            string xml = siteMapBuilder.ToString();
            return Content(xml, "text/xml");
        }
    }
}
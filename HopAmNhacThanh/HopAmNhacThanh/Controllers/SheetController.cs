using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.SheetMusicRepository;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;

namespace HopAmNhacThanh.Controllers
{
    public class SheetController : Controller
    {
        private readonly ISheetMusicRepository _repository;
        private const string DIR_SHEET = "sheetmusic";
        public IHostingEnvironment HostingEnvironment { get; set; }

        public SheetController(IHostingEnvironment hostingEnvironment,
            ISheetMusicRepository repository)
        {
            HostingEnvironment = hostingEnvironment;
            _repository = repository;
        }


        [Route("/sheet/{slug}")]
        public async Task<IActionResult> Single(string slug)
        {
            ViewData["single"] = await  _repository.GetSingle(slug);
            return View();
        }


        [Route("/sheet/tai-ve/{slug}")]
        public async Task<IActionResult> Download(string slug)
        {
            ViewData["download"] = await _repository.GetSingle(slug);
            return View();
        }
        [Route("/sheet/tai-ve-tap-tin/{filename}")]
        public async Task<IActionResult> DownloadFile(string filename)
        {
            if (filename == null)
                return Content("filename not present");

            string path = HostingEnvironment.WebRootPath+"\\"+DIR_SHEET +"\\" + filename;

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(path), Path.GetFileName(path));
        }

        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }
        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats"+
                           "officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }


    }
}
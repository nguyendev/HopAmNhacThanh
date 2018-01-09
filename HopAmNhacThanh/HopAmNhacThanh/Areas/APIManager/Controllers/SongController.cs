using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Areas.APIManager.Data;
using DoVuiHaiNao.Services;

namespace HopAmNhacThanh.Areas.APIManager.Controllers
{
    [Produces("application/json")]
    [Route("api/Song")]
    public class SongController : Controller
    {
        public readonly ISongApiRepository _repository;
        public SongController(ISongApiRepository repository)
        {
            _repository = repository;
        }
        
        // GET: api/Home/5
        [HttpGet("{api_key}/getNews")]
        public async Task<JsonResult> GetNew(string api_key)
        {
            if (api_key == Global.API_KEY)
            {
                int pageSize = Global.PAGE_SIZE_MOBILE;
                return Json(await _repository.GetNews(1, pageSize));
            }
            return null;
        }
        [HttpGet("{api_key}/getSingle/{slug}/{slugVersion}")]
        public async Task<JsonResult> GetSingle(string api_key, string slug, string slugVersion)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(await _repository.GetSingle(slug, slugVersion));
            }
            return null;
        }
        [HttpGet("{api_key}/getPopulars")]
        public async Task<JsonResult> Populars(string api_key)
        {
            if (api_key == Global.API_KEY)
            {
                int pageSize = Global.PAGE_SIZE_MOBILE;
                return Json(await _repository.GetPopulars(1, pageSize));
            }
            return null;
        }
    }
}
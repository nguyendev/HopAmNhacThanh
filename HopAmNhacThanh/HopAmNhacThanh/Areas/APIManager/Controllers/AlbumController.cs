using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.APIManager.Data;

namespace HopAmNhacThanh.Areas.APIManager.Controllers
{
    [Produces("application/json")]
    [Route("api/Album")]
    public class AlbumController : Controller
    {
        private readonly IAlbumApiRepository _repository;
        public AlbumController(IAlbumApiRepository repository)
        {
            _repository = repository;
        }
        [HttpGet("{api_key}/getList")]
        public async Task<JsonResult> ListAlbum(string api_key)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(await _repository.GetListAlbum());
            }
            return Json(null);
        }
        [HttpGet("{api_key}/getSingle&slug={slug}")]
        public async Task<JsonResult> SingleAlbum(string api_key,string slug)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(await _repository.GetSingleAlbum(slug));
            }
            return Json(null);
        }
        [HttpGet("{api_key}&q={searchString}&slug={slug}")]
        public async Task<JsonResult> GetSearch(string api_key, string searchString, string slug)
        {
            if (api_key == Global.API_KEY)
            {
                int pageSize = Global.PAGE_SIZE_MOBILE;
                return Json(await _repository.GetSearch(searchString, slug));
            }
            return null;
        }
    }
}
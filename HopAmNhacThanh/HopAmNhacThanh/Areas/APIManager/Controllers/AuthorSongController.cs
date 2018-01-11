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
    [Route("api/AuthorSong")]
    public class AuthorSongController : Controller
    {
        public readonly IAuthorSongApiRepository _repository;
        public AuthorSongController(IAuthorSongApiRepository repository)
        {
            _repository = repository;
        }
        [HttpGet("{api_key}")]
        public JsonResult GetList(string api_key)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(_repository.GetListAuthorSong());
            }
            return null;
        }
        [HttpGet("{api_key}/single&q={slug}")]
        public JsonResult GetSingle(string api_key, string slug)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(_repository.GetSingleAuthorSong(slug));
            }
            return null;
        }
    }
}
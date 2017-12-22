using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.HomeRepository;
using DoVuiHaiNao.Services;

namespace HopAmNhacThanh.Areas.APIManager.Controllers
{
    [Produces("application/json")]
    [Route("api/Home")]
    public class HomeController : Controller
    {
        public readonly IHomeRepository _repository;
        public HomeController(IHomeRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Home/5
        [HttpGet("{api_key}")]
        public JsonResult GetHome(string api_key)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(_repository.GetMainHome());
            }
            return null;
        }

        [HttpGet("{api_key}/{slug}/{slugVersion}")]
        public JsonResult GetSingle(string api_key, string slug, string slugVersion)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(_repository.GetMainSingle(slug, slugVersion));
            }
            return null;
        }
    }
}

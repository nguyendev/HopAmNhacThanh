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
    [Route(GlobalAPI.HOME_ROOT)]
    public class HomeController : Controller
    {
        public readonly IHomeRepository _repository;
        public HomeController(IHomeRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Home/5
        [HttpGet(GlobalAPI.GET_LIST)]
        public JsonResult GetList(string api_key)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(_repository.GetMainHome());
            }
            return null;
        }

        [HttpGet(GlobalAPI.GET_SINGLE_WITH_SLUG_VERSION)]
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

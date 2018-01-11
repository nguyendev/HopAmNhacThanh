using DoVuiHaiNao.Services;
using HopAmNhacThanh.Areas.APIManager.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Controllers
{
    [Produces("application/json")]
    [Route(GlobalAPI.CATEGORY_ROOT)]
    public class CategoryController : Controller
    {
        public readonly ICategoryApiRepository _repository;
        public CategoryController(ICategoryApiRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Home/5
        [HttpGet(GlobalAPI.GET_LIST)]
        public async Task<JsonResult> GetList(string api_key)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(await _repository.GetList());
            }
            return Json(null);
        }

        [HttpGet(GlobalAPI.GET_SINGLE)]
        public async Task<JsonResult> GetSingle(string api_key, string slug)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(await _repository.GetSingle(slug));
            }
            return Json(null);
        }
    }
}

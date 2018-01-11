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
    [Route(GlobalAPI.SEARCH_ROOT)]
    public class SearchController : Controller
    {
        public readonly ISearchApiRepository _repository;
        public SearchController(ISearchApiRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Home/5
        [HttpGet(GlobalAPI.GET_SEARCH)]
        public async Task<JsonResult> GetSearch(string api_key,string searchString)
        {
            if (api_key == Global.API_KEY)
            {
                int pageSize = Global.PAGE_SIZE_MOBILE;
                return Json(await _repository.GetSearch(searchString, 1, pageSize));
            }
            return null;
        }

    }
}
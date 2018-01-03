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
    [Route("api/Search")]
    public class SearchController : Controller
    {
        public readonly ISearchApiRepository _repository;
        public SearchController(ISearchApiRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Home/5
        [HttpGet("{api_key}&q={searchString}")]
        public async Task<JsonResult> GetSearch(string api_key,string searchString)
        {
            if (api_key == Global.API_KEY)
            {
                int pageSize = 10;
                return Json(await _repository.GetSearch(searchString, 1, pageSize));
            }
            return null;
        }

    }
}
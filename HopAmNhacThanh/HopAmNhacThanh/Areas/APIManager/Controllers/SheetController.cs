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
    [Route("api/Sheet")]
    public class SheetController : Controller
    {
        public readonly ISheetApiRepository _repository;
        public SheetController(ISheetApiRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Home/5
        [HttpGet("{api_key}/{slug}")]
        public JsonResult GetSheet(string api_key, string slug)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(_repository.GetSheet(slug));
            }
            return null;
        }
    }
}
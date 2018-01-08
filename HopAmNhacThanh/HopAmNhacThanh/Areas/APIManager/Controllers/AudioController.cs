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
    [Route("api/Audio")]
    public class AudioController : Controller
    {
        public readonly IAudioApiRepository _repository;
        public AudioController(IAudioApiRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Home/5
        [HttpGet("{api_key}/{slug}")]
        public async Task<JsonResult> GetAudio(string api_key, string slug)
        {
            if (api_key == Global.API_KEY)
            {
                return Json(await _repository.GetAudio(slug));
            }
            return Json(null);
        }
    }
}
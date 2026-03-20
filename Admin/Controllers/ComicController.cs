using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;

namespace Admin.Controllers
{
    public class ComicController : Controller
    {
        protected IBase _ibase;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;
        public ComicController(IBase ibase, IWebHostEnvironment env, IConfiguration config)
        {
            _ibase = ibase;
            _env = env;
            _config = config;
        }
        public IActionResult Index(int idStory)
        {
            return View();
        }
        public IActionResult Detail(int idEpisode)
        {
            return View();
        }
        public JsonResult GetComic(string search, int offset, int limit)
        {
            int total = 0;
            var data = _ibase.comicRespository.GetAll(offset, limit, search, ref total);
            return Json(new { rows = data, total = total });
        }
        public IActionResult CreateOrUpdateEpisode(int idStory, string des, string order)
        {
            return View();
        }
        public IActionResult CreateOrUpdateComic(string search)
        {
            var data = _ibase.comicRespository.SearchStory(search);
            var result = data.Select(x => new
            {
                id = x.Id,
                text = x.Name
            });
            return Ok(result);
        }
    }
}

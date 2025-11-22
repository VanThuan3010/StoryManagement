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
            ViewBag.StoryId = idStory;
            ViewBag.getStory = _ibase.storyRespository.GetDetail(idStory);
            return View();
        }
        public IActionResult Detail(int idEpisode)
        {
            return View();
        }
        public JsonResult GetEpisode(string search, int offset, int limit, int idStory)
        {
            int total = 0;
            var data = _ibase.comicRespository.GetEpisode(offset, limit, search, idStory, ref total);
            return Json(new { rows = data, total = total });
        }
        public IActionResult CreateOrUpdateEpisode(int idStory, string des, string order) {
            return View();
        }
    }
}

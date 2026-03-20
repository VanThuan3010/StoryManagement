using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

namespace Admin.Controllers
{
    public class StorySearchController : Controller
    {
        protected IBase _ibase;
        public StorySearchController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult GetSearch(int offset, int limit, string search)
        {
            int total = 0;
            var data = (List<Story_Search>)_ibase.storySearchRepository.GetAll(offset, limit, search, ref total);
            return Json(new { rows = data, total = total });
        }
        public JsonResult GetDetail(int id)
        {
            int total = 0;
            var data = _ibase.storySearchRepository.GetDetail(id);
            return Json(new { rows = data, total = total });
        }
        [HttpPost]
        public JsonResult Delete(string ids)
        {
            _ibase.storySearchRepository.Delete(ids);
            return Json(new { status = "Success" });
        }
        [HttpPost]
        public JsonResult CreateOrUpdate(Story_Search story_Search)
        {
            int total = 0;
            _ibase.storySearchRepository.CreateOrUpdate(story_Search);
            return Json(new { status = "Success" });
        }
    }
}

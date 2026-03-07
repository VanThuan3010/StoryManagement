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
            var obj = new[]
            {
                new {
                    Limit = limit,
                    Offset = offset,
                    Search = search
                }
            };
            string content = JsonConvert.SerializeObject(obj);
            var data = (List<Story_Search>)_ibase.storySearchRepository.GetAll("Read", content, ref total);
            return Json(new { rows = data, total = total });
        }
        public JsonResult GetDetail(int id)
        {
            int total = 0;
            var obj = new[]
            {
                new {
                    Id = id
                }
            };
            string content = JsonConvert.SerializeObject(obj);
            var data = _ibase.storySearchRepository.GetAll("Edit", content, ref total);
            return Json(new { rows = data, total = total });
        }
        [HttpPost]
        public JsonResult Delete(string content)
        {
            int total = 0;

            _ibase.storySearchRepository.GetAll("Delete", content, ref total);

            return Json(new { status = "Success" });
        }
        [HttpPost]
        public JsonResult CreateOrUpdate(Story_Search story_Search)
        {
            int total = 0;
            var obj = new[]
            {
                new {
                    Id = story_Search.Id,
                    Request = story_Search.Request,
                    Result = story_Search.Result,
                    SearchBy = story_Search.SearchBy
                }
            };
            string content = JsonConvert.SerializeObject(obj);
            _ibase.storySearchRepository.GetAll("CreateOrUpdate", content, ref total);

            return Json(new { status = "Success" });
        }
    }
}

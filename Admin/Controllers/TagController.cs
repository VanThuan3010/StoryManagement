using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Admin.Controllers
{
    public class TagController : Controller
    {
        protected IBase _ibase;
        public TagController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult GetTag(int offset, int limit, string search)
        {
            int total = 0;
            var data = _ibase.tagRespository.GetAll(offset, limit, search, ref total);
            return Json(new { rows = data, total = total });
        }
        [HttpPost]
        public JsonResult CreateOrUpdate(int Id, string Name, string Definition)
        {
            try
            {
                bool Status = false;
                string Mess = "";
                _ibase.groupTagRespository.CreateOrUpdateTag_SubTag(Id, "Tag", Name, Definition, ref Status, ref Mess);
                return new JsonResult(new
                {
                    status = Status,
                    message = Mess
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                });
            }
        }
        public JsonResult GetTagToCRUD(int id, string forType)
        {
            int total = 0;
            var data = _ibase.tagRespository.GetTag(id, forType);
            return Json(new { rows = data, total = total });
        }
        [HttpPost]
        public JsonResult GetStoryTag(int id)
        {
            try
            {
                _ibase.tagRespository.GetStoryTag(id);
                return new JsonResult(new
                {
                    status = true,
                    message = ""
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                });
            }
        }

    }
}

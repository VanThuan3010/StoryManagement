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
        public JsonResult CreateOrUpdate(Tags tags)
        {
            try
            {
                _ibase.tagRespository.CreateOrUpdateTag(tags);
                return new JsonResult(new
                {
                    status = true,
                    message = "Thao tác thành công"
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
        [HttpPost]
        public JsonResult Delete(int id)
        {
            var data = _ibase.tagRespository.Delete(id);
            return new JsonResult(new
            {
                status = true,
                message = "Xóa thành công"
            });
        }
    }
}

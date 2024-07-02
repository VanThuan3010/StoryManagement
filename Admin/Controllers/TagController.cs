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
        public JsonResult Delete(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.tagRespository.Delete(id);
                _ibase.Commit();
                return new JsonResult(new
                {
                    status = true,
                    message = "Xóa thẻ thành công"
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
        public JsonResult CreateOrUpdate(Tags tags)
        {
            try
            {
                var data = _ibase.tagRespository.CreateOrUpdate(tags);
                return new JsonResult(new
                {
                    status = true,
                    message = "Thêm mới thành công"
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

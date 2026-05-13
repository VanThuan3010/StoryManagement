using Microsoft.AspNetCore.Mvc;
using Microsoft.Office.Interop.Excel;
using Newtonsoft.Json;
using StoryManagement.Model;
using StoryManagement.Model.Entity;
using Excel = Microsoft.Office.Interop.Excel;
using Range = Microsoft.Office.Interop.Excel.Range;

namespace Admin.Controllers
{
    public class AuthorController : Controller
    {
        protected IBase _ibase;
        public AuthorController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult GetAuthor(int offset, int limit, string search)
        {
            int total = 0;
            var data = _ibase.authorRespository.GetAll(offset, limit, search, ref total);
            return Json(new { rows = data, total = total });
        }
        public JsonResult GetAuthorDetail(int id)
        {
            var data = _ibase.authorRespository.GetDetail(id);
            return Json(data);
        }
        public JsonResult SearchAuthorForStory(string search, string selected)
        {
            var data = _ibase.authorRespository.SearchAuthorForStory(search, selected);
            return Json(data);
        }
        public JsonResult GetStoryForAuthor(int id)
        {
            var data = _ibase.authorRespository.GetStoryByAuthor(id);
            return Json(data);
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
                _ibase.authorRespository.DeleteAuthor(id);
                return new JsonResult(new
                {
                    status = true,
                    message = "Xóa tác giả thành công"
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
        public JsonResult CreateOrUpdate(Authors authors, string ActionFor, string lstStory = "")
        {
            try
            {
                _ibase.authorRespository.CreateOrUpdate(authors, lstStory, ActionFor);
                return new JsonResult(new
                {
                    status = true,
                    message = "Lưu thành công"
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
        public JsonResult SearchStory(string search, string idSelected)
        {
            var data = _ibase.authorRespository.SearchStory(search, idSelected);
            return Json(data);
        }
    }
}

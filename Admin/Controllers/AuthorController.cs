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
        public IActionResult Literary(int idAuthor)
        {
            ViewBag.ListLiterary = _ibase.storyRespository.GetStoryByAuthor(idAuthor);
            ViewBag.Author = _ibase.authorRespository.GetDetail(idAuthor);
            return View();
        }
        public JsonResult GetAuthor(int offset, int limit, string search)
        {
            int total = 0;
            var data = _ibase.authorRespository.GetAll(offset, limit, search, ref total);
            return Json(new { rows = data, total = total });
        }
        public JsonResult GetStoryReview(int idStory)
        {
            var data = _ibase.reviewRespository.GetStoryReview(idStory) ?? new Reviews { IdStory = idStory };
            return Json(data);
        }
        public JsonResult SearchAuthorForStory(string search, string selected)
        {
            var data = _ibase.authorRespository.SearchAuthorForStory(search, selected);
            return Json(data);
        }
        public JsonResult GetAuthorForStory(int id)
        {
            var data = _ibase.authorRespository.GetStoryAuthor(id);
            return Json(new { rows = data });
        }
        public JsonResult GetStoryForAuthor(int id)
        {
            var data = _ibase.storyRespository.GetStoryByAuthor(id);
            return Json(new { rows = data });
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
        public JsonResult SaveLiterary(int Id, string StoryList)
        {
            try
            {
                if (Id <= 0)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.authorRespository.SaveLiterary(Id, StoryList);
                return new JsonResult(new
                {
                    status = true,
                    message = "Lưu tác phẩm thành công"
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
        public JsonResult CreateOrUpdate(Authors authors)
        {
            try
            {
                _ibase.authorRespository.CreateOrUpdate(authors);
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
    }
}

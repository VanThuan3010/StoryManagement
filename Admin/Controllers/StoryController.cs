using Admin.Models;
using Google.Protobuf;
using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

namespace Admin.Controllers
{
    public class StoryController : Controller
    {
        protected IBase _ibase;
        public StoryController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            var total = 0;
            ViewBag.lstTag = _ibase.tagRespository.GetAll(0,1000, null, ref total);
            //ViewBag.lstAuthor = _ibase.authorRespository.GetAll(0, 1000, null, ref total);
            return View();
        }
        public JsonResult GetStory(string search, int offset, int limit, string tags = "", string authors = "")
        {
            int total = 0;
            var data = _ibase.storyRespository.GetAll(offset, limit, search, tags, authors, ref total);
            return Json(new { rows = data, total = total });
        }
        [HttpPost]
        public JsonResult CreateOrUpdate(Story storyModel)
        {
            try
            {
                if (storyModel == null)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.storyRespository.CreateOrUpdate(storyModel);
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
                    status = true,
                    message = ex.Message,
                });
            }

        }
        [HttpPost]
        public JsonResult Delete(int id)
        {
            try
            {
                if ( id <= 0)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.storyRespository.DeleteStory(id);
                return new JsonResult(new
                {
                    status = true,
                    message = "Xóa truyện thành công"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = true,
                    message = ex.Message,
                });
            }

        }
        [HttpPost]
        public JsonResult CheckRead(int id)
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
                _ibase.storyRespository.ReadChangeStory(id);
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
                    status = true,
                    message = ex.Message,
                });
            }

        }
        public IActionResult Chapter(int idStory)
        {
            return View();
        }
    }
}

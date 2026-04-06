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
            return View();
        }
        public JsonResult GetStory(string search, int offset, int limit, string status)
        {
            int total = 0;
            var data = _ibase.storyRespository.GetAll(offset, limit, search, status, ref total);
            return Json(new { rows = data, total = total });
        }
        public JsonResult SearchTag(string searchString, string listId)
        {
            var data = _ibase.storyRespository.SearchTag(searchString, listId);
            return Json(data);
        }
        public JsonResult SearchSubTag(string searchString, string listId)
        {
            var data = _ibase.storyRespository.SearchSubTag(searchString, listId);
            return Json(data);
        }
        [HttpPost]
        public JsonResult CreateOrUpdate(Story storyModel, string AuthorId)
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
                _ibase.storyRespository.CreateOrUpdate(storyModel, "", "", AuthorId);
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
        public JsonResult CheckRead(int id, long idChapter)
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
                _ibase.storyRespository.ReadChangeStory(id, idChapter);
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
        public JsonResult GetTagSearch(string searchStr, string idSelected, string type)
        {
            if(type == "Tag")
            {
                var data = _ibase.storyRespository.GetTagSearchFilter(searchStr, idSelected);
                return Json(data);
            }
            else if(type == "SubTag")
            {
                var data = _ibase.storyRespository.GetSubTagSearchFilter(searchStr, idSelected);
                return Json(data);
            }
            else
            {
                var data = _ibase.storyRespository.GetAuthorSearchFilter(searchStr, idSelected);
                return Json(data);
            }
        }
        public JsonResult GetStorySearchForAuthor(string search, string selected)
        {
            var data = _ibase.storyRespository.GetStorySearchInAuthor(search, selected);
            return Json(data);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

namespace Admin.Controllers
{
    public class ChapterController : Controller
    {
        protected IBase _ibase;
        public ChapterController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index(int idStory)
        {
            ViewBag.StoryId = idStory;
            ViewBag.getStory = _ibase.storyRespository.GetDetail(idStory);
            return View();
        }
        public JsonResult GetChapter(int offset, int limit, int idStory)
        {
            int total = 0;
            var data = _ibase.chapterRespository.GetAll(offset, limit, idStory, ref total);
            return Json(new { rows = data, total = total });
        }

        public IActionResult CreateOrUpdate(int idStory, long idChapter)
        {
            ViewBag.idStory = idStory;
            ViewBag.idChapter = idChapter;
            ViewBag.PartChapter = _ibase.part_ChapterRespository.GetAll(idStory);
            Chapters chapters = _ibase.chapterRespository.GetDetail(idChapter);
            return View(chapters);
        }

        [HttpPost]
        public IActionResult CreateOrUpdate(Chapters chapters)
        {
            try
            {
                if (chapters == null)
                {
                    return Redirect("/Story/Index");
                }
                _ibase.chapterRespository.CreateOrUpdate(chapters);
                return Redirect("/Chapter/Index?idStory=" + chapters.StoryId);
            }
            catch (Exception ex)
            {
                throw ex;
            }
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
                _ibase.chapterRespository.Delete(id);
                _ibase.Commit();
                return new JsonResult(new
                {
                    status = true,
                    message = "Xóa thành công"
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
        public JsonResult UpdatePosition(string ids)
        {
            try
            {
                if (string.IsNullOrEmpty(ids))
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.chapterRespository.UpdatePosition(ids);
                _ibase.Commit();
                return new JsonResult(new
                {
                    status = true,
                    message = "Cập nhật thành công"
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
        public JsonResult AddPartChapter(int idStory, string name)
        {
            try
            {
                if (idStory <= 0)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.part_ChapterRespository.CreatePart(idStory, name);
                _ibase.Commit();
                return new JsonResult(new
                {
                    status = true,
                    message = "Thêm thành công"
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
    }
}

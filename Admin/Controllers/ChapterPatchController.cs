using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

namespace Admin.Controllers
{
    public class ChapterPatchController : Controller
    {
        protected IBase _ibase;
        public ChapterPatchController(IBase ibase)
        {
            _ibase = ibase;
        }
        public JsonResult GetDetail(int id)
        {
            var data = _ibase.chapterPatchRespository.GetDetail(id);
            return Json(data);
        }
        [HttpDelete]
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
                _ibase.chapterPatchRespository.DeletePatch(id);
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
                    status = false,
                    message = ex.Message,
                });
            }

        }
        [HttpPost]
        public JsonResult CreateOrUpdate(ChapterPatch chapterPatch)
        {
            try
            {
                _ibase.chapterPatchRespository.CreateOrUpdate(chapterPatch);
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
    }
}

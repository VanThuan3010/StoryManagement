using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

namespace Admin.Controllers
{
    public class GroupTagController : Controller
    {
        protected IBase _ibase;
        public GroupTagController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult GetGroupTag(int offset, int limit, string search)
        {
            int total = 0;
            var data = _ibase.groupTagRespository.GetAll(offset, limit, search, ref total);
            return Json(new { rows = data, total = total });
        }
        [HttpPost]
        public JsonResult CreateOrUpdate(GroupTag groupTag, string lstTag, string lstSubTag)
        {
            try
            {
                _ibase.groupTagRespository.CreateOrUpdate(groupTag, lstTag, lstSubTag);
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
                    message = ex.Message
                });
            }
        }
        public JsonResult SearchTag(string searchString, string listId)
        {
            var data = _ibase.groupTagRespository.SearchTag(searchString, listId);
            return Json(data);
        }
        public JsonResult SearchSubTag(string searchString, string listId)
        {
            var data = _ibase.groupTagRespository.SearchSubTag(searchString, listId);
            return Json(data);
        }
        [HttpPost]
        public JsonResult Delete(int id, string type)
        {
            try
            {
                bool Status = false;
                string Mess = "";
                _ibase.groupTagRespository.DeleteTagOrSubTag(id, type, ref Status, ref Mess);
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
    }
}

using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;

namespace Admin.Controllers
{
    public class SubTagController : Controller
    {
        protected IBase _ibase;
        public SubTagController(IBase ibase)
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
            var data = _ibase.sub_TagRespository.GetAll(offset, limit, search, ref total);
            return Json(new { rows = data, total = total });
        }
        public JsonResult GetSubTagToCRUD(int id, string forType)
        {
            int total = 0;
            var data = _ibase.sub_TagRespository.GetSubTag(id, forType);
            return Json(new { rows = data, total = total });
        }
        [HttpPost]
        public JsonResult CreateOrUpdate(int Id, string Name, string Definition)
        {
            try
            {
                bool Status = false;
                string Mess = "";
                _ibase.groupTagRespository.CreateOrUpdateTag_SubTag(Id, "SubTag", Name, Definition, ref Status, ref Mess);
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

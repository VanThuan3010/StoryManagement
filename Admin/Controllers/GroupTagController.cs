using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;

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

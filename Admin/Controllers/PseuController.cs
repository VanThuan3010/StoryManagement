using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;

namespace Admin.Controllers
{
    public class PseuController : Controller
    {
        protected IBase _ibase;
        public PseuController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult GetPseu(int id, string type)
        {
            var data = _ibase.pseuRespository.GetPseu(id, type);
            return Json(data);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;

namespace Admin.Controllers
{
    public class SeriesController : Controller
    {
        protected IBase _ibase;
        public SeriesController(IBase ibase) { _ibase = ibase; }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult GetSeries(string search, int offset, int limit)
        {
            int total = 0;
            var data = _ibase.seriesRespository.GetAll(offset, limit, search, ref total);
            return Json(new { rows = data, total = total });
        }
        public IActionResult CreateOrUpdate()
        {
            return View();
        }
    }
}

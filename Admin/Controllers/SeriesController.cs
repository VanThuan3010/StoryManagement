using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

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
        public JsonResult SearchStory(string search, string idSelected)
        {
            var data = _ibase.seriesRespository.SearchStory(search, idSelected);
            return Json(data);
        }
        public JsonResult GetStory(int Id)
        {
            var data = _ibase.seriesRespository.GetStory(Id);
            return Json(data);
        }
        [HttpPost]
        public JsonResult SaveSeries(Series series, string lstStory)
        {
            try
            {
                _ibase.seriesRespository.SaveSeries(series, lstStory);
                return new JsonResult(new
                {
                    status = true,
                    message = "Lưu thành công",
                });
            }
            catch
            {
                return new JsonResult(new
                {
                    status = false,
                    message = "Có lỗi xảy ra",
                });
            }
        }
    }
}

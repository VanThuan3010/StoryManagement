using Microsoft.AspNetCore.Mvc;

namespace Admin.Controllers
{
    public class SeriesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult CreateOrUpdate()
        {
            return View();
        }
    }
}

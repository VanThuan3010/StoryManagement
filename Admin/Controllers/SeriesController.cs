using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;

namespace Admin.Controllers
{
    public class SeriesController : HomeController
    {
        public SeriesController(ILogger<HomeController> logger, IBase ibase)
        : base(logger, ibase) { }
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

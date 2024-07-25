using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Website.Models;
using StoryManagement.Model;

namespace Website.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        protected IBase _ibase;

        public HomeController(ILogger<HomeController> logger, IBase ibase)
        {
            _logger = logger;
            _ibase = ibase;
        }

        public IActionResult Index()
        {
            int total = 0;
            ViewBag.listStory = _ibase.storyRespository.GetAll(0, int.MaxValue, null , null, null, ref total);
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

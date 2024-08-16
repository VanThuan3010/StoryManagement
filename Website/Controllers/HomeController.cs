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
            ViewBag.listStory = _ibase.storyRespository.GetStoryCanRead();
            ViewBag.listNewest = _ibase.storyRespository.GetStoryNewest();
            ViewBag.listLastUpdate = _ibase.storyRespository.GetStoryLastUpdate();
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

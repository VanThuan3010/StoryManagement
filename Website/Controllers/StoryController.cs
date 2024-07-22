using Microsoft.AspNetCore.Mvc;

namespace Website.Controllers
{
    public class StoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        //[Route("truyen/{slug}")]
        public IActionResult Details(string slug)
        {
            //int id = GetStoryIdBySlug(slug);
            //if (id == 0)
            //{
            //    return NotFound();
            //}

            //var story = GetStoryById(id);
            //return View("Details", story);
            return View();
        }
        public IActionResult Chapter()
        {
            return View();
        }
    }
}

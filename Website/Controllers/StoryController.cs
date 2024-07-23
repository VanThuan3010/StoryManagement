using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

namespace Website.Controllers
{
    public class StoryController : Controller
    {
        protected IBase _ibase;
        public StoryController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            return View();
        }
        //[Route("truyen/{slug}")]
        public IActionResult Details(int idStory)
        {
            Story str = _ibase.storyRespository.GetDetail(idStory);
            ViewBag.listTags = _ibase.tagRespository.GetStoryTag(idStory);
            ViewBag.listAuthors = _ibase.authorRespository.GetStoryAuthor(idStory);
            //int id = GetStoryIdBySlug(slug);
            //if (id == 0)
            //{
            //    return NotFound();
            //}

            //var story = GetStoryById(id);
            //return View("Details", story);
            return View(str);
        }
        public IActionResult Chapter(int idSory)
        {
            int total = 0;
            Chapters chapters = _ibase.chapterRespository.GetAll(0, 1, idSory, ref total).FirstOrDefault();
            return View(chapters);
        }
    }
}

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
            ViewBag.listAuthors = _ibase.authorRespository.GetStoryAuthor(idStory);
            ViewBag.review = _ibase.reviewRespository.GetStoryReview(idStory);
            //int id = GetStoryIdBySlug(slug);
            //if (id == 0)
            //{
            //    return NotFound();
            //}

            //var story = GetStoryById(id);
            //return View("Details", story);
            return View(str);
        }
        public IActionResult Chapter(int idStory, long idChapter)
        {
            long CurrentChaterId = 0;
            long PrevChaterId = 0;
            long NextChaterId = 0;
            string PrevChaterTitle = "";
            string NextChaterTitle = "";
            Chapters chapters = _ibase.chapterRespository.GetChapterToRead(idChapter, idStory, ref CurrentChaterId, ref PrevChaterId, ref PrevChaterTitle, ref NextChaterId, ref NextChaterTitle);
            ViewBag.story = _ibase.storyRespository.GetDetail(idStory);
            ViewBag.PrevChapterId = PrevChaterId;
            ViewBag.NextChapterId = NextChaterId;
            return View(chapters);
        }
        public JsonResult GetChapterStory(int offset, int limit, int idStory)
        {
            int total = 0;
            var data = _ibase.chapterRespository.GetAll(offset, limit, idStory, ref total);
            return Json(new { rows = data, total = total });
        }
    }
}

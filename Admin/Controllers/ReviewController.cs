using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

namespace Admin.Controllers
{
    public class ReviewController : Controller
    {
        protected IBase _ibase;
        public ReviewController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index(int idStory)
        {
            var data = _ibase.reviewRespository.Get(x=> x.IdStory == idStory).FirstOrDefault();
            return View(data);
        }

        [HttpPost]
        public IActionResult CreateOrUpdate(Reviews reviews)
        {
            try
            {
                _ibase.reviewRespository.CreateOrUpdate(reviews);
                return RedirectToAction("Index", "Story");
            }
            catch (Exception ex)
            {
                throw(ex);
            }
        }
    }
}

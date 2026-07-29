using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;

namespace Admin.Controllers
{
    public class TranslateController : Controller
    {
        protected IBase _ibase;
        public TranslateController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}

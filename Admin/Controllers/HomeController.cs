using Admin.Models;
using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using System.Diagnostics;

namespace Admin.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        protected IBase _ibase;
        private readonly IConfiguration _config;
        public HomeController(ILogger<HomeController> logger, IBase ibase, IConfiguration config)
        {
            _logger = logger;
            _ibase = ibase;
            _config = config;
        }

        public IActionResult Index()
        {
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
        [HttpPost]
        public IActionResult DeleteImgUploadNotSave([FromBody] List<string> images)
        {
            try
            {
                if (images == null || !images.Any())
                {
                    return Ok();
                }

                var rootPath = _config["UploadImage:Chapters"];

                foreach (var imageUrl in images)
                {
                    if (string.IsNullOrWhiteSpace(imageUrl))
                        continue;

                    // /chapter-images/abc.jpg => abc.jpg
                    var fileName = Path.GetFileName(imageUrl);

                    if (string.IsNullOrWhiteSpace(fileName))
                        continue;

                    var filePath = Path.Combine(rootPath, fileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }

                    // Xóa luôn file backup json nếu có
                    var backupFile = Path.Combine(
                        rootPath,
                        "Save Base 64",
                        $"{Path.GetFileNameWithoutExtension(fileName)}.json");

                    if (System.IO.File.Exists(backupFile))
                    {
                        System.IO.File.Delete(backupFile);
                    }
                }

                return Ok(new
                {
                    status = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteImgUploadNotSave");

                return BadRequest(new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }
    }
}

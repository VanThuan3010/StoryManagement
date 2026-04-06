using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using StoryManagement.Model;
using StoryManagement.Model.Entity;
using StoryManagement.Model.Implement;
using StoryManagement.Model.Interface;

namespace Admin.Controllers
{
    public class ReviewController : Controller
    {
        protected IBase _ibase;
        private readonly IWebHostEnvironment _env;
        public ReviewController(IBase ibase, IWebHostEnvironment env)
        {
            _env = env;
            _ibase = ibase;
        }
        public IActionResult Index(int idStory)
        {
            ViewBag.getStory = _ibase.storyRespository.GetDetail(idStory);
            var data = _ibase.reviewRespository.GetStoryReview(idStory) ?? new Reviews { Id = 0, IdStory = idStory };
            return View(data);
        }
        [HttpPost]
        public JsonResult GetDetailReview(int id)
        {
            var data = _ibase.reviewRespository.GetStoryReview(id);
            return Json(data);
        }

        [HttpPost]
        public IActionResult CreateOrUpdate(Reviews reviews, string Images, string deleteImage)
        {
            try
            {
                if (reviews == null)
                    return new JsonResult(new { status = false, message = "Có lỗi xảy ra" });
                var imageList = JsonConvert.DeserializeObject<List<string>>(Images);
                if (imageList?.Count > 0)
                {
                    foreach (var img in imageList)
                    {
                        var fileName = Path.GetFileName(img);

                        var relativePath = img.TrimStart('/');
                        var tempPath = Path.Combine(_env.WebRootPath, relativePath);
                        var destFolder = Path.Combine(
                            _env.WebRootPath,
                            "uploads",
                            "review"
                        );

                        if (System.IO.File.Exists(tempPath))
                        {
                            if (!Directory.Exists(destFolder))
                            {
                                Directory.CreateDirectory(destFolder);
                            }
                            var destPath = Path.Combine(destFolder, fileName);
                            System.IO.File.Move(tempPath, destPath);
                        }
                    }
                }

                // replace đường dẫn
                reviews.Review = reviews.Review.Replace("/uploads/temp/", "/uploads/review/");
                reviews.Opening = reviews.Opening.Replace("/uploads/temp/", "/uploads/review/");

                // xóa temp
                var tempFolder = Path.Combine(_env.WebRootPath, "uploads/temp");

                if (Directory.Exists(tempFolder))
                {
                    Directory.Delete(tempFolder, true);
                }
                Directory.CreateDirectory(tempFolder);
                // xóa ảnh không còn so với trước đó
                var deleteImages = string.IsNullOrEmpty(deleteImage) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(deleteImage);
                if (deleteImages?.Count > 0)
                {
                    foreach (var img in deleteImages)
                    {
                        var path = Path.Combine(_env.WebRootPath, img.TrimStart('/'));

                        if (System.IO.File.Exists(path))
                        {
                            System.IO.File.Delete(path);
                        }
                    }
                }
                _ibase.reviewRespository.CreateOrUpdate(reviews);
                return RedirectToAction("Index", "Story");
            }
            catch (Exception ex)
            {
                throw(ex);
            }
        }
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile upload)
        {
            if (upload == null || upload.Length == 0)
                return Json(new { uploaded = 0, error = new { message = "No file" } });

            var fileName = Guid.NewGuid() + Path.GetExtension(upload.FileName);
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(),
                                  "wwwroot",
                                  "uploads",
                                  "temp");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var filePath = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await upload.CopyToAsync(stream);
            }
            var fileUrl = $"/uploads/temp/{fileName}";
            return Json(new
            {
                uploaded = 1,
                fileName = fileName,
                url = fileUrl
            });
        }
    }
}

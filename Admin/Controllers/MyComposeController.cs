using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

namespace Admin.Controllers
{
    public class MyComposeController : Controller
    {
        protected IBase _ibase;
        public MyComposeController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult GetInfor()
        {
            var data = _ibase.my_ComposeRepository.GetAll(0, "Read", "", "", 0);
            var treeData = data.Select(x => new
            {
                id = x.Id.ToString(),
                parent = x.ParentId == 0 ? "#" : x.ParentId.ToString(),
                text = x.Name,
                type = x.Level == 1 ? "root" : "child",
                level = x.Level
            }).ToList();

            return Json(treeData);
        }
        public JsonResult SearchParent(string keyword)
        {
            var data = _ibase.my_ComposeRepository.GetAll(0, "Read", "", "", 0);
            var treeData = data.Select(x => new
            {
                id = x.Id.ToString(),
                parent = x.ParentId == 0 ? "#" : x.ParentId.ToString(),
                text = x.Name,
                type = x.Level == 1 ? "root" : "child",
                level = x.Level
            }).ToList();

            return Json(treeData);
        }
        public JsonResult GetDetail(int Id)
        {
            var data = _ibase.my_ComposeRepository.GetAll(Id, "GetData", "", "", 0);
            return Json(data);
        }
        public JsonResult CreateOrUpdate(int Id, string Act, string Name, string Content, int ParentId, List<string> deletedImages)
        {
            int total = 0;
            var data = _ibase.my_ComposeRepository.GetAll(Id, Act, Name, Content, ParentId);
            if (deletedImages?.Count > 0 && Act == "Update")
            {
                foreach (var img in deletedImages)
                {
                    var path = Path.Combine("wwwroot", img.TrimStart('/'));
                    if (System.IO.File.Exists(path))
                    {
                        System.IO.File.Delete(path);
                    }
                }
            }
            return Json(new { rows = data, total = total });
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
                                  "compose",
                                  "Images");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var filePath = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await upload.CopyToAsync(stream);
            }
            var fileUrl = $"/uploads/compose/Images/{fileName}";
            return Json(new
            {
                uploaded = 1,
                fileName = fileName,
                url = fileUrl
            });
        }
        [HttpPost]
        public async Task<IActionResult> UploadVideo(IFormFile upload, string oldVideo)
        {
            if (upload == null || upload.Length == 0)
                return Json(new { uploaded = 0, error = new { message = "No file" } });
            if (!string.IsNullOrEmpty(oldVideo))
            {
                var oldPath = Path.Combine("wwwroot", oldVideo.TrimStart('/'));
                if (System.IO.File.Exists(oldPath))
                {
                    System.IO.File.Delete(oldPath);
                }
            }

            var fileName = Guid.NewGuid() + Path.GetExtension(upload.FileName);
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(),
                                  "wwwroot",
                                  "uploads",
                                  "compose",
                                  "Vides");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var filePath = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await upload.CopyToAsync(stream);
            }
            var fileUrl = $"/uploads/compose/Vides/{fileName}";
            return Json(new
            {
                uploaded = 1,
                fileName = fileName,
                path = fileUrl
            });
        }
    }
}

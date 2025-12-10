using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;

namespace Admin.Controllers
{
    public class ComicController : Controller
    {
        protected IBase _ibase;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;
        public ComicController(IBase ibase, IWebHostEnvironment env, IConfiguration config)
        {
            _ibase = ibase;
            _env = env;
            _config = config;
        }
        public IActionResult Index(int idStory)
        {
            ViewBag.StoryId = idStory;
            ViewBag.getStory = _ibase.storyRespository.GetDetail(idStory);
            return View();
        }
        public IActionResult Detail(int idEpisode)
        {
            return View();
        }
        public IActionResult CreateOrUpdateComic(int id, int idStory)
        {
            ViewBag.Id = id;
            ViewBag.IdStory = idStory;
            return View();
        }
        [HttpPost]
        public JsonResult CRUDComic(long Id, int IdChapter = 0, string Img = "", int order = 0, int IdStory = 0, string Type = "")
        {
            string imgOld = "";
            if(Type == "Insert" || Type == "Press")
            {
                string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
                string baseFolder = @"D:\ComicSave";
                string savePath = Path.Combine(baseFolder, IdStory.ToString(), IdChapter.ToString(), timestamp);
                Directory.CreateDirectory(Path.GetDirectoryName(savePath));
                string base64 = Img.Contains(",") ? Img.Split(',')[1] : Img;
                byte[] imageBytes = Convert.FromBase64String(base64);
                string extension = ".jpg";
                if (Img.Contains("png")) extension = ".png";
                string fullFilePath = savePath + extension;
                System.IO.File.WriteAllBytes(fullFilePath, imageBytes);
                _ibase.comicRespository.CRUDComicImage(
                    IdChapter,
                    timestamp,
                    imageBytes,
                    fullFilePath,
                    order,
                    Type,
                    ref imgOld
                );
                if (Type == "Press" && !string.IsNullOrEmpty(imgOld))
                {
                    try
                    {
                        if (System.IO.File.Exists(imgOld))
                        {
                            System.IO.File.Delete(imgOld);
                        }
                    }
                    catch
                    {
                        // Có thể log lỗi lại nếu cần, tránh crash API
                    }
                }
            }
            return Json(new { rows = true });
        }
        public JsonResult GetEpisode(string search, int offset, int limit, int idStory)
        {
            int total = 0;
            var data = _ibase.comicRespository.GetEpisode(offset, limit, search, idStory, ref total);
            return Json(new { rows = data, total = total });
        }
        [HttpPost]
        public JsonResult CreateOrUpdateEpisode(Story_Comic story_Comic) {
            try
            {
                if (story_Comic == null)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.comicRespository.CreateOrUpdate(story_Comic);
                return new JsonResult(new
                {
                    status = true,
                    message = "Thao tác thành công"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = true,
                    message = ex.Message,
                });
            }
        }
        [HttpPost]
        public JsonResult DeleteEpisode(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                int IdStory = 0;
                _ibase.comicRespository.DeleteEpisode(id, ref IdStory);
                string baseFolder = @"D:\ComicSave";
                string targetFolder = Path.Combine(baseFolder, IdStory.ToString(), id.ToString());

                if (Directory.Exists(targetFolder))
                {
                    Directory.Delete(targetFolder, true); // true = xóa toàn bộ file và subfolder
                }
                return new JsonResult(new
                {
                    status = true,
                    message = "Xóa episode thành công"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = true,
                    message = ex.Message,
                });
            }

        }
        [HttpGet]
        public JsonResult GetComicImages(int IdChapter)
        {
            int total = 0;
            var list = _ibase.comicRespository.GetListImages(IdChapter, ref total);

            // Trả về dạng src (đường dẫn file)
            return Json(new { list = list, total = total });
        }
        public IActionResult GetImage(string path)
        {
            if (!System.IO.File.Exists(path))
                return NotFound();

            var bytes = System.IO.File.ReadAllBytes(path);

            string ext = Path.GetExtension(path).ToLower();
            string contentType = ext == ".png" ? "image/png" : "image/jpeg";

            return File(bytes, contentType);
        }
        [HttpPost]
        public JsonResult DeleteComicImage(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "ID không hợp lệ"
                    });
                }

                string imgPath = "";
                _ibase.comicRespository.CRUDComicImage(
                    id,
                    "",
                    Array.Empty<byte>(),
                    "",
                    0,
                    "Delete",
                    ref imgPath
                );

                // Xóa file vật lý
                if (!string.IsNullOrEmpty(imgPath) && System.IO.File.Exists(imgPath))
                {
                    System.IO.File.Delete(imgPath);
                }

                return new JsonResult(new
                {
                    status = true,
                    message = "Xóa ảnh thành công"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json;
using StoryManagement.Model;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace Admin.Controllers
{
    public class ChapterController : Controller
    {
        protected IBase _ibase;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;
        public ChapterController(IBase ibase, IWebHostEnvironment env, IConfiguration config)
        {
            _ibase = ibase;
            _env = env;
            _config = config;
        }
        public IActionResult Index(int idStory)
        {
            var ChapterCount = 0;
            ViewBag.StoryId = idStory;
            ViewBag.getStory = _ibase.storyRespository.GetDetail(idStory);
            ViewBag.PartChapter = _ibase.part_ChapterRespository.GetAll(idStory, ref ChapterCount);
            ViewBag.ChapterCount = ChapterCount;
            return View();
        }
        public JsonResult GetChapter(int offset, int limit, int idStory)
        {
            int total = 0;
            var data = _ibase.chapterRespository.GetAll(offset, limit, idStory, ref total);
            return Json(new { rows = data, total = total });
        }
        [HttpPost]
        public JsonResult GetDetailChapter(int idChapter)
        {
            var data = _ibase.chapterRespository.GetDetail(idChapter);
            return Json(new { rows = data });
        }
        public IActionResult CreateOrUpdate(int idStory, long idChapter)
        {
            var ChapterCount = 0;
            ViewBag.idStory = idStory;
            ViewBag.idChapter = idChapter;
            ViewBag.PartChapter = _ibase.part_ChapterRespository.GetAll(idStory, ref ChapterCount);
            ViewBag.chapters = _ibase.chapterRespository.GetDetail(idChapter);
            ViewBag.ChapterCount = ChapterCount;
            return View();
        }

        [HttpPost]
        public JsonResult CreateOrUpdate(Chapters chapters, int OrderTo, string Images, string deleteImage)
        {
            try
            {
                if (chapters == null)
                    return new JsonResult(new { status = false, message = "Có lỗi xảy ra" });
                var imageList = JsonConvert.DeserializeObject<List<string>>(Images);
                if(imageList?.Count > 0)
                {
                    foreach (var img in imageList)
                    {
                        var fileName = Path.GetFileName(img);

                        var relativePath = img.TrimStart('/');
                        var tempPath = Path.Combine(_env.WebRootPath, relativePath);
                        var destFolder = Path.Combine(
                            _env.WebRootPath,
                            "uploads",
                            "chapter",
                            chapters.StoryId.ToString()
                        );
                        //var destPath = Path.Combine(_env.WebRootPath, "uploads/chapter", chapters.StoryId.ToString(), fileName);

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

                // replace đường dẫn trong content
                chapters.Content = chapters.Content.Replace("/uploads/temp/", "/uploads/chapter/");

                // xóa temp
                var tempFolder = Path.Combine(_env.WebRootPath, "uploads/temp");

                if (Directory.Exists(tempFolder))
                {
                    Directory.Delete(tempFolder, true);
                }
                Directory.CreateDirectory(tempFolder);
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
                int NumberChapter = 0;
                _ibase.chapterRespository.CreateOrUpdate(chapters, OrderTo, ref NumberChapter);
                return new JsonResult(new
                {
                    status = true,
                    message = "Thao tác thành công",
                    numberChapter = NumberChapter
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { status = false, message = "Lỗi server: " + ex.Message });
            }
        }

        // --- Helpers ---
        private string GetFileNameFromSrc(string src, string requestPath)
        {
            if (string.IsNullOrWhiteSpace(src)) return null;

            // 1) loại bỏ query & fragment
            string clean = src.Split(new[] { '?', '#' }, 2)[0];

            // 2) nếu là requestPath (ví dụ /StoryImages/...)
            if (!string.IsNullOrEmpty(requestPath) &&
                clean.IndexOf(requestPath, StringComparison.OrdinalIgnoreCase) >= 0)
            {
                int idx = clean.IndexOf(requestPath, StringComparison.OrdinalIgnoreCase);
                string after = clean.Substring(idx + requestPath.Length).TrimStart('/', '\\');
                return Path.GetFileName(after);
            }

            // 3) nếu là URL tuyệt đối => lấy LocalPath
            if (Uri.TryCreate(clean, UriKind.Absolute, out var uri))
            {
                return Path.GetFileName(uri.LocalPath);
            }

            // 4) còn lại coi như path local
            return Path.GetFileName(clean);
        }

        private string MakeSafeFileName(string name)
        {
            if (string.IsNullOrEmpty(name)) return name;
            // thay tất cả ký tự không hợp lệ bằng dấu gạch dưới
            return Regex.Replace(name, @"[<>:""/\\|?*]", "_");
        }
        [HttpPost]
        public JsonResult SearchByOrder(int Id, int Order)
        {
            try
            {
                if (Id < 0)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                Chapters chapter = _ibase.chapterRespository.SearchByOrder(Id, Order);
                return new JsonResult(new
                {
                    status = true,
                    title = chapter == null ? "" : chapter.Title,
                    belong = chapter == null ? 1 : chapter.Belong
                });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public JsonResult Delete(int id, string images)
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
                var deleteImages = string.IsNullOrEmpty(images) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(images);
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
                _ibase.chapterRespository.DeleteChapter(id);
                return new JsonResult(new
                {
                    status = true,
                    message = "Xóa thành công"
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                });
            }

        }
        [HttpPost]
        public JsonResult UpdatePosition(string ids)
        {
            try
            {
                if (string.IsNullOrEmpty(ids))
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.chapterRespository.UpdatePosition(ids);
                _ibase.Commit();
                return new JsonResult(new
                {
                    status = true,
                    message = "Cập nhật thành công"
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
        public JsonResult CreateOrUpdatePartChapter(int idStory, int idPart, string name)
        {
            try
            {
                int newId = 0;
                string newName = "";
                _ibase.part_ChapterRespository.CreateOrUpdatePart(idStory, idPart, name, ref newId, ref newName);
                return new JsonResult(new
                {
                    status = true,
                    message = "Thêm thành công",
                    newId = newId,
                    newName = newName
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
        //[HttpPost]
        //public JsonResult AddByText(int id)
        //{
        //    try
        //    {
        //        if (id <= 0)
        //        {
        //            return new JsonResult(new
        //            {
        //                status = false,
        //                message = "Có lỗi xảy ra"
        //            });
        //        }
        //        int po = 0;
        //        int newId = 1;
        //        string newName = "";
        //        string pattern = @"^(chương|tự chương)\s\d+";
        //        bool skipOpening = false;
        //        string chapterTitle = "Giới thiệu";
        //        StringBuilder chapterContent = new StringBuilder();
        //        string Part = "";

        //        foreach (string line in File.ReadLines(@"D:\Code\CSharp\story.txt"))
        //        {
        //            if (line.Trim().StartsWith("Phần truyện: "))
        //            {
        //                Part = line.Trim().Replace("Phần truyện:", "").Trim();
        //                _ibase.part_ChapterRespository.CreatePart(id, Part, ref newId, ref newName);
        //                continue;
        //            }
        //            else
        //            {
        //                if (Regex.IsMatch(line.Trim().ToLower(), pattern))
        //                {
        //                    if (chapterContent.Length > 0)
        //                    {
        //                        if (skipOpening)
        //                        {
        //                            _ibase.chapterRespository.CreateOrUpdate(new Chapters()
        //                            {
        //                                Id = 0,
        //                                StoryId = id,
        //                                Title = chapterTitle,
        //                                Content = ConvertToHtml(chapterContent.ToString()),
        //                                Belong = newId
        //                            });
        //                        }
        //                        else
        //                        {
        //                            skipOpening = true;
        //                        }
        //                        chapterContent.Clear();
        //                    }
        //                    chapterTitle = line.Trim();
        //                }
        //                else
        //                {
        //                    chapterContent.AppendLine(line);
        //                }
        //            }
        //        }
        //        if (chapterContent.Length > 0)
        //        {
        //            _ibase.chapterRespository.CreateOrUpdate(new Chapters()
        //            {
        //                Id = 0,
        //                StoryId = id,
        //                Title = chapterTitle,
        //                Content = ConvertToHtml(chapterContent.ToString()),
        //                Belong = newId
        //            });
        //        }
        //        return new JsonResult(new
        //        {
        //            status = true,
        //            message = "Thêm thành công"
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return new JsonResult(new
        //        {
        //            status = true,
        //            message = ex.Message,
        //        });
        //    }

        //}
        public string ConvertToHtml(string text)
        {
            text = "<p>" + text.Replace(Environment.NewLine + Environment.NewLine, "</p><p>&nbsp;&nbsp;&nbsp;&nbsp;");

            text = text.Replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
            text = text.Replace("    ", "&nbsp;&nbsp;&nbsp;&nbsp;");
            text = text.Replace(Environment.NewLine, "<br>");
            text += "</p>";

            return text;
        }
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile upload, int storyId)
        {
            if (upload == null || upload.Length == 0)
                return Json(new { uploaded = 0, error = new { message = "No file" } });

            var fileName = Guid.NewGuid() + Path.GetExtension(upload.FileName);
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(),
                                  "wwwroot",
                                  "uploads",
                                  "temp",
                                  storyId.ToString());
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var filePath = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await upload.CopyToAsync(stream);
            }
            var fileUrl = $"/uploads/temp/{storyId}/{fileName}";
            return Json(new
            {
                uploaded = 1,
                fileName = fileName,
                url = fileUrl
            });
        }
        [HttpPost]
        public async Task<JsonResult> UploadTxt(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Json(new { status = false, message = "File không hợp lệ" });

            string text;
            using (var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8))
            {
                text = await reader.ReadToEndAsync();
            }

            var regex = new Regex(
                @"(?<title>Chương\s+\d+\s*:\s*.+?)\r?\n(?<content>.*?)(?=(\r?\nChương\s+\d+\s*:)|$)",
                RegexOptions.Singleline
            );

            var matches = regex.Matches(text);
            var chapters = new List<ImportChapterDto>();

            for (int i = 0; i < matches.Count; i++)
            {
                chapters.Add(new ImportChapterDto
                {
                    IndexChapter = i,
                    ChapterTitle = matches[i].Groups["title"].Value.Trim(),
                    Content = ConvertToHtml(matches[i].Groups["content"].Value.Trim()),
                    IsLastChapter = i == matches.Count - 1 ? 1 : 0
                });
            }

            var path = Path.Combine(_env.ContentRootPath, "App_Data", "TempImport.json");
            System.IO.File.WriteAllText(path, System.Text.Json.JsonSerializer.Serialize(chapters));

            return Json(new { status = true, total = chapters.Count });
        }
        [HttpGet]
        public JsonResult GetImportChapter(int index)
        {
            var path = Path.Combine(_env.ContentRootPath, "App_Data", "TempImport.json");
            if (!System.IO.File.Exists(path))
                return Json(new { status = false });

            var chapters = System.Text.Json.JsonSerializer
                .Deserialize<List<ImportChapterDto>>(System.IO.File.ReadAllText(path));

            if (index < 0 || index >= chapters.Count)
                return Json(new { status = false });

            return Json(new { status = true, data = chapters[index] });
        }
        [HttpPost]
        public IActionResult DeleteTempImages()
        {
            var folder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "uploads",
                "temp"
            );

            if (Directory.Exists(folder))
            {
                Directory.Delete(folder, true);
                Directory.CreateDirectory(folder);
            }

            return Ok();
        }
    }
}

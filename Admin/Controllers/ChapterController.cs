using Microsoft.AspNetCore.Mvc;
using StoryManagement.Model;
using StoryManagement.Model.Entity;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Text;
using System;

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
            ViewBag.StoryId = idStory;
            ViewBag.getStory = _ibase.storyRespository.GetDetail(idStory);
            return View();
        }
        public JsonResult GetChapter(int offset, int limit, int idStory)
        {
            int total = 0;
            var data = _ibase.chapterRespository.GetAll(offset, limit, idStory, ref total);
            return Json(new { rows = data, total = total });
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
        public JsonResult CreateOrUpdate(Chapters chapters, int OrderTo)
        {
            try
            {
                if (chapters == null)
                    return new JsonResult(new { status = false, message = "Có lỗi xảy ra" });

                string basePath = _config["SaveImage:Chapter"];                // D:\StoryImages
                string requestPath = _config["SaveImage:ChapterRequestPath"] ?? "/StoryImages";

                string uploadFolder = Path.Combine(basePath, chapters.StoryId.ToString());
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                // Nếu đang sửa (Id > 0) => xóa ảnh cũ
                if (chapters.Id > 0)
                {
                    var oldChapter = _ibase.chapterRespository.GetDetail(chapters.Id);
                    if (oldChapter != null && !string.IsNullOrEmpty(oldChapter.Content))
                    {
                        var oldMatches = Regex.Matches(oldChapter.Content, "<img[^>]+src=\"([^\"]+)\"");
                        foreach (Match m in oldMatches)
                        {
                            string oldSrc = m.Groups[1].Value;
                            // Chỉ xử lý những ảnh thuộc hệ thống của bạn (hoặc local path)
                            if (oldSrc.Contains(requestPath, StringComparison.OrdinalIgnoreCase) ||
                                oldSrc.StartsWith(basePath, StringComparison.OrdinalIgnoreCase) ||
                                !oldSrc.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                            {
                                string fileName = GetFileNameFromSrc(oldSrc, requestPath);
                                if (!string.IsNullOrEmpty(fileName))
                                {
                                    fileName = MakeSafeFileName(fileName);
                                    string filePath = Path.Combine(uploadFolder, fileName);
                                    try
                                    {
                                        if (System.IO.File.Exists(filePath))
                                            System.IO.File.Delete(filePath);
                                    }
                                    catch (Exception ex)
                                    {
                                        // log ex nếu bạn có logger, đừng throw tiếp để mất thông tin gốc
                                        Console.WriteLine("Delete file error: " + ex.Message);
                                    }
                                }
                            }
                        }
                    }
                }

                // Xử lý ảnh mới trong nội dung
                string html = chapters.Content;
                var matches = Regex.Matches(html, "<img[^>]+src=\"([^\"]+)\"");

                foreach (Match match in matches)
                {
                    string src = match.Groups[1].Value;

                    if (src.StartsWith("data:image"))
                    {
                        var mimeMatch = Regex.Match(src, @"data:image/(?<type>.+?);base64,(?<data>.+)");
                        if (!mimeMatch.Success) continue;

                        string fileType = mimeMatch.Groups["type"].Value;
                        string base64Data = mimeMatch.Groups["data"].Value;
                        byte[] bytes = Convert.FromBase64String(base64Data);

                        string fileName = $"image_{Guid.NewGuid()}_{DateTime.Now:yyyyMMdd_HHmmss_fff}.{fileType}";
                        fileName = MakeSafeFileName(fileName);

                        string filePath = Path.Combine(uploadFolder, fileName);
                        System.IO.File.WriteAllBytes(filePath, bytes);

                        string newSrc = $"{requestPath}/{chapters.StoryId}/{fileName}".Replace("\\", "/");
                        html = html.Replace(src, newSrc);
                    }
                    else if (src.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                    {
                        using (var client = new HttpClient())
                        {
                            byte[] data = client.GetByteArrayAsync(src).Result;

                            // Lấy tên file an toàn từ URL (loại bỏ query)
                            string rawName = GetFileNameFromSrc(src, requestPath);
                            string ext = Path.GetExtension(rawName);
                            if (string.IsNullOrEmpty(ext)) ext = ".jpg";

                            string fileName = Path.GetFileNameWithoutExtension(rawName);
                            if (string.IsNullOrEmpty(fileName)) fileName = "image";
                            fileName = $"{fileName}_{Guid.NewGuid()}_{DateTime.Now:yyyyMMdd_HHmmss_fff}{ext}";
                            fileName = MakeSafeFileName(fileName);

                            string filePath = Path.Combine(uploadFolder, fileName);
                            System.IO.File.WriteAllBytes(filePath, data);

                            string newSrc = $"{requestPath}/{chapters.StoryId}/{fileName}".Replace("\\", "/");
                            html = html.Replace(src, newSrc);
                        }
                    }
                }

                chapters.Content = html;
                _ibase.chapterRespository.CreateOrUpdate(chapters, OrderTo);

                return new JsonResult(new
                {
                    status = true,
                    message = "/Chapter/Index?idStory=" + chapters.StoryId
                });
            }
            catch (Exception ex)
            {
                // Trả về JSON lỗi để client biết, đừng throw ex để mất ngữ cảnh debug
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
        public JsonResult Delete(int id)
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
                Chapters chapters = _ibase.chapterRespository.GetDetail(id);
                string basePath = _config["SaveImage:Chapter"];
                string requestPath = _config["SaveImage:ChapterRequestPath"];
                string uploadFolder = Path.Combine(basePath, chapters.StoryId.ToString());
                if (chapters != null && !string.IsNullOrEmpty(chapters.Content))
                {
                    var oldMatches = Regex.Matches(chapters.Content, "<img[^>]+src=\"([^\"]+)\"");

                    foreach (Match m in oldMatches)
                    {
                        string oldSrc = m.Groups[1].Value;
                        if (oldSrc.Contains(requestPath))
                        {
                            string fileName = Path.GetFileName(oldSrc);
                            string filePath = Path.Combine(uploadFolder, fileName);
                            if (System.IO.File.Exists(filePath))
                                System.IO.File.Delete(filePath);
                        }
                    }
                }
                _ibase.chapterRespository.DeleteChapter(id);
                _ibase.Commit();
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
            text = "<p>" + text.Replace(Environment.NewLine + Environment.NewLine, "</p><p>");

            text = text.Replace("\t", "<span style='display:inline-block; width: 40px;'></span>");
            text = text.Replace("    ", "<span style='display:inline-block; width: 40px;'></span>");

            text = text.Replace(Environment.NewLine, "<br>");

            text += "</p>";

            return text;
        }
    }
}

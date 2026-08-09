using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Office.Interop.Excel;
using Newtonsoft.Json;
using StoryManagement.Model;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using JsonSerializer = System.Text.Json.JsonSerializer;

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
        public IActionResult UploadByTxt(int idStory)
        {
            ViewBag.StoryId = idStory;
            return View();
        }
        public IActionResult VersionPatch(long idChapter)
        {
            ViewBag.chapters = _ibase.chapterRespository.GetDetail(idChapter);
            ViewBag.chapterPatch = _ibase.chapterPatchRespository.GetAll(idChapter);
            return View();
        }
        public JsonResult GetPartChapter(int idStory)
        {
            try
            {
                var ChapterCount = 0;
                List<Part_Chapter> result = _ibase.part_ChapterRespository.GetAll(idStory, ref ChapterCount);
                return Json(new { status = true, data = result, chapterCount = ChapterCount });
            } catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
        public JsonResult GetChapter(int offset, int limit, int idStory, string search = "")
        {
            int total = 0;
            var data = _ibase.chapterRespository.GetAll(offset, limit, idStory, search, ref total);
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
            ViewBag.idStory = idStory;
            ViewBag.idChapter = idChapter;
            ViewBag.chapters = _ibase.chapterRespository.GetDetail(idChapter);
            return View();
        }

        [HttpPost]
        public JsonResult CreateOrUpdate(Chapters chapters, int OrderTo, string deleteImage)
        {
            try
            {
                if (chapters == null)
                    return new JsonResult(new { status = false, message = "Có lỗi xảy ra" });
                var deleteImages = string.IsNullOrEmpty(deleteImage) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(deleteImage);
                var rootPath = _config["UploadImage:Chapters"];
                if (deleteImages?.Count > 0)
                {
                    foreach (var img in deleteImages)
                    {
                        var path = Path.Combine(rootPath, img);

                        if (System.IO.File.Exists(path))
                        {
                            System.IO.File.Delete(path);
                        }
                        path = Path.Combine(rootPath, "Save Base 64", $"{Path.GetFileNameWithoutExtension(img)}.json");
                        if (System.IO.File.Exists(path))
                        {
                            System.IO.File.Delete(path);
                        }
                    }
                }
                int NumberChapter = 0;
                //_ibase.chapterRespository.CreateOrUpdate(chapters, OrderTo, ref NumberChapter);
                return new JsonResult(new
                {
                    status = true,
                    message = "Thao tác thành công",
                    numberChapter = NumberChapter,
                    belong = chapters.Belong
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { status = false, message = "Lỗi server: " + ex.Message });
            }
        }
        [HttpPost]
        public JsonResult CreateOrUpdate2(Chapters chapters, int OrderTo, bool InsertOrExchange)
        {
            try
            {
                if (chapters == null)
                    return new JsonResult(new { status = false, message = "Có lỗi xảy ra" });
                int NumberChapter = 0;
                _ibase.chapterRespository.CreateOrUpdate(chapters, OrderTo, InsertOrExchange, ref NumberChapter);
                if(NumberChapter == 0)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Thao tác thất bại, hãy kiểm tra lại"
                    });
                }
                return new JsonResult(new
                {
                    status = true,
                    message = "Thao tác thành công",
                    numberChapter = NumberChapter,
                    belong = chapters.Belong
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { status = false, message = "Lỗi server: " + ex.Message });
            }
        }
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
                var rootPath = _config["UploadImage:Chapters"];
                if (deleteImages?.Count > 0)
                {
                    foreach (var img in deleteImages)
                    {
                        var path = Path.Combine(rootPath, img);

                        if (System.IO.File.Exists(path))
                        {
                            System.IO.File.Delete(path);
                        }
                        path = Path.Combine(rootPath, "Save Base 64", $"{Path.GetFileNameWithoutExtension(img)}.json");
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
        public JsonResult ResetPosition(string idStory)
        {
            try
            {
                if (string.IsNullOrEmpty(idStory))
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.chapterRespository.ResetPosition(idStory);
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
            {
                return Json(new
                {
                    uploaded = 0,
                    error = new
                    {
                        message = "No file"
                    }
                });
            }

            try
            {
                var rootPath = _config["UploadImage:Chapters"];

                if (string.IsNullOrWhiteSpace(rootPath))
                {
                    return Json(new
                    {
                        uploaded = 0,
                        error = new
                        {
                            message = "UploadImage:Chapters not found in appsettings.json"
                        }
                    });
                }

                // Tên file ảnh
                var fileName = Guid.NewGuid() + Path.GetExtension(upload.FileName);

                var filePath = Path.Combine(rootPath, fileName);

                // Lưu ảnh
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await upload.CopyToAsync(stream);
                }

                // ==========================
                // Backup Base64
                // ==========================

                var backupFolder = Path.Combine(rootPath, "Save Base 64");
                Directory.CreateDirectory(backupFolder);

                byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(filePath);

                string base64 = Convert.ToBase64String(imageBytes);

                var backupFile = Path.Combine(
                    backupFolder,
                    $"{Path.GetFileNameWithoutExtension(fileName)}.json");

                var backupData = new
                {
                    FileName = fileName,
                    StoryId = storyId,
                    Base64 = base64,
                    CreatedDate = DateTime.Now
                };

                await System.IO.File.WriteAllTextAsync(
                    backupFile,
                    JsonSerializer.Serialize(
                        backupData,
                        new JsonSerializerOptions
                        {
                            WriteIndented = true
                        }));

                // URL trả về cho CKEditor
                var fileUrl = $"/chapter-images/{fileName}";

                return Json(new
                {
                    uploaded = 1,
                    fileName,
                    url = fileUrl
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    uploaded = 0,
                    error = new
                    {
                        message = ex.Message
                    }
                });
            }
        }
        [HttpPost]
        public async Task<JsonResult> UploadTxt(IFormFile? file, IFormFile? fileRaw)
        {
            if ((file == null || file.Length == 0) &&
                (fileRaw == null || fileRaw.Length == 0))
            {
                return Json(new
                {
                    status = false,
                    message = "Ít nhất phải chọn một file."
                });
            }

            try
            {
                var normalPath = Path.Combine(
                    _env.ContentRootPath,
                    "App_Data",
                    "TempImport.json");

                var rawPath = Path.Combine(
                    _env.ContentRootPath,
                    "App_Data",
                    "TempImportRaw.json");

                int totalNormal = await SaveImportJson(
                    file,
                    normalPath,
                    IsChapterTitle);

                int totalRaw = await SaveImportJson(
                    fileRaw,
                    rawPath,
                    IsRawChapterTitle);

                return Json(new
                {
                    status = true,
                    total = Math.Max(totalNormal, totalRaw)
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }
        private async Task<int> SaveImportJson(IFormFile? file, string jsonPath, Func<string, bool> isChapterTitle)
        {
            await using var jsonStream = new FileStream(
                jsonPath,
                FileMode.Create,
                FileAccess.Write,
                FileShare.None);

            await using var jsonWriter = new Utf8JsonWriter(
                jsonStream,
                new JsonWriterOptions
                {
                    Indented = false
                });

            jsonWriter.WriteStartArray();

            // Không có file -> tạo file []
            if (file == null || file.Length == 0)
            {
                jsonWriter.WriteEndArray();
                await jsonWriter.FlushAsync();
                return 0;
            }

            await using var txtStream = file.OpenReadStream();

            using var reader = new StreamReader(
                txtStream,
                Encoding.UTF8);

            int indexChapter = 1;
            int totalChapter = 0;

            string? currentTitle = null;
            var currentContent = new StringBuilder();

            string? line;

            while ((line = await reader.ReadLineAsync()) != null)
            {
                var trimLine = line.Trim();

                if (isChapterTitle(trimLine))
                {
                    if (!string.IsNullOrEmpty(currentTitle))
                    {
                        var chapter = new ImportChapterDto
                        {
                            IndexChapter = indexChapter,
                            ChapterTitle = currentTitle,
                            Content = currentContent.ToString().Trim(),
                            IsLastChapter = 0
                        };

                        JsonSerializer.Serialize(jsonWriter, chapter);

                        indexChapter++;
                        totalChapter++;

                        currentContent.Clear();
                    }

                    currentTitle = trimLine;
                }
                else
                {
                    if (!string.IsNullOrEmpty(currentTitle))
                    {
                        currentContent.AppendLine(line);
                    }
                }
            }

            // ghi chương cuối
            if (!string.IsNullOrEmpty(currentTitle))
            {
                var chapter = new ImportChapterDto
                {
                    IndexChapter = indexChapter,
                    ChapterTitle = currentTitle,
                    Content = currentContent.ToString().Trim(),
                    IsLastChapter = 1
                };

                JsonSerializer.Serialize(jsonWriter, chapter);

                totalChapter++;
            }

            jsonWriter.WriteEndArray();

            await jsonWriter.FlushAsync();

            return totalChapter;
        }
        [HttpGet]
        public JsonResult GetImportChapter(int index)
        {
            if(index < 0){
                return Json(new
                {
                    status = false,
                    message = "Vị trí lấy không hợp lệ"
                });
            }
            var path = Path.Combine(_env.ContentRootPath, "App_Data", "TempImport.json");
            var pathRaw = Path.Combine(_env.ContentRootPath, "App_Data", "TempImportRaw.json");

            var chapters = System.Text.Json.JsonSerializer
                .Deserialize<List<ImportChapterDto>>(System.IO.File.ReadAllText(path));

            var chapterRaw = System.Text.Json.JsonSerializer
                .Deserialize<List<ImportChapterDto>>(System.IO.File.ReadAllText(pathRaw));

            var normalCount = chapters?.Count ?? 0;
            var rawCount = chapterRaw?.Count ?? 0;
            
            if (index >= normalCount && index >= rawCount)
            {
                return Json(new
                {
                    status = false,
                    message = "Không file nào lấy được dữ liệu"
                });
            }
            var data = index < normalCount ? chapters[index] : null;

            var dataRaw = index < rawCount ? chapterRaw[index] : null;

            return Json(new
            {
                status = true,
                data,
                dataRaw
            });
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
        private static bool IsChapterTitle(string line)
        {
            if (string.IsNullOrWhiteSpace(line))
                return false;

            return Regex.IsMatch(
                line,
                @"^(?:
            chương\s+\d+\s*:?.* |
            thứ\s+\d+\s+chương\s*:?.* |
            tự\s+\d+\s+chương\s*:?.* |
            \d+\.\s*.* |
            [IVXLCDM]+\.\s*.*
        )$",
                RegexOptions.IgnoreCase |
                RegexOptions.IgnorePatternWhitespace
            );
        }
        private static bool IsRawChapterTitle(string line)
        {
            if (string.IsNullOrWhiteSpace(line))
                return false;

            return Regex.IsMatch(
                line.Trim(),
                @"^第\d+章(?:\s+.*)?$"
            );
        }
    }
}

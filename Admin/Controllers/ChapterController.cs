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
        public ChapterController(IBase ibase)
        {
            _ibase = ibase;
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
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.chapterRespository.CreateOrUpdate(chapters, OrderTo);
                return new JsonResult(new
                {
                    status = true,
                    message = "/Chapter/Index?idStory=" + chapters.StoryId
                });
            }
            catch (Exception ex)
            {
                throw ex;
            }
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
                _ibase.chapterRespository.Delete(id);
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
                    status = true,
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

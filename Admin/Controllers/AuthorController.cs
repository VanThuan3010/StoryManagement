using Microsoft.AspNetCore.Mvc;
using Microsoft.Office.Interop.Excel;
using Newtonsoft.Json;
using StoryManagement.Model;
using StoryManagement.Model.Entity;
using Excel = Microsoft.Office.Interop.Excel;
using Range = Microsoft.Office.Interop.Excel.Range;

namespace Admin.Controllers
{
    public class AuthorController : Controller
    {
        protected IBase _ibase;
        public AuthorController(IBase ibase)
        {
            _ibase = ibase;
        }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult GetAuthor(int offset, int limit, string search)
        {
            int total = 0;
            var data = _ibase.authorRespository.GetAll(offset, limit, search, ref total);
            return Json(new { rows = data, total = total });
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
                _ibase.authorRespository.Delete(id);
                _ibase.Commit();
                return new JsonResult(new
                {
                    status = true,
                    message = "Xóa tác giả thành công"
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
        public JsonResult CreateOrUpdate(Authors authors)
        {
            try
            {
                _ibase.authorRespository.CreateOrUpdate(authors);
                return new JsonResult(new
                {
                    status = true,
                    message = "Thêm mới thành công"
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
        public JsonResult UploadExcel(IFormFile file)
        {
            try
            {
                if (file != null && file.Length > 0)
                {
                    var filePath = Path.Combine(Path.GetTempPath(), file.FileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    var json = ConvertExcelToJson(filePath);
                }
                return new JsonResult(new
                {
                    status = true,
                    message = "Thành công"
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
        public string ConvertExcelToJson(string filePath)
        {
            var excelData = new List<List<string>>();

            Application excelApp = new Application();
            Workbook workbook = excelApp.Workbooks.Open(filePath);
            Worksheet worksheet = (Worksheet)workbook.Sheets[1];
            Range range = worksheet.UsedRange;

            int rowCount = range.Rows.Count;
            int colCount = range.Columns.Count;

            for (int row = 2; row <= rowCount; row++)
            {
                var rowData = new List<string>();
                for (int col = 1; col <= colCount; col++)
                {
                    rowData.Add(((Range)range.Cells[row, col]).Text.ToString());
                }
                excelData.Add(rowData);
            }

            workbook.Close(false);
            excelApp.Quit();

            return JsonConvert.SerializeObject(excelData, Formatting.Indented);
        }
    }
}

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
        public JsonResult GetTree()
        {
            var data = _ibase.my_ComposeRepository.GetAll();

            return Json(data);
        }
        public JsonResult GetDetail(int Id)
        {
            var data = _ibase.my_ComposeRepository.GetDetail(Id);
            return Json(data);
        }
        [HttpPost]
        public JsonResult Delete(int Id)
        {
            try
            {
                if (Id <= 0)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.my_ComposeRepository.Delete(Id);
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
        public JsonResult CreateOrUpdate(My_Compose my_Compose)
        {
            try
            {
                if (my_Compose == null)
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = "Có lỗi xảy ra"
                    });
                }
                _ibase.my_ComposeRepository.CreateOrUpdate(my_Compose);
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
                    status = false,
                    message = ex.Message,
                });
            }

        }
    }
}

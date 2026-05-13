using BaseRepo.Repositories;
using Dapper;
using MFTech.Model.Entity;
using Microsoft.Extensions.Configuration;
using StoryManagement.Model.Entity;
using StoryManagement.Model.Interface;
using System.Data;

namespace StoryManagement.Model.Implement
{
    public class IplStory : Repository<Story>, IStory
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplStory(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        // Lấy ds truyện, có phân trang, tìm kiếm và lọc theo trạng thái
        public List<Story> GetAll(int pageIndex, int pageSize, string search, string status, ref int Total)
        {
            List<Story> List = new List<Story>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@pageIndex", pageIndex);
                    p.Add("@pageSize", pageSize);
                    p.Add("@search", search);
                    p.Add("@stt", status);
                    p.Add("@totalRow", Total, DbType.Int32, ParameterDirection.Output);
                    List = u.GetIEnumerable<Story>("Get_Story", p).ToList();
                    Total = p.Get<int>("@totalRow");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        // Lấy thông tin truyện
        public Story GetDetail(int id)
        {
            Story List = new Story();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@idStory", id);
                    List = u.GetIEnumerable<Story>("Get_StoryDetail", p).FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        // Thêm/Sửa thông tin truyện
        public int CreateOrUpdate(Story storyModel, string tagId, string subTagId, string authorId)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", storyModel.Id);
                    p.Add("@name", storyModel.Name);
                    p.Add("@numberChapter", storyModel.NumberChapter);
                    p.Add("@read", storyModel.IsRead);
                    //p.Add("@tagId", tagId);
                    p.Add("@tags", storyModel.TagsName);
                    //p.Add("@subTagId", subTagId);
                    p.Add("@authors", authorId);
                    p.Add("@source", storyModel.Source);

                    list = u.ProcedureExecute("CreateOrUpdate_Story", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        // Xóa truyện cùng các dữ liệu liên quan (Chương, Review, Liên kết với tác giả,...)
        public int DeleteStory(int id)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", id);

                    list = u.ProcedureExecute("Delete_Story", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public List<Story> GetStoryCanRead()
        {
            List<Story> List = new List<Story>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    List = u.GetIEnumerable<Story>("Get_StoryCanRead", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Story> GetStoryNewest()
        {
            List<Story> List = new List<Story>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    List = u.GetIEnumerable<Story>("Get_StoryNewest", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Story> GetStoryLastUpdate()
        {
            List<Story> List = new List<Story>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    List = u.GetIEnumerable<Story>("Get_StoryLastUpdate", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        // Thay đổi trạng thái đã đọc của truyện và cập nhật chương mới nhất đã đọc
        public int ReadChangeStory(int id, long idChapter)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", id);
                    p.Add("@idChapter", idChapter);

                    list = u.ProcedureExecute("Read_Change", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        // Lấy ds truyện theo tác giả
        public List<Story> GetStoryByAuthor(int id)
        {
            List<Story> List = new List<Story>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", id);
                    p.Add("@for", "Story");
                    List = u.GetIEnumerable<Story>("Get_StoryAuthor", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        // Lấy ds truyện khi tìm kiếm để gắn với tác giả
        public List<Story> GetStorySearchInAuthor(string search, string idSelected)
        {
            List<Story> List = new List<Story>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    p.Add("@search", search);
                    p.Add("@idSelected", idSelected);
                    List = u.GetIEnumerable<Story>("Get_SearchStoryForAuthor", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Authors> SearhAuthor(string searchStr, string selectedId)
        {
            List<Authors> List = new List<Authors>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    p.Add("@search", searchStr);
                    p.Add("@idSelected", selectedId);
                    List = u.GetIEnumerable<Authors>("Get_SearchAuthorForStory", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
    }
}

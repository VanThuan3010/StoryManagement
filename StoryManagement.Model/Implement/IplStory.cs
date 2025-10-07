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

        public List<Story> GetAll(int pageIndex, int pageSize, string search,string tags, string subTags, string authors, string status, ref int Total)
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
                    p.Add("@tags", tags);
                    p.Add("@subTags", subTags);
                    p.Add("@authors", authors);
                    p.Add("@stt", status);
                    p.Add("@totalRow", Total, DbType.Int32, ParameterDirection.Output);
                    List = u.GetIEnumerable<Story>("Get_Story3", p).ToList();
                    Total = p.Get<int>("@totalRow");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Tags> SearchTag(string searchStr, string listId)
        {
            List<Tags> List = new List<Tags>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@search", searchStr);
                    p.Add("@idSelected", listId);
                    p.Add("@type", "Tag");
                    p.Add("@for", "ForStory");
                    List = u.GetIEnumerable<Tags>("Get_SearchTag", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Sub_Tag> SearchSubTag(string searchStr, string listId)
        {
            List<Sub_Tag> List = new List<Sub_Tag>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@search", searchStr);
                    p.Add("@idSelected", listId);
                    p.Add("@type", "SubTag");
                    p.Add("@for", "ForStory");
                    List = u.GetIEnumerable<Sub_Tag>("Get_SearchTag", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
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
                    p.Add("@tagId", tagId);
                    p.Add("@subTagId", subTagId);
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
        public int ReadChangeStory(int id)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", id);

                    list = u.ProcedureExecute("Read_Change", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public List<Authors> GetAuthorByStory(int id)
        {
            List<Authors> List = new List<Authors>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", id);
                    p.Add("@typeId", "Story");
                    List = u.GetIEnumerable<Authors>("StoryAuthor_GetByOther", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Tags> GetTagSearchFilter(string searchStr, string selectedId)
        {
            List<Tags> List = new List<Tags>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    p.Add("@search", searchStr);
                    p.Add("@idSelected", selectedId);
                    p.Add("@type", "Tag");
                    List = u.GetIEnumerable<Tags>("Get_SearchToFilter", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Sub_Tag> GetSubTagSearchFilter(string searchStr, string selectedId)
        {
            List<Sub_Tag> List = new List<Sub_Tag>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    p.Add("@search", searchStr);
                    p.Add("@idSelected", selectedId);
                    p.Add("@type", "SubTag");
                    List = u.GetIEnumerable<Sub_Tag>("Get_SearchToFilter", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Authors> GetAuthorSearchFilter(string searchStr, string selectedId)
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
                    p.Add("@type", "Author");
                    List = u.GetIEnumerable<Authors>("Get_SearchToFilter", p).ToList();
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

using BaseRepo.Repositories;
using Dapper;
using MFTech.Model.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StoryManagement.Model.Entity;
using StoryManagement.Model.Interface;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Implement
{
    public class IplAuthor : Repository<Authors>, IAuthors
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplAuthor(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<Authors> GetAll(int pageIndex, int pageSize, string search, ref int Total)
        {
            List<Authors> List = new List<Authors>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@pageIndex", pageIndex);
                    p.Add("@pageSize", pageSize);
                    p.Add("@search", search);
                    p.Add("@totalRow", Total, DbType.Int32, ParameterDirection.Output);
                    List = u.GetIEnumerable<Authors>("Get_Author", p).ToList();
                    Total = p.Get<int>("@totalRow");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int DeleteAuthor(int id)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", id);

                    list = u.ProcedureExecute("Delete_Author", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        // Lưu tác phẩm
        public int SaveLiterary(int id, string storyIds)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", id);
                    p.Add("@storyIds", storyIds);

                    list = u.ProcedureExecute("Save_Literary", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public List<Authors> SearchAuthorForStory(string search, string selected)
        {
            List<Authors> List = new List<Authors>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    p.Add("@search", search);
                    p.Add("@selected", selected);
                    List = u.GetIEnumerable<Authors>("Get_SearchAuthor", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int CreateOrUpdate(Authors authors)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", authors.Id);
                    p.Add("@pseudonym", authors.Pseudonym);
                    p.Add("@style", authors.Style);

                    list = u.ProcedureExecute("CreateOrUpdate_Author", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public List<Authors> GetStoryAuthor(int id)
        {
            List<Authors> List = new List<Authors>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@Id", id);
                    p.Add("@for", "Author");
                    List = u.GetIEnumerable<Authors>("Get_StoryAuthor", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public Authors GetDetail(int id)
        {
            Authors List = new Authors();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@id", id);
                    List = u.GetIEnumerable<Authors>("Get_AuthorDetail", p).FirstOrDefault();
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

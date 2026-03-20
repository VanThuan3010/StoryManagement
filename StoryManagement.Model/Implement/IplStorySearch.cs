using BaseRepo.Repositories;
using Dapper;
using MFTech.Model.Entity;
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
    public class IplStorySearch : Repository<Story_Search>, IStorySearch
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplStorySearch(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<Story_Search> GetAll(int pageIndex, int pageSize, string search, ref int Total)
        {
            List<Story_Search> List = new List<Story_Search>();
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
                    List = u.GetIEnumerable<Story_Search>("Get_Search", p).ToList();
                    Total = p.Get<int>("@totalRow");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public Story_Search GetDetail(int id)
        {
            Story_Search List = new Story_Search();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@id", id);
                    List = u.GetIEnumerable<Story_Search>("Get_SearchDetail", p).FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int CreateOrUpdate(Story_Search story_Search)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", story_Search.Id);
                    p.Add("@request", story_Search.Request);
                    p.Add("@result", story_Search.Result);
                    p.Add("@searchBy", story_Search.SearchBy);

                    list = u.ProcedureExecute("CreateOrUpdate_Search", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }
        }
        public int Delete(string ids)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Ids", ids);

                    list = u.ProcedureExecute("Delete_Search", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }
        }
    }
}

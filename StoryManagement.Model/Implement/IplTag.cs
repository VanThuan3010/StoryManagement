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
    public class IplTag : Repository<Tags>, ITag
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplTag(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<Tags> GetAll(int pageIndex, int pageSize, string search, ref int Total)
        {
            List<Tags> List = new List<Tags>();
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
                    List = u.GetIEnumerable<Tags>("Get_Tag", p).ToList();
                    Total = p.Get<int>("@totalRow");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Tags> GetStoryTag(int id)
        {
            List<Tags> List = new List<Tags>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@Id", id);
                    List = u.GetIEnumerable<Tags>("Get_StoryTag", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public List<Tags> GetTag(int id, string forModule)
        {
            List<Tags> List = new List<Tags>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@id", id);
                    p.Add("@getFrom", "Tag");
                    p.Add("@getFor", forModule);
                    List = u.GetIEnumerable<Tags>("Get_TagOrSubTag_ById", p).ToList();
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

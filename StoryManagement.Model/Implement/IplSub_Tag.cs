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
    public class IplSub_Tag : Repository<Sub_Tag>, ISub_Tag
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplSub_Tag(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<Sub_Tag> GetAll(int pageIndex, int pageSize, string search, ref int Total)
        {
            List<Sub_Tag> List = new List<Sub_Tag>();
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
                    List = u.GetIEnumerable<Sub_Tag>("Get_SubTag", p).ToList();
                    Total = p.Get<int>("@totalRow");
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

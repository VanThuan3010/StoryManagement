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
        public object GetAll(string type, string content, ref int Total)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);

            try
            {
                using (var u = unitOfWork.Create(type != "Read" && type != "Edit"))
                {
                    var p = new DynamicParameters();

                    p.Add("@type", type);
                    p.Add("@content", content);
                    p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);

                    // CREATE / UPDATE / DELETE
                    if (type == "CreateOrUpdate" || type == "Delete")
                    {
                        var affected = u.ProcedureExecute("CRUD_Search", p);
                        Total = p.Get<int>("@totalRow");
                        return affected;
                    }

                    // READ
                    var list = u.GetIEnumerable<Story_Search>("CRUD_Search", p).ToList();
                    Total = p.Get<int>("@totalRow");

                    return list;
                }
            }
            catch (Exception)
            {
                Total = 0;
                return new List<Story_Search>();
            }
        }
    }
}

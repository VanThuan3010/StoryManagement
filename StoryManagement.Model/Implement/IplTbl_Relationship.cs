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
    public class IplTbl_Relationship : Repository<Tbl_Relationship>, ITbl_Relationship
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplTbl_Relationship(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public int UpdateRelationship(int IdFrom, string IdConnect, string typ)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();

                    p.Add("@Id1", IdFrom);
                    p.Add("@Id2s", IdConnect);
                    p.Add("@type", typ);
                    list = u.ProcedureExecute("UpdateRelationship", p);
                }
            }
            catch (Exception ex)
            {
                return list;
            }
            return list;
        }
    }    
}
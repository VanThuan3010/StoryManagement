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
    public class IplPart_Chapter : Repository<Part_Chapter>, IPart_Chapter
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplPart_Chapter(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<Part_Chapter> GetAll(int idStory, ref int ChapterCount)
        {
            List<Part_Chapter> List = new List<Part_Chapter>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();

                    p.Add("@idStory", idStory);
                    p.Add("@totalChapters", ChapterCount, DbType.Int32, ParameterDirection.Output);
                    List = u.GetIEnumerable<Part_Chapter>("Get_PartChapter", p).ToList();
                    ChapterCount = p.Get<int>("@totalChapters");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int CreateOrUpdatePart(int idStory,int idPart, string name, ref int NewId, ref string NewPartName)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@idStory", idStory);
                    p.Add("@name", name);
                    p.Add("@idPart", idPart);
                    p.Add("@NewId", NewId, DbType.Int32, ParameterDirection.Output);
                    p.Add("@NewPartName", NewPartName, DbType.String, ParameterDirection.Output);

                    list = u.ProcedureExecute("CreateOrUpdate_PartChapter", p);
                    NewId = p.Get<int>("@NewId");
                    NewPartName = p.Get<string>("@NewPartName");
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

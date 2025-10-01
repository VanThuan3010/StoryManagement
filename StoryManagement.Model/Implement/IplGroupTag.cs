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
    public class IplGroupTag : Repository<GroupTag>, IGroupTag
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplGroupTag(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<GroupTag> GetAll(int pageIndex, int pageSize, string search, ref int Total)
        {
            List<GroupTag> List = new List<GroupTag>();
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
                    List = u.GetIEnumerable<GroupTag>("Get_GroupTag", p).ToList();
                    Total = p.Get<int>("@totalRow");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int CreateOrUpdate(GroupTag groupTag, string lstTag, string lstSubTag)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", groupTag.Id);
                    p.Add("@Name", groupTag.Name);
                    p.Add("@Definition", groupTag.Definition);
                    p.Add("@MultiSelect", groupTag.MultiSelect);
                    p.Add("@listTag", lstTag);
                    p.Add("@listsubTag", lstSubTag);

                    list = u.ProcedureExecute("CreateOrUpdate_GroupTag", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

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
                    p.Add("@for", "ForGroup");
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
                    p.Add("@for", "ForGroup");
                    List = u.GetIEnumerable<Sub_Tag>("Get_SearchTag", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int DeleteTagOrSubTag(int id, string type, ref bool Stt, ref string Mess)
        {
            int List = 0;
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();

                    p.Add("@id", id);
                    p.Add("@type", type);
                    p.Add("@Status", Stt, DbType.Boolean, ParameterDirection.Output);
                    p.Add("@Message", Mess, DbType.String, ParameterDirection.Output);
                    List = u.ProcedureExecute("Delete_TagOrSubTag", p);
                    Stt = p.Get<bool>("@Status");
                    Mess = p.Get<string>("@Message");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int CreateOrUpdateTag_SubTag(int id, string type, string name, string definition, ref bool Stt, ref string Mess)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();

                    p.Add("@id", id);
                    p.Add("@type", type);
                    p.Add("@name", name);
                    p.Add("@definition", definition);
                    p.Add("@stt", Stt, DbType.Boolean, ParameterDirection.Output);
                    p.Add("@mss", Mess, DbType.String, ParameterDirection.Output);
                    list = u.ProcedureExecute("CreateOrUpdate_TagOrSubTag", p);
                    Stt = p.Get<bool>("@stt");
                    Mess = p.Get<string>("@mss");
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

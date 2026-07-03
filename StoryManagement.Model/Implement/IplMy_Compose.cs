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
    public class IplMy_Compose : Repository<My_Compose>, IMy_Compose
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplMy_Compose(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<My_Compose> GetAll()
        {
            List<My_Compose> List = new List<My_Compose>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    List = u.GetIEnumerable<My_Compose>("sp_GetComposTree", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public My_Compose GetDetail(int id)
        {
            My_Compose List = new My_Compose();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", id);
                    List = u.GetIEnumerable<My_Compose>("sp_GetComposeDetail", p).FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int CreateOrUpdate(My_Compose my_Compose)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", my_Compose.Id);
                    p.Add("@Name", my_Compose.Name);
                    p.Add("@Description", my_Compose.Description);
                    p.Add("@Contents", my_Compose.Contents);
                    p.Add("@ParentId", my_Compose.ParentId);

                    list = u.ProcedureExecute("sp_CreateOrUpdateCompose", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public int Delete(int id)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", id);

                    list = u.ProcedureExecute("sp_DeleteCompose", p);
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

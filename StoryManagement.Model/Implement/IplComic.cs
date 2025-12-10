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
    public class IplComic : Repository<Comic>, IComic
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplComic(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<Story_Comic> GetEpisode(int pageIndex, int pageSize, string search, int Id, ref int Total)
        {
            List<Story_Comic> List = new List<Story_Comic>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@pageIndex", pageIndex);
                    p.Add("@pageSize", pageSize);
                    p.Add("@search", search);
                    p.Add("@id", Id);
                    p.Add("@totalRow", Total, DbType.Int32, ParameterDirection.Output);
                    List = u.GetIEnumerable<Story_Comic>("Get_Episode", p).ToList();
                    Total = p.Get<int>("@totalRow");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int CreateOrUpdate(Story_Comic story_Comic)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", story_Comic.Id);
                    p.Add("@idStory", story_Comic.IdStory);
                    p.Add("@name", story_Comic.ChapterName);
                    p.Add("@descript", story_Comic.Description);
                    p.Add("@order", story_Comic.OrderChapter);

                    list = u.ProcedureExecute("CreateOrUpdate_Episode", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public int DeleteEpisode(int id, ref int idStory)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", id);
                    p.Add("@idStory", idStory, DbType.Int32, ParameterDirection.Output);
                    list = u.ProcedureExecute("Delete_Episode", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public int CRUDComicImage(long id, string name, byte[] img, string physicPath, int order, string operation, ref string ImgOld)
        {
            int list = 0;
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();

                    p.Add("@Id", id);
                    p.Add("@name", name);
                    p.Add("@img", img);
                    p.Add("@physicPath", physicPath);
                    p.Add("@order", order);
                    p.Add("@operation", operation);
                    p.Add("@imgOld", ImgOld, DbType.String, ParameterDirection.Output);
                    list = u.ProcedureExecute("CRUD_ComicImage", p);
                }
            }
            catch (Exception ex)
            {
                return list;
            }
            return list;
        }
        public List<Comic> GetListImages(int Id, ref int Total)
        {
            List<Comic> List = new List<Comic>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@id", Id);
                    p.Add("@totalRow", Total, DbType.Int32, ParameterDirection.Output);
                    List = u.GetIEnumerable<Comic>("Get_ComicImage", p).ToList();
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

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
    public class IplChapterPatch : Repository<ChapterPatch>, IChapterPatch
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplChapterPatch(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }
        public List<ChapterPatch> GetAll(long idChapter)
        {
            List<ChapterPatch> List = new List<ChapterPatch>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@idChapter", idChapter);
                    List = u.GetIEnumerable<ChapterPatch>("Get_ChapterPatch", p).ToList();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int DeletePatch(int id)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", id);

                    list = u.ProcedureExecute("Delete_ChapterPatch", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public ChapterPatch GetDetail(int id)
        {
            ChapterPatch List = new ChapterPatch();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@id", id);
                    List = u.GetIEnumerable<ChapterPatch>("Get_ChapterPatchDetail", p).FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int CreateOrUpdate(ChapterPatch chapterPatch)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", chapterPatch.Id);
                    p.Add("@chapterId", chapterPatch.ChapterId);
                    p.Add("@verName", chapterPatch.VerName);
                    p.Add("@title", chapterPatch.Title);
                    p.Add("@patch", chapterPatch.Patch);

                    list = u.ProcedureExecute("CreateOrUpdate_ChapterPatch", p);
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

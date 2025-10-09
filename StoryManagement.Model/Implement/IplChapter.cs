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
    public class IplChapter : Repository<Chapters>, IChapters
    {
        public IConfiguration _configuration { get; }
        internal string _cnnString;
        public StoryContext _context;
        public IplChapter(StoryContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
            _cnnString = _configuration.GetConnectionString("DefaultConnection");
        }

        public List<Chapters> GetAll(int pageIndex, int pageSize, int idStory, ref int Total)
        {
            List<Chapters> List = new List<Chapters>();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@pageIndex", pageIndex);
                    p.Add("@pageSize", pageSize);
                    p.Add("@idStory", idStory);
                    p.Add("@totalRow", Total, DbType.Int32, ParameterDirection.Output);
                    List = u.GetIEnumerable<Chapters>("Get_Chapter", p).ToList();
                    Total = p.Get<int>("@totalRow");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public Chapters GetDetail(long idChapter)
        {
            Chapters List = new Chapters();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@id", idChapter);
                    List = u.GetIEnumerable<Chapters>("Get_ChapterDetail", p).FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int CreateOrUpdate(Chapters chapters, int OrderTo)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Id", chapters.Id);
                    p.Add("@idStory", chapters.StoryId);
                    p.Add("@title", chapters.Title);
                    p.Add("@content", chapters.Content);
                    p.Add("@belong", chapters.Belong);
                    p.Add("@orderSetup", OrderTo);

                    list = u.ProcedureExecute("CreateOrUpdate_Chapter", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public Chapters SearchByOrder(int Id, int Order)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            Chapters list = new Chapters() { };
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();
                    p.Add("@storyId", Id);
                    p.Add("@order", Order);

                    list = u.GetIEnumerable<Chapters>("Search_ChapterToOrder", p).FirstOrDefault(); ;
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public int UpdatePosition(string listId)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@Ids", listId);

                    list = u.ProcedureExecute("UpdatePositions", p);
                }
                return list;
            }
            catch (Exception ex)
            {
                return list;
            }

        }
        public Chapters GetChapterToRead(long ChapterId, int StoryId, ref long CurrentChaterId, ref long PrevChaterId, ref string PrevChaterTitle, ref long NextChaterId, ref string NextChaterTitle)
        {
            Chapters List = new Chapters();
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            try
            {
                using (var u = unitOfWork.Create(false))
                {
                    var p = new DynamicParameters();

                    p.Add("@idChapter", ChapterId);
                    p.Add("@idstory", StoryId);
                    p.Add("@currentChapterId", CurrentChaterId, DbType.Int64, ParameterDirection.Output);
                    p.Add("@prevChapterId", PrevChaterId, DbType.Int64, ParameterDirection.Output);
                    p.Add("@prevChapterTitle", PrevChaterTitle, DbType.String, ParameterDirection.Output);
                    p.Add("@nextChapterId", NextChaterId, DbType.Int64, ParameterDirection.Output);
                    p.Add("@nextChapterTitle", NextChaterTitle, DbType.String, ParameterDirection.Output);
                    List = u.GetIEnumerable<Chapters>("Get_ChapterToRead", p).FirstOrDefault();
                    CurrentChaterId = p.Get<long>("@currentChapterId");
                    PrevChaterId = p.Get<long>("@prevChapterId");
                    PrevChaterTitle = p.Get<string>("@prevChapterTitle");
                    NextChaterId = p.Get<long>("@nextChapterId");
                    NextChaterTitle = p.Get<string>("@nextChapterTitle");
                }
            }
            catch (Exception ex)
            {
                return List;
            }
            return List;
        }
        public int DeleteChapter(long id)
        {
            var unitOfWork = new UnitOfWorkFactory(_cnnString);
            int list = 0;
            try
            {
                using (var u = unitOfWork.Create(true))
                {
                    var p = new DynamicParameters();
                    p.Add("@id", id);

                    list = u.ProcedureExecute("Delete_Chapter", p);
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

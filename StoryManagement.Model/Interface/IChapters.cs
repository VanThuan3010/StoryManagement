using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IChapters : IRepository<Chapters>
    {
        List<Chapters> GetAll(int pageIndex, int pageSize, int idStory, ref int Total);
        int CreateOrUpdate(Chapters chapters);
        Chapters GetDetail(long idChapter);
        int UpdatePosition(string listId);
    }
}

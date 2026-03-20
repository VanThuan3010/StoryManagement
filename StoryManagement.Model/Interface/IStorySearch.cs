using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IStorySearch : IRepository<Story_Search>
    {
        List<Story_Search> GetAll(int pageIndex, int pageSize, string search, ref int Total);
        Story_Search GetDetail(int id);
        int CreateOrUpdate(Story_Search story_Search);
        int Delete(string ids);
    }
}

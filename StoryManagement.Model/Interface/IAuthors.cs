using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IAuthors : IRepository<Authors>
    {
        List<Authors> GetAll(int pageIndex, int pageSize, string search, ref int Total);
        int CreateOrUpdate(Authors authors, string pseu);
        List<Pseu> GetStoryAuthor(int id);
        List<Authors> SearchAuthorForStory(string search);
    }
}

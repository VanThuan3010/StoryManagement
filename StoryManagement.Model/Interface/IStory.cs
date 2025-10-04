using BaseRepo.Interfaces;
using Microsoft.EntityFrameworkCore.Migrations;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IStory : IRepository<Story>
    {
        List<Story> GetAll(int pageIndex, int pageSize, string search, string tags, string status, string authors, ref int Total);
        List<Tags> SearchTag(string searchStr, string listId);
        List<Sub_Tag> SearchSubTag(string searchStr, string listId);
        int CreateOrUpdate(Story storyModel, string tagId, string subTagId, string authorId);
        int DeleteStory(int id);
        Story GetDetail(int id);
        List<Story> GetStoryCanRead();
        List<Story> GetStoryNewest();
        List<Story> GetStoryLastUpdate();
        int ReadChangeStory(int id);
        List<Authors> GetAuthorByStory(int id);
    }
}

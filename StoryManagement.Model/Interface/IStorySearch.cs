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
        object GetAll(string type, string content, ref int Total);
    }
}

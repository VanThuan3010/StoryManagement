using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface ISub_Tag : IRepository<Sub_Tag>
    {
        List<Sub_Tag> GetAll(int pageIndex, int pageSize, string search, ref int Total);
        List<Sub_Tag> GetSubTag(int id, string forModule);
    }
}

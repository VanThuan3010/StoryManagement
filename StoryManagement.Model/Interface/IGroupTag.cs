using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface IGroupTag : IRepository<GroupTag>
    {
        List<GroupTag> GetAll(int pageIndex, int pageSize, string search, ref int Total);
        List<Tags> SearchTag(string searchStr, string listId);
        List<Sub_Tag> SearchSubTag(string searchStr, string listId);
        int CreateOrUpdate(GroupTag groupTag, string lstTag, string lstSubTag);
        int DeleteTagOrSubTag(int id, string type, ref bool Stt, ref string Mess);
        int CreateOrUpdateTag_SubTag(int id, string type, string name, string definition, ref bool Stt, ref string Mess);
    }
}

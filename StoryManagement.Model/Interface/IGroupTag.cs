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
        int DeleteTagOrSubTag(int id, string type, ref bool Stt, ref string Mess);
        int CreateOrUpdateTag_SubTag(int id, string type, string name, string definition, ref bool Stt, ref string Mess);
    }
}

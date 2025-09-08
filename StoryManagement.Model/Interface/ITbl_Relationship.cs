using BaseRepo.Interfaces;
using StoryManagement.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Interface
{
    public interface ITbl_Relationship : IRepository<Tbl_Relationship>
    {
        public int UpdateRelationship(int IdFrom, string IdConnect, string typ);
    }
}

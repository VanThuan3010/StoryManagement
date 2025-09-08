using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Tbl_Relationship
    {
        public int Id { get; set; }
        public int IdFrom { get; set; }
        public int IdConnect { get; set; }
        public int TypeConnect { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Story_Tag
    {
        public long Id { get; set; }
        public int StoryId { get; set; }
        public int TagId { get; set; }
    }
}

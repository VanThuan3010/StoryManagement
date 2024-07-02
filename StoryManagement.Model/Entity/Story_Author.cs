using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Story_Author
    {
        public long Id { get; set; }
        public int StoryId { get; set; }
        public int AuthorId { get; set; }
    }
}

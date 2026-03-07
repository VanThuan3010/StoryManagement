using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Story_Search
    {
        public int Id { get; set; }
        public string Request { get; set; }
        public string Result { get; set; }
        public string SearchBy { get; set; }
    }
}

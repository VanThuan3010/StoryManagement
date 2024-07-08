using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Chapters
    {
        public long Id { get; set; }
        public int StoryId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int Belong {  get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class ChapterPatch
    {
        public int Id { get; set; }
        public long ChapterId { get; set; }
        public string VerName { get; set; }
        public string? Title { get; set; }
        public string? Patch { get; set; }
    }
}

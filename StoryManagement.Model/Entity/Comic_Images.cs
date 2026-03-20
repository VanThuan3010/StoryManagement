using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Comic_Images
    {
        public int Id { get; set; }
        public int EpisodeId { get; set; }
        public string? Name { get; set; }
        public Int16 Episode_Order { get; set; }
        public long ChapterId { get; set; }
        public Int16 ChapterOrder { get; set; }
    }
}

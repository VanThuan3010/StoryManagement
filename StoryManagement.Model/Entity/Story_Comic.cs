using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Story_Comic
    {
        public int Id { get; set; }
        public int? IdStory { get; set; }
        public string? ChapterName { get; set; }
        public string? Description { get; set; }
        public short? OrderChapter { get; set; }
        [NotMapped]
        public int Number_Image { get; set; }
    }
}

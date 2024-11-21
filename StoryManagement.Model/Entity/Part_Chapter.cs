using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Part_Chapter
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int IdStory {  get; set; }
        [NotMapped] 
        public int ChapterCount { get; set; } 
        
    }
}

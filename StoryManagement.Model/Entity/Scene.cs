using StoryManagement.Model.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Scenes
    {
        public int Id { get; set; }
        public string FromStory { get; set; }
        public string Scene { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool? HighRate { get; set; }
    }
}

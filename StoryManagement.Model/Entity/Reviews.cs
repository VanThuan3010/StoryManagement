using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Reviews
    {
        public int Id { get; set; }
        public int IdStory { get; set; }
        public string Review { get; set; }
        public string Opening { get; set; }
    }
}

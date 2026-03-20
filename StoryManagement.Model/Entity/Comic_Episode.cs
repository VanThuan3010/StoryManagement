using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Comic_Episode
    {
        public int Id { get; set; }
        public int IdComic { get; set; }
        public string? Name { get; set; }
        public Int16 Orders { get; set; }
    }
}

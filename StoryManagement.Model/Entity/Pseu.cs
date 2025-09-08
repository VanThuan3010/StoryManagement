using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Pseu
    {
        public int Id { get; set; }
        public string Pseudonym { get; set; }
        public int AuthorId { get; set; }
    }
}

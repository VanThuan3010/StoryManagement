using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoryManagement.Model.Entity
{
    public class Comic
    {
        public long Id { get; set; }
        public int? IdChapter { get; set; }
        public string? Name { get; set; }
        // Ảnh lưu trong DB (kiểu varbinary)
        public byte[]? Images { get; set; }
        public string? PhysicPath { get; set; }
        public short? Orders { get; set; }
    }
}

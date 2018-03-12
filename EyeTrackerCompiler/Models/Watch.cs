using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EyeTrackerCompiler.Models
{
    public class Watch
    {
        public Video Video { get; set; }

        public string Name { get; set; }

        public FileInfo File => new FileInfo($"{Environment.CurrentDirectory}/Videos/{Name}");

        public IEnumerable<WatchInfo> Info { get; set; }

        public Watch()
        {

        }

        public Watch(FileInfo file)
        {

        }

        public Watch(string path)
        {

        }
    }
}

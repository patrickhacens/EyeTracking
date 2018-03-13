using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EyeTrackerCompiler.Domain
{
    public class Watch
    {
        public Video Video { get; set; }

        public string Name { get; set; }

        public Watch()
        {

        }

        public Watch(FileInfo file)
        {
            this.Name = file.Name;
        }

        public Watch(string path) : this(new FileInfo(path))
        {

        }

        public List<WatchInfo> LoadInfo() => WatchInfo.Load(Video.Folder + Video.Name + "/" + Name);
    }
}

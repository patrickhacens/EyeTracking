using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EyeTrackerCompiler.Domain
{
    public class Video
    {
        public static string Folder => $"{Environment.CurrentDirectory}/Videos/";

        public string Name { get; set; }

        public void Save()
        {
            DirectoryInfo dir = new DirectoryInfo(Folder + Name);
            if (!dir.Exists) dir.Create();
        }
    }
}

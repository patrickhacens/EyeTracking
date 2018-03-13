using CsvHelper;
using CsvHelper.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EyeTrackerCompiler.Domain
{
    public class WatchInfo
    {
        public Watch Watch { get; set; }

        public double Time { get; set; }

        public double Timegap { get; set; }

        public double X { get; set; }

        public double Y { get; set; }

        public double GetSpeed(WatchInfo info) => Math.Abs((this.X - info.X) + (this.Y - info.Y)) / Timegap;

        public static List<WatchInfo> Load(string path)
        {
            Configuration conf = new Configuration()
            {
                Delimiter = ";",
                BadDataFound = (context) => { },
            };

            if (!File.Exists(path)) throw new FileNotFoundException();

            using (FileStream fs = File.OpenRead(path))
            using (TextReader txReader = new StreamReader(fs))
            using (CsvReader reader = new CsvReader(txReader, conf))
            {
                return reader.GetRecords<WatchInfo>()
                    .OrderBy(d=>d.Time)
                    .ToList();
            }
        }
    }
}

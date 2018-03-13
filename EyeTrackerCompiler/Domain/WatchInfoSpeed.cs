using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EyeTrackerCompiler.Domain
{
    public class WatchInfoSpeed
    {
        public Watch Watch { get; set; }

        public double Time { get; set; }

        public double Speed { get; set; }

        public double X { get; set; }

        public double Y { get; set; }

        public static List<WatchInfoSpeed> Compile(Watch watchObject, List<WatchInfo> records)
        {
            List<WatchInfoSpeed> list = new List<WatchInfoSpeed>
                {
                    new WatchInfoSpeed()
                    {
                        Time = 0,
                        Watch = watchObject,
                        X = records[0].X,
                        Y = records[0].Y,
                        Speed = 0
                    }
                };

            for (int i = 1; i < records.Count(); i++)
            {
                var record = records[i];
                list.Add(new WatchInfoSpeed()
                {
                    Time = record.Time,
                    Watch = watchObject,
                    X = record.X,
                    Y = record.Y,
                    Speed = record.GetSpeed(records[i - 1])
                });
            }

            return list;
        }
    }
}

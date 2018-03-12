using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EyeTrackerCompiler.Models
{
    public class WatchInfo
    {
        public Watch Watch { get; set; }

        public double Time { get; set; }

        public double Timegap { get; set; }

        public double X { get; set; }

        public double Y { get; set; }
    }
}

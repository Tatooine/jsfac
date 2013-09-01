using Cassette;
using Cassette.Scripts;
using Cassette.Stylesheets;

namespace Samples
{
    public class CassetteBundleConfiguration : IConfiguration<BundleCollection>
    {
        public void Configure(BundleCollection bundles)
        {
            bundles.AddPerIndividualFile<ScriptBundle>("~/js");
        }
    }
}
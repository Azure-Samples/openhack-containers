using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Simulator.DataObjects;
using Simulator.DataStore.Stores;
using TripViewer.Utility;


namespace TripViewer.Controllers
{
    public class TripController : Controller
    {
        private readonly TripViewerConfiguration _envvars;

        public TripController(IOptions<TripViewerConfiguration> EnvVars)
        {
            _envvars = EnvVars.Value ?? throw new ArgumentNullException(nameof(EnvVars));
        }
        [HttpGet]
        public IActionResult Index()
        {
            var teamendpoint = _envvars.TRIPS_API_ENDPOINT;
            var bingMapsKey = _envvars.BING_MAPS_KEY;

            List<TripPoint> tripPoints = getRandomTripPoints();
            ViewData["MapKey"] = bingMapsKey;
            return View(tripPoints);
        }

        public PartialViewResult RenderMap()
        {
            var teamendpoint = _envvars.TRIPS_API_ENDPOINT;

            List<TripPoint> tripPoints = getRandomTripPoints();
            
            return PartialView(tripPoints);
        }

        private List<TripPoint> getRandomTripPoints()
        {
            var teamendpoint = _envvars.TRIPS_API_ENDPOINT;

            //Get trips
            TripStore t = new TripStore(teamendpoint);
            List<Trip> trips = t.GetItemsAsync().Result;

            if (trips.Count == 0){
                return new List<TripPoint>();
            } 
            
            //Get Random Trip
            var r = new Random();  
            Trip randomTrip = trips.ElementAt(r.Next(0, trips.Count()));
            
            //Get TripPoints
            TripPointStore tps = new TripPointStore(teamendpoint);
            return tps.GetItemsAsync(randomTrip).Result;
        }
    }
}
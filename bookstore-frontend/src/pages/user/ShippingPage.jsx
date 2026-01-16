import { useState } from "react";
import { Search, MapPin, Truck, CheckCircle2, Package, Calendar } from "lucide-react";
const ShippingPage = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId) return;
    setIsSearching(true);
    setTimeout(() => {
      setTrackingResult({
        id: orderId,
        status: "On Delivery",
        estimatedDelivery: "16 Jan 2026",
        timeline: [
          {
            date: "14 Jan 2026 08:30",
            title: "Out for Delivery",
            desc: "Courier is on the way to your location",
            active: true,
          },
          {
            date: "13 Jan 2026 14:20",
            title: "Arrived at Sorting Hub",
            desc: "Jakarta Distribution Center",
            active: true,
          },
          {
            date: "12 Jan 2026 19:45",
            title: "Picked Up",
            desc: "Package has been picked up by courier",
            active: true,
          },
          {
            date: "12 Jan 2026 10:00",
            title: "Order Processed",
            desc: "Seller has processed your order",
            active: true,
          },
        ],
      });
      setIsSearching(false);
    }, 1500);
  };
  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans">
      <div className="container mx-auto max-w-[800px] px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-dark mb-3">Track Your Shipment</h1>
          <p className="text-gray">Enter your Order ID (ORD...) to check the delivery status</p>
        </div>
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex items-center mb-12">
          <div className="w-12 h-12 flex items-center justify-center text-gray-400">
            <Package size={24} />
          </div>
          <input
            type="text"
            placeholder="Ex: ORD123456789"
            className="flex-1 h-12 outline-none text-dark font-medium placeholder:text-gray-300"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-primary text-white px-8 h-12 rounded-xl font-bold hover:bg-opacity-90 transition disabled:opacity-70">
            {isSearching ? "Searching..." : "Track"}
          </button>
        </div>
        {trackingResult && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-gray mb-1">Order ID</div>
                  <div className="font-mono font-bold text-xl text-dark">#{trackingResult.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray mb-1">Estimated Delivery</div>
                  <div className="font-bold text-primary flex items-center justify-end gap-2">
                    <Calendar size={16} /> {trackingResult.estimatedDelivery}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <div>
                  <div className="font-bold text-lg text-green-600">{trackingResult.status}</div>
                  <p className="text-sm text-gray">Your package is on the way</p>
                </div>
              </div>
              <div className="relative pl-4 space-y-8 border-l-2 border-dashed border-gray-200 ml-4">
                {trackingResult.timeline.map((event, index) => (
                  <div key={index} className="relative pl-8">
                    <div
                      className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                        index === 0
                          ? "bg-primary border-primary ring-4 ring-primary/20"
                          : "bg-white border-gray-300"
                      }`}></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <h4
                          className={`font-bold text-sm ${index === 0 ? "text-dark" : "text-gray-500"}`}>
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray mt-1">{event.desc}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                        {event.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ShippingPage;
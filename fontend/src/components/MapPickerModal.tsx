import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Đảm bảo import css của leaflet

// --- Interface ---
interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (address: string, lat: number, lng: number) => void; // Trả về cả tọa độ nếu cần
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// --- Fix icon Leaflet ---
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// --- Component: Cập nhật view bản đồ khi chọn địa điểm mới ---
const MapUpdater: React.FC<{ center: L.LatLngExpression | null }> = ({
  center,
}) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, { animate: true });
    }
  }, [center, map]);
  return null;
};

// --- Component: Xử lý click trên bản đồ ---
const ClickMarker: React.FC<{
  position: L.LatLng | null;
  setPosition: (pos: L.LatLng) => void;
  setQuery: (addr: string) => void;
  onSelect: (addr: string, lat: number, lng: number) => void;
}> = ({ position, setPosition, setQuery, onSelect }) => {
  // Hàm lấy địa chỉ từ tọa độ (Reverse Geocoding)
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const address = data.display_name || `${lat}, ${lng}`;

      setQuery(address); // Cập nhật lên input
      onSelect(address, lat, lng); // Gửi ra ngoài component cha
    } catch (error) {
      console.error("Lỗi lấy địa chỉ:", error);
      setQuery(`${lat}, ${lng}`);
    }
  };

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  if (!position) return null;

  return <Marker position={position} icon={defaultIcon} />;
};

// --- Component Chính: MapPickerModal ---
const MapPickerModal: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const [query, setQuery] = useState(""); // Giá trị trong input
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]); // Danh sách gợi ý
  const [position, setPosition] = useState<L.LatLng | null>(null); // Vị trí marker
  const [isSearching, setIsSearching] = useState(false);

  // Ref để debounce việc gọi API tìm kiếm
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset khi đóng mở modal
  useEffect(() => {
    if (open) {
      // Reset về Hà Nội hoặc vị trí hiện tại nếu cần
      // setPosition(null);
      // setQuery("");
    }
  }, [open]);

  // Hàm tìm kiếm địa chỉ (Forward Geocoding)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    // Debounce 500ms để tránh spam API
    timeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  // Khi chọn 1 gợi ý từ dropdown
  const handleSelectSuggestion = (item: SearchResult) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const newPos = new L.LatLng(lat, lng);

    setPosition(newPos); // Di chuyển marker
    setQuery(item.display_name); // Điền vào input
    setSuggestions([]); // Ẩn gợi ý
    onSelect(item.display_name, lat, lng); // Callback ra ngoài
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col overflow-hidden relative">
        {/* --- Header & Input Area --- */}
        <div className="p-4 border-b border-gray-200 bg-white z-[1001] relative">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Chọn vị trí</h3>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Đóng ✕
            </button>
          </div>

          {/* Input Container */}
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Nhập địa chỉ để tìm kiếm..."
              className="w-full p-3 pl-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Loading Indicator */}
            {isSearching && (
              <div className="absolute right-3 top-3.5">
                <div className="w-5 h-5 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
            )}

            {/* --- Suggestions List (Hiển thị đè lên Map) --- */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-[1002]">
                {suggestions.map((item) => (
                  <li
                    key={item.place_id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="p-3 text-sm text-gray-700 transition-colors border-b border-gray-100 cursor-pointer hover:bg-blue-50 last:border-b-0"
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* --- Map Area --- */}
        <div className="relative z-0 flex-1">
          <MapContainer
            center={[21.0278, 105.8342]} // Mặc định Hà Nội
            zoom={13}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Component con để điều khiển map khi state thay đổi */}
            <MapUpdater center={position} />

            {/* Marker & Click Event */}
            <ClickMarker
              position={position}
              setPosition={setPosition}
              setQuery={setQuery}
              onSelect={onSelect}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPickerModal;

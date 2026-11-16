import { readChoice, readJSON, writeStorage } from "./storage.js";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Minus,
  Moon,
  Plus,
  Search,
  Star,
  Sun,
  Users,
  X,
} from "lucide-react";

const enDictionary = {
  decreaseGuests: "Fewer guests", increaseGuests: "More guests",
  previousPhoto: "Previous photo", nextPhoto: "Next photo",
  decreaseNights: "Fewer nights", increaseNights: "More nights",
  navStays: "Stays",
  navDestinations: "Destinations",
  navJournal: "Journal",
  navConcierge: "Concierge",
  heroEyebrow: "Private stays · Thoughtfully chosen",
  heroTitle: "Some places are found. Others are felt.",
  heroText:
    "A considered collection of private villas across the region, chosen for their architecture, stillness, and sense of place.",
  heroNote: "Curated residences for unhurried escapes",
  destination: "Where would you like to go?",
  guests: "Guests",
  search: "Explore stays",
  collectionEyebrow: "The private collection",
  collectionTitle: "Stay somewhere remarkable",
  collectionText: "Distinctive villas, considered down to the last detail.",
  all: "All",
  beachfront: "Beachfront",
  desert: "Desert Oasis",
  mountain: "Mountain",
  noResults: "No villas match your search.",
  guest: "guest",
  guestsPlural: "guests",
  from: "From",
  night: "night",
  mapTitle: "Explore on the map",
  featured: "Featured",
  privatePool: "Private pool",
  bedrooms: "bedrooms",
  seaView: "Sea view",
  desertView: "Desert view",
  mountainView: "Mountain view",
  close: "Close",
  reservation: "Your private stay",
  selectNights: "Length of stay",
  nights: "nights",
  cleaningFee: "Cleaning fee",
  serviceFee: "Service fee",
  total: "Total",
  reserve: "Reserve",
  confirmed:
    "Your stay has been reserved. Our concierge will contact you shortly.",
  footer: "Exceptional private stays across the Gulf",
  rights: "MALATH. All rights reserved.",
  langToggle: "العربية",
  perNight: "per night",
  journalEyebrow: "Notes from the region",
  journalTitle: "The art of arriving slowly",
  journalText: "Architectural stories, local rituals, and considered guides for a more meaningful stay.",
  conciergeEyebrow: "Private concierge",
  conciergeTitle: "Every detail, quietly arranged",
  conciergeText: "From airport transfers to private dining, our hosts shape each stay around the way you travel.",
};
const arDictionary = {
  decreaseGuests: "تقليل الضيوف", increaseGuests: "زيادة الضيوف",
  previousPhoto: "الصورة السابقة", nextPhoto: "الصورة التالية",
  decreaseNights: "تقليل الليالي", increaseNights: "زيادة الليالي",
  navStays: "الإقامات",
  navDestinations: "الوجهات",
  navJournal: "المجلة",
  navConcierge: "خدمة الضيوف",
  heroEyebrow: "إقامات خاصة · مختارة بعناية",
  heroTitle: "أماكن لا تُزار فحسب، بل تُشعَر.",
  heroText:
    "مجموعة منتقاة من الفلل الخاصة في أرجاء المنطقة، اخترناها لجمال عمارتها وهدوئها وروح المكان فيها.",
  heroNote: "إقامات استثنائية لعطلات هادئة",
  destination: "إلى أين تود الذهاب؟",
  guests: "الضيوف",
  search: "استكشف الإقامات",
  collectionEyebrow: "المجموعة الخاصة",
  collectionTitle: "أقم في مكان استثنائي",
  collectionText: "فلل متفردة، مدروسة حتى أدق التفاصيل.",
  all: "الكل",
  beachfront: "على الشاطئ",
  desert: "واحة صحراوية",
  mountain: "الجبل",
  noResults: "لا توجد فلل مطابقة لبحثك.",
  guest: "ضيف",
  guestsPlural: "ضيوف",
  from: "ابتداءً من",
  night: "ليلة",
  mapTitle: "استكشف على الخريطة",
  featured: "مختارة",
  privatePool: "مسبح خاص",
  bedrooms: "غرف نوم",
  seaView: "إطلالة بحرية",
  desertView: "إطلالة صحراوية",
  mountainView: "إطلالة جبلية",
  close: "إغلاق",
  reservation: "إقامتك الخاصة",
  selectNights: "مدة الإقامة",
  nights: "ليالٍ",
  cleaningFee: "رسوم التنظيف",
  serviceFee: "رسوم الخدمة",
  total: "الإجمالي",
  reserve: "تأكيد الحجز",
  confirmed: "تم تأكيد إقامتك. سيتواصل معك فريق خدمة الضيوف قريبًا.",
  footer: "إقامات خاصة استثنائية في الخليج",
  rights: "مَلاذ. جميع الحقوق محفوظة.",
  langToggle: "English",
  perNight: "لليلة الواحدة",
  journalEyebrow: "حكايات من المنطقة",
  journalTitle: "فن الوصول على مهل",
  journalText: "قصص معمارية وطقوس محلية وأدلة مختارة لإقامة أكثر معنى.",
  conciergeEyebrow: "خدمة ضيوف خاصة",
  conciergeTitle: "كل التفاصيل، مرتبة بهدوء",
  conciergeText: "من استقبال المطار إلى تجارب الطعام الخاصة، نصمم إقامتك بما يناسب أسلوب سفرك.",
};
const i18nTranslations = { en: enDictionary, ar: arDictionary };
const CLEANING_FEE = 280;
const SERVICE_FEE = 390;
const STORAGE_KEYS = {
  language: "malathLanguage",
  theme: "userTheme",
  favorites: "malathFavorites",
};
const IMAGE_URLS = [
  "https://lh3.googleusercontent.com/aida/AEtjO1Wy4IPDusWFjPhfuEBA0hzxIg8sVZF04YiU5zHw5eVaanF7uKU9TDpC7Ma4Mj-oGrTrj7vvYrPmYW_J9owQfu8fGTZfqI_26OLwzmJWGLVGFdVqGrc9AD34Ks7b8pR6PuaguPdfzvN1mjOcoKm-VT2_d8sllbRDY4l9lBXPW1tNZFuiInei2GwbOTedBMRmGqk3S3DCOo1YU_clDsq2pdhg8Srw8cK1tV8pLSb71ApBju0IWwmndqReNQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCaWx0V1HGynTA09_03ZJnLcw2WAGdyqfsqBj4JkXvFrY3l3QbAS_RH_a-ElukG-HPb_gi_heH9zsEL2qa6CKUVZ5nkWbPcM1vsi9RqEGBcCLb8RYjxxIC4xinyuWDYENO831j2ciPofaqFTtu8_SPzMia7IbtzzPTZP6hmA6djz6ZzCcHyGBMUG11E-BjTPPov9CUHuu62ezxxWgaXzN5SDhqhYbDNbeL4S_8B1_REYaDxFXkvDqaj",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDSBo_LZgg0_sp-NOFJEHeQF3d5_j4ZuoSxRUwlfdlPLu5P8mow_MOMaRgUEVtXoCgu6CIJYq1v7tQnR9Iag5eFURoedes9B1hGNBuHCId6IKM-vkSMyDHKbBXDzpXtgb-ZX1RyH7ApUGYwiXwSY2tB84K0Q4jF5zk7Xaqe3tlC3Shwxno0XiFJPLreYxALnF9BVFcblCMY_rWqeFAUKoe3g8uV4kaj-TnT5OOkPNpCWmr2Xog0Do7u",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB20Ln_ZpnSYC1bX7pwY6rLx4pSFL6P7IGlUNdlwTQdvacZ8VzqELbr7Yi3bAfXUuPdqzfS-Cc-JxeJ2WE4qAAHe46_Y1-mIUDPSEOH62a2C-wvnXBtdYo6gump_Pz8qpCvug_OzI3VuRbGSuad9hUtHME-zZ-Kc93nsXk7rgAQCMA3zx9FetIQpyberCT4d_84taWKMV4CFP4RA_Ucs-bZlZropT-zcbPSq0nT3omQXyMNoZJX5pxg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDZo7nCEH68UIHO07apO_vn_tX4jVowBmuJihanXRLUr0R_CFWK-qioMyxVmaxUEa7-rv00UY5dtiId11g_N7PLQdRIYKwH-P3AHJqBUAZp6tK4BwKvDKNkJ0ZV1pIU8YURtzLW6f0lysxAqKosA0XVFuvRayiyx_0FMLcQWCgggO0ol5XaGHVVq4qDohvO6cKru7lVIUXY3jiY12PW56OeGf3zmo_34mehY_eGrFcCv94E9BTqmzG1",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBIV9Eirk9qgJ7E1LoPfORikgKlfGpI9JdYW83vVSo-nbBFMlp0fYSHLUKqwzGXT-MHBpdwUsUdo0Fbloxq2VNg4vu4se-Qvr3sIpFDjiCp7hdG6aRkHxoMD00Jr2saN59-fgSjmxZjJ1yKtx9vp1IAXhnk7DPp3Flv7OsBj59PV8Z7d9mwYtWh336vZ0VIyLrLg1CCr8TWp-Yz41yU3qp8XV48MoTng0jZpGLAL8aI6RJ9EvOTBnnN",
];
const VILLAS = [
  {
    id: 1,
    nameEn: "The Azure House",
    nameAr: "دار أزور",
    locationEn: "Muscat, Oman",
    locationAr: "مسقط، عُمان",
    category: "beachfront",
    price: 1650,
    guests: 6,
    bedrooms: 3,
    rating: 4.96,
    viewKey: "seaView",
    photos: [IMAGE_URLS[1], IMAGE_URLS[2]],
  },
  {
    id: 2,
    nameEn: "Qamar Desert Retreat",
    nameAr: "منتجع قمر الصحراوي",
    locationEn: "AlUla, Saudi Arabia",
    locationAr: "العلا، السعودية",
    category: "desert",
    price: 2100,
    guests: 8,
    bedrooms: 4,
    rating: 4.98,
    viewKey: "desertView",
    photos: [IMAGE_URLS[3], IMAGE_URLS[4]],
  },
  {
    id: 3,
    nameEn: "Jabal Stone Villa",
    nameAr: "فيلا حجر الجبل",
    locationEn: "Jabal Akhdar, Oman",
    locationAr: "الجبل الأخضر، عُمان",
    category: "mountain",
    price: 1380,
    guests: 4,
    bedrooms: 2,
    rating: 4.91,
    viewKey: "mountainView",
    photos: [IMAGE_URLS[5], IMAGE_URLS[1]],
  },
  {
    id: 4,
    nameEn: "Pearl Coast Residence",
    nameAr: "دار ساحل اللؤلؤ",
    locationEn: "Saadiyat, Abu Dhabi",
    locationAr: "السعديات، أبوظبي",
    category: "beachfront",
    price: 2450,
    guests: 10,
    bedrooms: 5,
    rating: 4.99,
    viewKey: "seaView",
    photos: [IMAGE_URLS[2], IMAGE_URLS[5]],
  },
];

function HeaderNav({
  t,
  currentLanguage,
  themeMode,
  handleLanguageToggle,
  handleThemeToggle,
  handleNavClick,
}) {
  return (
    <header className="header">
      <button
        className="text-btn brand"
        onClick={() => handleNavClick("top")}
        aria-label={
          currentLanguage === "en" ? "Malath home" : "العودة للرئيسية"
        }
      >
        {currentLanguage === "en" ? "MALATH" : "مَلاذ"}
        <span className="brand-dot">.</span>
      </button>
      <nav className="nav">
        <button onClick={() => handleNavClick("collection")}>{t("navStays")}</button>
        <button onClick={() => handleNavClick("destinations")}>{t("navDestinations")}</button>
        <button onClick={() => handleNavClick("journal")}>{t("navJournal")}</button>
        <button onClick={() => handleNavClick("concierge")}>{t("navConcierge")}</button>
      </nav>
      <div className="controls">
        <button className="text-btn" onClick={handleLanguageToggle}>
          {t("langToggle")}
        </button>
        <button
          className="icon-btn"
          onClick={handleThemeToggle}
          aria-label={themeMode === "light" ? "Dark theme" : "Light theme"}
        >
          {themeMode === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}

function EditorialServiceSection({ t }) {
  return (
    <section className="editorial-services">
      <article id="journal" className="editorial-panel journal-panel">
        <span className="eyebrow">{t("journalEyebrow")}</span>
        <h2 className="display">{t("journalTitle")}</h2>
        <p>{t("journalText")}</p>
      </article>
      <article id="concierge" className="editorial-panel concierge-panel">
        <span className="eyebrow">{t("conciergeEyebrow")}</span>
        <h2 className="display">{t("conciergeTitle")}</h2>
        <p>{t("conciergeText")}</p>
      </article>
    </section>
  );
}
function SearchFilterBar({
  t,
  destinationSearch,
  setDestinationSearch,
  guestCount,
  setGuestCount,
}) {
  return (
    <div className="search-bar">
      <label className="search-field">
        <MapPin size={19} />
        <input
          value={destinationSearch}
          onChange={(event) => setDestinationSearch(event.target.value)}
          placeholder={t("destination")}
        />
      </label>
      <div className="guest">
        <Users size={18} />
        <button aria-label={t("decreaseGuests")} onClick={() => setGuestCount(Math.max(1, guestCount - 1))}>
          <Minus size={14} />
        </button>
        <b>{guestCount}</b>
        <button aria-label={t("increaseGuests")} onClick={() => setGuestCount(Math.min(16, guestCount + 1))}>
          <Plus size={14} />
        </button>
      </div>
      <button
        className="primary"
        onClick={() => document.getElementById("collection")?.scrollIntoView()}
      >
        <Search size={16} /> {t("search")}
      </button>
    </div>
  );
}
function CategoryTabs({ t, activeCategory, handleFilterByCategory }) {
  return (
    <div className="tabs">
      {["all", "beachfront", "desert", "mountain"].map((category) => (
        <button
          key={category}
          className={`tab ${activeCategory === category ? "active" : ""}`}
          onClick={() => handleFilterByCategory(category)}
        >
          {t(category)}
        </button>
      ))}
    </div>
  );
}
function ListingCard({
  villa,
  t,
  currentLanguage,
  isFavorite,
  handleToggleFavorite,
  handleOpenReservation,
  isHighlighted,
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const previous = (event) => {
    event.stopPropagation();
    setImageIndex(
      (value) => (value - 1 + villa.photos.length) % villa.photos.length,
    );
  };
  const next = (event) => {
    event.stopPropagation();
    setImageIndex((value) => (value + 1) % villa.photos.length);
  };
  return (
    <article
      id={`villa-${villa.id}`}
      className={`card ${isHighlighted ? "highlight" : ""}`}
      onClick={() => handleOpenReservation(villa)}
    >
      <div
        className="card-media"
        style={{ backgroundImage: `url(${villa.photos[imageIndex]})` }}
      >
        <span className="badge">{t("featured")}</span>
        <button
          className={`heart ${isFavorite ? "on" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            handleToggleFavorite(villa.id);
          }}
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <div className="arrows">
          <button aria-label={t("previousPhoto")} className="arrow prev" onClick={previous}>
            {currentLanguage === "ar" ? (
              <ChevronRight size={17} />
            ) : (
              <ChevronLeft size={17} />
            )}
          </button>
          <button aria-label={t("nextPhoto")} className="arrow next" onClick={next}>
            {currentLanguage === "ar" ? (
              <ChevronLeft size={17} />
            ) : (
              <ChevronRight size={17} />
            )}
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title">
          <h3 className="display">
            {currentLanguage === "en" ? villa.nameEn : villa.nameAr}
          </h3>
          <span className="rating">
            <Star size={12} fill="currentColor" /> {villa.rating}
          </span>
        </div>
        <p className="location">
          {currentLanguage === "en" ? villa.locationEn : villa.locationAr}
        </p>
        <div className="amenities">
          <span>
            {villa.bedrooms} {t("bedrooms")}
          </span>
          <span>
            {villa.guests} {t("guestsPlural")}
          </span>
          <span>{t("privatePool")}</span>
        </div>
        <div className="price">
          <strong>
            {villa.price.toLocaleString(
              currentLanguage === "ar" ? "ar-SA" : "en-US",
            )}{" "}
            SAR
          </strong>{" "}
          <span>/ {t("night")}</span>
        </div>
      </div>
    </article>
  );
}
function ListingGrid({ villas, favoriteVillasList, ...cardProps }) {
  return (
    <div className="grid">
      {villas.length ? (
        villas.map((villa) => (
          <ListingCard
            key={villa.id}
            villa={villa}
            isFavorite={favoriteVillasList.includes(villa.id)}
            isHighlighted={cardProps.highlightedVillaId === villa.id}
            {...cardProps}
          />
        ))
      ) : (
        <div className="empty">{cardProps.t("noResults")}</div>
      )}
    </div>
  );
}
function InteractiveMapMock({ villas, currentLanguage, t, handleMapPinClick }) {
  const positions = [
    ["25%", "30%"],
    ["70%", "24%"],
    ["38%", "67%"],
    ["77%", "74%"],
  ];
  return (
    <aside className="map">
      <span className="map-label">
        <MapPin size={14} /> {t("mapTitle")}
      </span>
      {villas.map((villa, index) => (
        <button
          className="pin"
          style={{ left: positions[index][0], top: positions[index][1] }}
          key={villa.id}
          onClick={() => handleMapPinClick(villa.id)}
        >
          {villa.price.toLocaleString(
            currentLanguage === "ar" ? "ar-SA" : "en-US",
          )}{" "}
          SAR
        </button>
      ))}
    </aside>
  );
}
function ReservationModal({ villa, t, currentLanguage, onClose, onReserve }) {
  const [nightCount, setNightCount] = useState(3);
  const total = nightCount * villa.price + CLEANING_FEE + SERVICE_FEE;
  useEffect(() => {
    const escape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [onClose]);
  return (
    <div
      className="backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="modal" role="dialog" aria-modal="true">
        <div
          className="modal-image"
          style={{ backgroundImage: `url(${villa.photos[0]})` }}
        />
        <div className="modal-content">
          <div className="modal-top">
            <span className="eyebrow">{t("reservation")}</span>
            <button
              className="icon-btn"
              onClick={onClose}
              aria-label={t("close")}
            >
              <X size={19} />
            </button>
          </div>
          <h2 className="display">
            {currentLanguage === "en" ? villa.nameEn : villa.nameAr}
          </h2>
          <p className="muted">
            {currentLanguage === "en" ? villa.locationEn : villa.locationAr}
          </p>
          <div className="counter">
            <span>{t("selectNights")}</span>
            <div className="counter-controls">
              <button
                aria-label={t("decreaseNights")} onClick={() => setNightCount(Math.max(1, nightCount - 1))}
              >
                <Minus size={14} />
              </button>
              <b>{nightCount}</b>
              <button aria-label={t("increaseNights")} onClick={() => setNightCount(nightCount + 1)}>
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="cost-row">
            <span>
              {villa.price.toLocaleString()} SAR × {nightCount} {t("nights")}
            </span>
            <span>{(villa.price * nightCount).toLocaleString()} SAR</span>
          </div>
          <div className="cost-row">
            <span>{t("cleaningFee")}</span>
            <span>{CLEANING_FEE} SAR</span>
          </div>
          <div className="cost-row">
            <span>{t("serviceFee")}</span>
            <span>{SERVICE_FEE} SAR</span>
          </div>
          <div className="cost-row total">
            <span>{t("total")}</span>
            <span>{total.toLocaleString()} SAR</span>
          </div>
          <button className="primary full" onClick={onReserve}>
            {t("reserve")}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState(
    () => readChoice(STORAGE_KEYS.language, ["en", "ar"], "en"),
  );
  const [themeMode, setThemeMode] = useState(
    () => readChoice(STORAGE_KEYS.theme, ["light", "dark"], "light"),
  );
  const [activeCategory, setActiveCategory] = useState("all");
  const [guestCount, setGuestCount] = useState(2);
  const [destinationSearch, setDestinationSearch] = useState("");
  const [selectedVillaForModal, setSelectedVillaForModal] = useState(null);
  const [favoriteVillasList, setFavoriteVillasList] = useState(() =>
    readJSON(STORAGE_KEYS.favorites, [], (value) => Array.isArray(value) && value.every((id) => typeof id === "string" || typeof id === "number")),
  );
  const [toastMessage, setToastMessage] = useState(null);
  const [highlightedVillaId, setHighlightedVillaId] = useState(null);
  const toastTimerRef = useRef(null);
  const t = (key) => i18nTranslations[currentLanguage][key] || key;
  useEffect(() => {
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
    writeStorage(STORAGE_KEYS.language, currentLanguage);
  }, [currentLanguage]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
    writeStorage(STORAGE_KEYS.theme, themeMode);
  }, [themeMode]);
  useEffect(() => {
    writeStorage(
      STORAGE_KEYS.favorites,
      JSON.stringify(favoriteVillasList),
    );
  }, [favoriteVillasList]);
  const filteredVillas = useMemo(
    () =>
      VILLAS.filter((villa) => {
        const categoryMatches =
          activeCategory === "all" || villa.category === activeCategory;
        const searchText =
          `${villa.nameEn} ${villa.nameAr} ${villa.locationEn} ${villa.locationAr}`.toLowerCase();
        return (
          categoryMatches &&
          villa.guests >= guestCount &&
          searchText.includes(destinationSearch.trim().toLowerCase())
        );
      }),
    [activeCategory, destinationSearch, guestCount],
  );
  const handleFilterByCategory = (category) => setActiveCategory(category);
  const handleToggleFavorite = (villaId) =>
    setFavoriteVillasList((list) => {
      const nextList = list.includes(villaId)
        ? list.filter((id) => id !== villaId)
        : [...list, villaId];
      writeStorage(STORAGE_KEYS.favorites, JSON.stringify(nextList));
      return nextList;
    });
  const handleOpenReservation = (villa) => setSelectedVillaForModal(villa);
  const handleLanguageToggle = () =>
    setCurrentLanguage((language) => (language === "en" ? "ar" : "en"));
  const handleThemeToggle = () =>
    setThemeMode((theme) => (theme === "light" ? "dark" : "light"));
  const handleNavClick = (sectionId) => {
    if (sectionId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleMapPinClick = (villaId) => {
    setHighlightedVillaId(villaId);
    document
      .getElementById(`villa-${villaId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightedVillaId(null), 1400);
  };
  const handleReserve = () => {
    setSelectedVillaForModal(null);
    setToastMessage(t("confirmed"));
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 4000);
  };
  return (
    <div className="app">
      <div className="shell">
        <HeaderNav
          {...{
            t,
            currentLanguage,
            themeMode,
            handleLanguageToggle,
            handleThemeToggle,
            handleNavClick,
          }}
        />
        <main>
          <section className="hero" id="destinations">
            <div>
              <span className="eyebrow">{t("heroEyebrow")}</span>
              <h1 className="display">{t("heroTitle")}</h1>
              <p>{t("heroText")}</p>
            </div>
            <div
              className="hero-art"
              style={{ "--hero": `url(${IMAGE_URLS[0]})` }}
            >
              <div className="hero-card">
                <span className="eyebrow">{t("heroNote")}</span>
              </div>
            </div>
          </section>
          <SearchFilterBar
            {...{
              t,
              destinationSearch,
              setDestinationSearch,
              guestCount,
              setGuestCount,
            }}
          />
          <section className="content" id="collection">
            <div className="section-head">
              <div>
                <span className="eyebrow">{t("collectionEyebrow")}</span>
                <h2 className="display">{t("collectionTitle")}</h2>
                <p className="muted">{t("collectionText")}</p>
              </div>
              <CategoryTabs
                {...{ t, activeCategory, handleFilterByCategory }}
              />
            </div>
            <div className="layout">
              <ListingGrid
                favoriteVillasList={favoriteVillasList}
                villas={filteredVillas}
                {...{
                  t,
                  currentLanguage,
                  handleToggleFavorite,
                  handleOpenReservation,
                  highlightedVillaId,
                }}
              />
              <InteractiveMapMock
                villas={VILLAS}
                {...{ currentLanguage, t, handleMapPinClick }}
              />
            </div>
          </section>
          <EditorialServiceSection t={t} />
        </main>
        <footer className="footer">
          <span>{t("footer")}</span>
          <span>© 2026 {t("rights")}</span>
        </footer>
      </div>
      {selectedVillaForModal && (
        <ReservationModal
          villa={selectedVillaForModal}
          t={t}
          currentLanguage={currentLanguage}
          onClose={() => setSelectedVillaForModal(null)}
          onReserve={handleReserve}
        />
      )}{" "}
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}

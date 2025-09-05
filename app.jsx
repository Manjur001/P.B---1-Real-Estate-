//
import React, { useState, useEffect } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, onSnapshot, collection, query, where, getDocs, orderBy, limit, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bed, Bath, Square, Car, Wifi, Shield, Trees, Dumbbell, Coffee, Waves, ChevronLeft, ChevronRight, Expand, User, Mail, Phone, MessageSquare, Calendar, CheckCircle2, Loader2 } from "lucide-react";

// Firebase setup
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
setLogLevel('debug');

async function authAndFetch() {
  const __initial_auth_token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
  if (__initial_auth_token) {
    try {
      await signInWithCustomToken(auth, __initial_auth_token);
    } catch (error) {
      console.error("Error signing in with custom token:", error);
      await signInAnonymously(auth);
    }
  } else {
    await signInAnonymously(auth);
  }
}

// Data entities
class Property {
  static async list(order = "-created_at", limitCount = 10) {
    const propertiesCol = collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/public/data/properties`);
    const q = query(propertiesCol, orderBy(order), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async filter(filters, order = "-created_at", limitCount = 10) {
    const propertiesCol = collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/public/data/properties`);
    let q = query(propertiesCol);

    // Apply filters
    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        q = query(q, where(key, "==", filters[key]));
      }
    }

    q = query(q, orderBy(order), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

class Contact {
  static async create(data) {
    const contactsCol = collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/public/data/contacts`);
    return await addDoc(contactsCol, {
      ...data,
      created_at: new Date()
    });
  }
}

// UI Components
const featureIcons = {
  garage: Car,
  wifi: Wifi,
  security: Shield,
  garden: Trees,
  gym: Dumbbell,
  kitchen: Coffee,
  pool: Waves,
};

function Card({ children, className = "" }) {
  return <div className={`rounded-xl shadow-md p-4 bg-white/80 backdrop-blur-sm ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
function CardHeader({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
function CardTitle({ children, className = "" }) {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
}
function Button({ children, className = "", onClick, ...props }) {
  return <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`} onClick={onClick} {...props}>{children}</button>;
}
function Input({ className = "", ...props }) {
  return <input className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`} {...props} />;
}
function Textarea({ className = "", ...props }) {
  return <textarea className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`} {...props}></textarea>;
}
function Label({ children, className = "", ...props }) {
  return <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>{children}</label>;
}
function Badge({ children, className = "" }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

const Hero = ({ property, onBookViewing }) => {
  if (!property) return null;

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://placehold.co/2075x1384/E2E8F0/1E293B?text=Image+Not+Found"; }}
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-emerald-600 text-white border-0 px-4 py-2 text-sm">
                {property.is_featured ? "Featured Property" : "Premium Listing"}
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {property.title}
              </h1>
              
              <div className="flex items-center gap-2 mb-8">
                <MapPin className="w-5 h-5 text-white/80" />
                <p className="text-xl text-white/90">{property.address}</p>
              </div>

              <div className="flex flex-wrap items-center gap-8 mb-8 text-white/90">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span className="text-lg font-medium">{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span className="text-lg font-medium">{property.bathrooms} Baths</span>
                  </div>
                )}
                {property.square_feet && (
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5" />
                    <span className="text-lg font-medium">{property.square_feet.toLocaleString()} sq ft</span>
                  </div>
                )}
              </div>
              
              <div className="mb-10">
                <div className="text-5xl md:text-6xl font-bold text-emerald-400 mb-2">
                  ${property.price?.toLocaleString()}
                </div>
                <p className="text-white/80 text-lg">Exceptional value in prime location</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={onBookViewing}
                >
                  Book a Viewing
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PropertyHighlights = ({ property }) => {
  if (!property) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Property Highlights
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover what makes this property exceptional
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bed className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">{property.bedrooms || 0}</h3>
              <p className="text-slate-600 font-medium">Bedrooms</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Bath className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">{property.bathrooms || 0}</h3>
              <p className="text-slate-600 font-medium">Bathrooms</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Square className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">
                {property.square_feet?.toLocaleString() || '0'}
              </h3>
              <p className="text-slate-600 font-medium">Square Feet</p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Premium Features</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {property.features.map((feature, index) => {
                const IconComponent = featureIcons[feature.toLowerCase()] || Coffee;
                return (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 px-6 py-3 text-sm font-medium hover:from-emerald-100 hover:to-emerald-200 hover:text-emerald-800 transition-all duration-300 border-0"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {feature}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const PhotoCarousel = ({ property }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const images = property?.images || [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
  ];

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Photo Gallery
          </h2>
          <p className="text-xl text-slate-600">
            Explore every corner of this beautiful property
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Image */}
          <div className="relative group mb-6 rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={images[currentIndex]}
                alt={`Property view ${currentIndex + 1}`}
                className="w-full h-[600px] object-cover cursor-pointer"
                onClick={() => setShowFullscreen(true)}
                onError={(e) => { e.target.src = "https://placehold.co/2075x1384/E2E8F0/1E293B?text=Image+Not+Found"; }}
              />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 flex items-center justify-center rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <Button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 flex items-center justify-center rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Fullscreen Button */}
            <Button
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 w-10 h-10 flex items-center justify-center rounded-full"
              onClick={() => setShowFullscreen(true)}
            >
              <Expand className="w-5 h-5" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 justify-center overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-4 ring-emerald-500 scale-110'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://placehold.co/80x80/E2E8F0/1E293B?text=Image+Not+Found"; }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Fullscreen Modal */}
        {showFullscreen && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullscreen(false)}
          >
            <div className="relative max-w-7xl max-h-full">
              <img
                src={images[currentIndex]}
                alt={`Property view ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => { e.target.src = "https://placehold.co/2075x1384/E2E8F0/1E293B?text=Image+Not+Found"; }}
              />
              <Button
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white w-10 h-10 flex items-center justify-center rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullscreen(false);
                }}
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const ContactForm = ({ property }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferred_viewing_date: "",
    property_id: property?.id || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Contact.create(formData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        preferred_viewing_date: "",
        property_id: property?.id || ""
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }

    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h2>
            <p className="text-lg text-slate-600 mb-8">
              We've received your inquiry and will contact you within 24 hours to schedule your viewing.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="border border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              Submit Another Inquiry
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Schedule Your Viewing
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Ready to see this amazing property? Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-3">
                <Calendar className="w-6 h-6 text-emerald-600" />
                Book Your Private Viewing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-slate-700 font-medium">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="h-12 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 font-medium">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-12 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 font-medium">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      className="h-12 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="viewing_date" className="flex items-center gap-2 text-slate-700 font-medium">
                      <Calendar className="w-4 h-4" />
                      Preferred Viewing Date
                    </Label>
                    <Input
                      id="viewing_date"
                      type="date"
                      value={formData.preferred_viewing_date}
                      onChange={(e) => handleInputChange("preferred_viewing_date", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-12 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2 text-slate-700 font-medium">
                    <MessageSquare className="w-4 h-4" />
                    Additional Message (Optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your requirements or any questions you have..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    rows={4}
                    className="border-slate-200 focus:border-emerald-400 focus:ring-emerald-400 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Scheduling Your Viewing...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule My Viewing
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [featuredProperty, setFeaturedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await authAndFetch();
      } catch (e) {
        console.error("Firebase auth failed:", e);
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthReady) {
      loadFeaturedProperty();
    }
  }, [isAuthReady]);

  const loadFeaturedProperty = async () => {
    try {
      const properties = await Property.filter({ is_featured: true }, "-created_at", 1);
      if (properties.length > 0) {
        setFeaturedProperty(properties[0]);
      } else {
        // Fallback to any property if no featured property exists
        const allProperties = await Property.list("-created_at", 1);
        if (allProperties.length > 0) {
          setFeaturedProperty(allProperties[0]);
        }
      }
    } catch (error) {
      console.error("Error loading featured property:", error);
    }
    setIsLoading(false);
  };

  const handleBookViewing = () => {
    document.getElementById('contact-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!featuredProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🏠</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No Properties Available</h2>
          <p className="text-slate-600">
            There are currently no properties to display. Please check back later or contact us directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      <div className="fixed inset-0 bg-white -z-10" aria-hidden="true"></div>
      <Hero property={featuredProperty} onBookViewing={handleBookViewing} />
      <PropertyHighlights property={featuredProperty} />
      <PhotoCarousel property={featuredProperty} />
      <div id="contact-form">
        <ContactForm property={featuredProperty} />
      </div>
    </div>
  );
}

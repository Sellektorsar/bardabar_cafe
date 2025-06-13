import React, { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "./client/api";
import { useToast, encodeFileAsBase64DataURL } from "./lib/utils";
import {
  Menu,
  X,
  Home,
  Calendar,
  Phone,
  Info,
  User,
  Settings,
  ChevronDown,
  Upload,
  Plus,
  Trash2,
  Edit,
  Clock,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Loader2,
  Sun,
  Moon,
  Search,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "./components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Toaster } from "react-hot-toast";
import { Skeleton } from "./components/ui/skeleton";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { z } from "zod";
import { MenuItemSkeleton, EventSkeleton, NewsSkeleton, StaffSkeleton, ContactSkeleton, TableRowSkeleton } from "./components/ui/skeleton";

// Types
type MenuCategory = {
  id: string;
  name: string;
  order: number;
};

type MenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  articleCode?: string | null;
  categoryId: string;
  category: MenuCategory;
  // Used only in UI for file uploads, not persisted in backend
  imageFile?: File | null;
};

type Event = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  date: string;
  // Used only in UI for file uploads, not persisted in backend
  imageFile?: File | null;
};

type News = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  // Used only in UI for file uploads, not persisted in backend
  imageFile?: File | null;
};

type ContactRequest = {
  id: string;
  name: string;
  phone: string;
  message?: string;
  type: string;
  createdAt: string;
};

type Staff = {
  id: string;
  name: string;
  position: string;
  description?: string | null;
  imageUrl?: string | null;
  order: number;
  // Used only in UI for file uploads, not persisted in backend
  imageFile?: File | null;
};

// Theme context and toggle
const ThemeContext = React.createContext({
  theme: "light",
  setTheme: (theme: "light" | "dark") => {},
});

function useTheme() {
  return React.useContext(ThemeContext);
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    return "light";
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className="ml-2 p-2 rounded-full hover:bg-muted focus:outline-none focus:ring"
      aria-label="Переключить тему"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

// Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { data: adminStatus } = useQuery<{ isAdmin: boolean }>(
    {
      queryKey: ["adminStatus"],
      queryFn: apiClient.getAdminStatus,
    }
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Бар-да-бар</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`nav-link text-foreground hover:text-primary ${location.pathname === "/" ? "active" : ""}`}
            >
              Главная
            </Link>
            <Link
              to="/menu"
              className={`nav-link text-foreground hover:text-primary ${location.pathname === "/menu" ? "active" : ""}`}
            >
              Меню
            </Link>
            <Link
              to="/events"
              className={`nav-link text-foreground hover:text-primary ${location.pathname === "/events" ? "active" : ""}`}
            >
              Мероприятия
            </Link>
            <Link
              to="/about"
              className={`nav-link text-foreground hover:text-primary ${location.pathname === "/about" ? "active" : ""}`}
            >
              О нас
            </Link>
            <Link
              to="/contacts"
              className={`nav-link text-foreground hover:text-primary ${location.pathname === "/contacts" ? "active" : ""}`}
            >
              Контакты
            </Link>
            {adminStatus?.isAdmin && (
              <Link
                to="/admin"
                className={`nav-link text-foreground hover:text-primary ${location.pathname.startsWith("/admin") ? "active" : ""}`}
              >
                Админ
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme toggle button */}
            <ThemeToggle />
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Бар-да-бар</SheetTitle>
            <SheetDescription>
              Уютная атмосфера, изысканная кухня
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Главная</span>
            </Link>
            <Link
              to="/menu"
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Menu className="h-5 w-5" />
              <span>Меню</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Calendar className="h-5 w-5" />
              <span>Мероприятия</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Info className="h-5 w-5" />
              <span>О нас</span>
            </Link>
            <Link
              to="/contacts"
              className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Phone className="h-5 w-5" />
              <span>Контакты</span>
            </Link>
            {adminStatus?.isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md bg-muted"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Админ</span>
              </Link>
            )}
          </div>
          <SheetFooter>
            <a
              href="tel:+78452650140"
              className="flex items-center gap-2 text-foreground hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              <span>+7 (8452) 650-140</span>
            </a>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1">
            {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <img src="/images/pattern-dots.svg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
              <h3 className="text-lg font-bold mb-4">Бар-да-бар</h3>
              <p className="text-muted-foreground mb-4">
                Уютная атмосфера, изысканная кухня и незабываемые впечатления.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  className="text-foreground hover:text-primary"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com"
                  className="text-foreground hover:text-primary"
                >
                  <Facebook className="h-5 w-5" />
        </a>
      </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Контакты</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Днепропетровская улица, 2/33, Саратов</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:+78452650140" className="hover:text-primary">
                    +7 (8452) 650-140
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a
                    href="mailto:info@bar-da-bar.ru"
                    className="hover:text-primary"
                  >
                    info@bar-da-bar.ru
                  </a>
        </p>
      </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Режим работы</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Пн-Чт: 12:00 - 00:00</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Пт-Сб: 12:00 - 02:00</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Вс: 12:00 - 00:00</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Бар-да-бар. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Home Page
function HomePage() {
  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: apiClient.getEvents
  });
  const { data: news, isLoading: isNewsLoading } = useQuery({
    queryKey: ["news"],
    queryFn: apiClient.getNews
  });
  const { data: menuCategories, isLoading: isMenuCategoriesLoading } = useQuery({
    queryKey: ["menuCategories"],
    queryFn: apiClient.getMenuCategories
  });
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
    <div>
      {/* Hero Section */}
        <section className="hero-section relative h-[500px] flex items-center justify-center text-center text-[color:var(--primary-foreground)] bg-[url('/images/fade-bg.svg')] bg-top bg-no-repeat">
        <div
          className="absolute inset-0 bg-[color:var(--background)]/50 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        ></div>
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Бар-да-бар</h1>
          <p className="text-xl md:text-2xl mb-8">
            Уютная атмосфера, изысканная кухня
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/menu")}>
              Наше меню
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/contacts")}
            >
              Забронировать стол
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
        <section className="py-16 bg-background relative overflow-hidden bg-[url('/images/fade-bg.svg')] bg-bottom bg-no-repeat">
          <div className="absolute right-0 bottom-0 w-1/2 max-w-xs opacity-20 pointer-events-none select-none">
            <img src="/images/pattern-dots.svg" alt="" className="w-full h-auto" />
          </div>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">О нас</h2>
              <p className="text-muted-foreground mb-4">
                Бар-да-бар - это многозонный развлекательный комплекс,
                включающий в себя:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>Семейное кафе с детской площадкой</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>Караоке-бар с ночной дискотекой</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>Пивной ресторан/банкетный зал</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  <span>VIP-зал на 15-20 человек</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/about")}>Подробнее</Button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="Интерьер ресторана"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories Section */}
      <section className="py-16 bg-muted relative bg-[url('/images/fade-bg.svg')] bg-top bg-no-repeat">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Наше меню</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {isMenuCategoriesLoading
              ? [...Array(3)].map((_, i) => <MenuItemSkeleton key={i} />)
              : menuCategories?.map((category) => (
                <Card
                  key={category.id}
                  className="menu-item-card overflow-hidden"
                >
                  <CardHeader className="p-0">
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <img
                        src={`https://source.unsplash.com/random/300x200/?food,${category.name}`}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle>{category.name}</CardTitle>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/menu?category=${category.id}`)}
                    >
                      Смотреть блюда
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => navigate("/menu")}>Все меню</Button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      {(isEventsLoading || (events && events.length > 0)) && (
        <section className="py-16 bg-background relative overflow-hidden bg-[url('/images/fade-bg.svg')] bg-top bg-no-repeat">
          <div className="absolute left-0 top-0 w-1/2 max-w-xs opacity-20 pointer-events-none select-none">
            <img src="/images/pattern-dots.svg" alt="" className="w-full h-auto" />
          </div>
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Ближайшие мероприятия
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isEventsLoading
                ? [...Array(3)].map((_, i) => <EventSkeleton key={i} />)
                : (events ?? []).slice(0, 3).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <Card className="event-card overflow-hidden">
                      <CardHeader className="p-0">
                        <div className="h-48 bg-muted">
                          {event.imageUrl ? (
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Calendar className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <Badge className="mb-2">
                          {new Date(event.date).toLocaleDateString("ru-RU")}
                        </Badge>
                        <CardTitle className="mb-2">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
            <div className="mt-8 text-center">
              <Button onClick={() => navigate("/events")}>Все мероприятия</Button>
            </div>
          </div>
        </section>
      )}

      {/* News Section */}
      {(isNewsLoading || (news && news.length > 0)) && (
        <section className="py-16 bg-muted relative overflow-hidden bg-[url('/images/fade-bg.svg')] bg-bottom bg-no-repeat">
          <div className="absolute right-0 top-0 w-1/2 max-w-xs opacity-20 pointer-events-none select-none">
            <img src="/images/pattern-dots.svg" alt="" className="w-full h-auto" />
          </div>
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Новости</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isNewsLoading
                ? [...Array(2)].map((_, i) => <NewsSkeleton key={i} />)
                : (news ?? []).slice(0, 2).map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <Card className="news-card overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                        <div className="md:col-span-1 h-48 md:h-full bg-muted">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                              loading="lazy"
                              onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Info className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 p-6 flex flex-col">
                          <CardTitle className="mb-2">{item.title}</CardTitle>
                          <CardDescription className="mb-4 flex-grow">
                            {item.content}
                          </CardDescription>
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                        </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )}

      {/* Reservation Section */}
        <section className="py-16 bg-background relative overflow-hidden bg-[url('/images/fade-bg.svg')] bg-top bg-no-repeat">
          <div className="absolute left-0 bottom-0 w-1/2 max-w-xs opacity-20 pointer-events-none select-none">
            <img src="/images/pattern-dots.svg" alt="" className="w-full h-auto" />
          </div>
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Забронировать стол</h2>
            <p className="text-muted-foreground mb-6">
              Забронируйте стол заранее, чтобы гарантировать себе место в нашем
              ресторане.
            </p>
            <Button size="lg" onClick={() => navigate("/contacts")}>
              Забронировать
            </Button>
          </div>
        </div>
      </section>
    </div>
    </motion.div>
  );
}

// Menu Page
function MenuPage() {
  const { data: categories } = useQuery({
    queryKey: ["menuCategories"],
    queryFn: apiClient.getMenuCategories
  });
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => apiClient.getMenuItems()
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("category");
    if (categoryId) {
      setActiveCategory(categoryId);
    } else if (categories && Array.isArray(categories) && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]?.id ?? null);
    }
  }, [categories, location.search, activeCategory]);

  const filteredItems = useMemo(() => {
    let items = activeCategory && Array.isArray(menuItems)
      ? menuItems.filter((item) => item.categoryId === activeCategory)
      : menuItems && Array.isArray(menuItems)
        ? menuItems
        : [];
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) => 
          item.name.toLowerCase().includes(query) || 
          (item.description && item.description.toLowerCase().includes(query))
      );
    }
    return items;
  }, [activeCategory, menuItems, searchQuery]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Меню</h1>
        {/* Search Bar ... */}
        {/* Categories Tabs ... */}
        <Tabs
          value={activeCategory || ""}
          onValueChange={setActiveCategory}
          className="w-full mb-8"
        >
          <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start md:justify-center p-0 h-auto">
            {categories?.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-4 py-2 whitespace-nowrap"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories?.map((category) => (
            <TabsContent key={category.id} value={category.id} className="pt-6">
              <AnimatePresence mode="wait">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <div className="text-muted-foreground mb-2">Не найдено блюд, соответствующих поиску</div>
                      <Button variant="outline" onClick={() => setSearchQuery("")}>Очистить поиск</Button>
                    </div>
                  ) :
                    filteredItems?.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        <Card className="menu-item-card overflow-hidden">
                          <CardHeader className="p-0">
                            <div className="h-48 bg-muted">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                                  loading="lazy"
                                  onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                  <Menu className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <CardTitle>{item.name}</CardTitle>
                              <div className="text-lg font-bold text-primary">
                                {item.price} ₽
                              </div>
                            </div>
                            {item.articleCode && (
                              <div className="text-sm text-muted-foreground mb-2">
                                Артикул: {item.articleCode}
                              </div>
                            )}
                            <CardDescription>{item.description}</CardDescription>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  }
                </div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.div>
  );
}

// Events Page
function EventsPage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: apiClient.getEvents
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Мероприятия</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? [...Array(6)].map((_, i) => <EventSkeleton key={i} />)
          : events && Array.isArray(events) && events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Card className="event-card overflow-hidden">
            <CardHeader className="p-0">
              <div className="h-48 bg-muted">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                    loading="lazy"
                    onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Calendar className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Badge className="mb-2">
                {new Date(event.date).toLocaleDateString("ru-RU")}
              </Badge>
              <CardTitle className="mb-2">{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardContent>
          </Card>
            </motion.div>
        ))}
      </div>
      {(!isLoading && (!events || !Array.isArray(events) || events.length === 0)) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            В настоящее время нет запланированных мероприятий.
          </p>
        </div>
      )}
    </div>
    </motion.div>
  );
}

// News Page
function NewsPage() {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: apiClient.getNews
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Новости</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? [...Array(4)].map((_, i) => <NewsSkeleton key={i} />)
            : news && Array.isArray(news) && news.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Card className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                    <div className="md:col-span-1 h-48 md:h-full bg-muted">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                          loading="lazy"
                          onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Info className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 p-6 flex flex-col">
                      <CardTitle className="mb-2">{item.title}</CardTitle>
                      <CardDescription className="mb-4 flex-grow">
                        {item.content}
                      </CardDescription>
                      <div className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Staff Page
function StaffPage() {
  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ["staffMembers"],
    queryFn: apiClient.getStaffMembers
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Наша команда</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {isLoading
            ? [...Array(6)].map((_, i) => <StaffSkeleton key={i} />)
            : Array.isArray(staffMembers) && staffMembers.map((staff) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Card>
                  <CardHeader>
                    <div className="w-full h-48 rounded-full overflow-hidden mx-auto mb-4 max-w-[200px]">
                      {staff.imageUrl ? (
                        <img
                          src={staff.imageUrl}
                          alt={staff.name}
                          className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                          loading="lazy"
                          onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <User className="h-24 w-24 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-center">{staff.name}</CardTitle>
                    <CardDescription className="text-center">
                      {staff.position}
                    </CardDescription>
                    {staff.description && (
                      <p className="text-center text-muted-foreground mt-2">
                        {staff.description}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          {(!isLoading && (!staffMembers || !Array.isArray(staffMembers) || staffMembers.length === 0)) && (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">
                Информация о команде будет добавлена в ближайшее время.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// About Page
function AboutPage() {
  interface AboutContentType {
    title?: string;
    content?: string;
    advantages?: string;
  }
  const { data: staffMembers = [] } = useQuery({
    queryKey: ["staffMembers"],
    queryFn: apiClient.getStaffMembers
  });
  const { data: aboutContent = {} as AboutContentType } = useQuery({
    queryKey: ["aboutContent"],
    queryFn: apiClient.getAboutContent
  });
  const advantages =
    aboutContent && aboutContent.advantages
      ? (JSON.parse(aboutContent.advantages as string || '[]') as {
          title: string;
          description: string;
        }[])
      : ([] as { title: string; description: string }[]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {aboutContent?.title || "О нас"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Бар-да-бар</h2>
            <div
              className="text-muted-foreground mb-6"
              dangerouslySetInnerHTML={{ __html: aboutContent?.content || "" }}
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              alt="Интерьер ресторана"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Наши преимущества
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {advantages.map(
              (
                advantage: { title: string; description: string },
                index: number,
              ) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{advantage.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{advantage.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ),
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Наша команда</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {Array.isArray(staffMembers) && staffMembers.map((staff) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Card>
                  <CardHeader>
                    <div className="w-full h-48 rounded-full overflow-hidden mx-auto mb-4 max-w-[200px]">
                      {staff.imageUrl ? (
                        <img
                          src={staff.imageUrl}
                          alt={staff.name}
                          className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                          loading="lazy"
                          onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <User className="h-24 w-24 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-center">{staff.name}</CardTitle>
                    <CardDescription className="text-center">
                      {staff.position}
                    </CardDescription>
                    {staff.description && (
                      <p className="text-center text-muted-foreground mt-2">
                        {staff.description}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
            {(!staffMembers || !Array.isArray(staffMembers) || staffMembers.length === 0) && (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">
                  Информация о команде будет добавлена в ближайшее время.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Contacts Page
function ContactsPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    type: "table",
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  // ...
  // Добавляю isLoading для имитации асинхронной загрузки (можно заменить на реальный флаг при необходимости)
  const isLoading = false;
  // ...
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <section className="relative overflow-hidden bg-[url('/images/fade-bg.svg')] bg-bottom bg-no-repeat">
        <div className="absolute right-0 top-0 w-1/2 max-w-xs opacity-20 pointer-events-none select-none">
          <img src="/images/pattern-dots.svg" alt="" className="w-full h-auto" />
        </div>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Контакты</h1>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <ContactSkeleton />
              <ContactSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* ...основная разметка формы и контактов... */}
            </div>
          )}
          {/* ...остальной код страницы... */}
        </div>
      </section>
    </motion.div>
  );
}

// Admin Menu Tab
export function AdminMenuTab(): JSX.Element {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["menuCategories"],
    queryFn: apiClient.getMenuCategories
  });
  const { data: menuItems = [], isLoading: isMenuItemsLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => apiClient.getMenuItems()
  });
  const isLoading = isCategoriesLoading || isMenuItemsLoading;
  const toast = useToast();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null,
  );
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", order: 0 });
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    articleCode: "",
    imageFile: null as File | null,
  });
  const [categoryErrors, setCategoryErrors] = useState<{ name?: string }>({});
  const [menuItemErrors, setMenuItemErrors] = useState<{ name?: string; price?: string; categoryId?: string }>({});
  const [categoryOrder, setCategoryOrder] = useState<MenuCategory[]>([]);

  useEffect(() => { setCategoryOrder([]); }, []);

  useEffect(() => {
    const saved = localStorage.getItem("categoryOrder");
    if (saved && categoryOrder.length) {
      try {
        const savedIds: string[] = JSON.parse(saved);
        const ordered = [...categoryOrder].sort((a,b)=> savedIds.indexOf(a.id) - savedIds.indexOf(b.id));
        setCategoryOrder(ordered);
      } catch {}
    }
  }, [categoryOrder]);

  useEffect(() => {
    if (categoryOrder.length) {
      localStorage.setItem("categoryOrder", JSON.stringify(categoryOrder.map(c=>c.id)));
    }
  }, [categoryOrder]);

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: (data: { name: string; order: number }) => apiClient.createMenuCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuCategories"] });
      setIsAddingCategory(false);
      setNewCategory({ name: "", order: 0 });
      toast.success("Категория добавлена");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (data: { id: string; name: string; order: number }) => apiClient.updateMenuCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuCategories"] });
      setEditingCategory(null);
      toast.success("Категория обновлена");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (data: { id: string }) => apiClient.deleteMenuCategory(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuCategories"] });
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Категория удалена");
    },
  });

  // Menu item mutations
  const createMenuItemMutation = useMutation({
    mutationFn: (data: Omit<MenuItem, "id" | "category"> & { imageBase64?: string }) => {
      return apiClient.createMenuItem({
        ...data,
        description: data.description || "",
        articleCode: data.articleCode || "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      setIsAddingMenuItem(false);
      setNewMenuItem({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        articleCode: "",
        imageFile: null,
      });
      toast.success("Блюдо добавлено");
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: apiClient.updateMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      setEditingMenuItem(null);
      toast.success("Блюдо обновлено");
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: (data: { id: string }) => apiClient.deleteMenuItem(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Блюдо удалено");
    },
  });

  function validateCategory() {
    const errors: { name?: string } = {};
    if (!newCategory.name.trim()) errors.name = "Введите название";
    return errors;
  }
  function validateMenuItem() {
    const errors: { name?: string; price?: string; categoryId?: string } = {};
    if (!newMenuItem.name.trim()) errors.name = "Введите название";
    if (!newMenuItem.price || newMenuItem.price <= 0) errors.price = "Укажите цену";
    if (!newMenuItem.categoryId) errors.categoryId = "Выберите категорию";
    return errors;
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateCategoryZod(newCategory);
    setCategoryErrors(errs);
    if (Object.keys(errs).length === 0) {
    createCategoryMutation.mutate(newCategory);
    }
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      const errs = validateCategoryZod(editingCategory);
      setCategoryErrors(errs);
      if (Object.keys(errs).length === 0) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        name: editingCategory.name,
        order: editingCategory.order,
      });
      }
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить эту категорию? Все блюда в этой категории также будут удалены.",
      )
    ) {
      deleteCategoryMutation.mutate({ id });
    }
  };

  // Zod-схема для блюда
  const menuItemSchema = z.object({
    name: z.string().min(1, "Введите название"),
    price: z.number().min(1, "Укажите цену"),
    categoryId: z.string().min(1, "Выберите категорию"),
    description: z.string().optional(),
    articleCode: z.string().optional(),
    imageFile: z.any().optional(),
  });

  // Переопределяем функцию с правильными типами
  type MenuItemFormData = {
    name: string;
    description: string;
    price: number | string;  // может быть строкой из input
    categoryId: string;
    articleCode: string;
    imageFile: File | null;
  };

  function validateMenuItemZod(item: MenuItemFormData) {
    const result = menuItemSchema.safeParse({
      ...item,
      price: Number(item.price),
    });
    if (!result.success) {
      const errors: { name?: string; price?: string; categoryId?: string } = {};
      for (const err of result.error.errors) {
        if (err.path[0]) errors[err.path[0] as keyof typeof errors] = err.message;
      }
      return errors;
    }
    return {};
  }

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateMenuItemZod(newMenuItem);
    setMenuItemErrors(errors);
    if (Object.keys(errors).length === 0) {
    if (newMenuItem.imageFile) {
        const imageBase64 = await encodeFileAsBase64DataURL(newMenuItem.imageFile);
        createMenuItemMutation.mutate({ ...newMenuItem, imageBase64 });
    } else {
        createMenuItemMutation.mutate({ ...newMenuItem });
      }
    }
  };

  const handleUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMenuItem) {
      const updateData: any = {
        id: editingMenuItem.id,
        name: editingMenuItem.name,
        description: editingMenuItem.description,
        price: editingMenuItem.price,
        categoryId: editingMenuItem.categoryId,
        articleCode: editingMenuItem.articleCode,
      };
      if (editingMenuItem.imageFile) {
        updateData.imageBase64 = await encodeFileAsBase64DataURL(editingMenuItem.imageFile);
      }
      updateMenuItemMutation.mutate(updateData);
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить это блюдо?")) {
      deleteMenuItemMutation.mutate({ id });
    }
  };

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const items = Array.from(categoryOrder);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setCategoryOrder(items);
    // TODO: отправить новый порядок на сервер или сохранить локально
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {isLoading ? (
        <>
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <MenuItemSkeleton key={i} />)}
          </div>
          <div className="mb-8 grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => <TableRowSkeleton key={i} />)}
          </div>
        </>
      ) : (
        <div>
          {/* ... JSX разметка таба меню ... */}
          {/* @ts-ignore */}
          <SafeDragDropContext onDragEnd={handleDragEnd as any}>
            {/* @ts-ignore */}
            <SafeDroppable droppableId="categories">
              {(provided: DroppableProvided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {categoryOrder.map((cat, idx) => 
                    // @ts-ignore
                    (<SafeDraggable key={cat.id} draggableId={cat.id} index={idx}>
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          className={`category-card ${snapshot.isDragging ? 'shadow-lg scale-105' : ''}`}
                        >
                          <div className="flex items-center justify-between p-3 bg-card rounded-md mb-2">
                            <span className="font-medium">{cat.name}</span>
                            <span className="text-sm text-muted-foreground">{cat.order}</span>
                          </div>
                        </div>
                      )}
                    </SafeDraggable>)
                  )}
                  {provided.placeholder}
                </div>
              )}
            </SafeDroppable>
          </SafeDragDropContext>
        </div>
      )}
    </motion.div>
  );
}

// Admin Events Tab
export function AdminEventsTab(): JSX.Element {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: apiClient.getEvents
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Мероприятия</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(3)].map((_, i) => <EventSkeleton key={i} />)
            : events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Card className="event-card overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="h-48 bg-muted">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                          loading="lazy"
                          onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Calendar className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Badge className="mb-2">
                      {new Date(event.date).toLocaleDateString("ru-RU")}
                    </Badge>
                    <CardTitle className="mb-2">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
        {(!isLoading && events.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              В настоящее время нет запланированных мероприятий.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Admin News Tab
export function AdminNewsTab(): JSX.Element {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: apiClient.getNews
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Новости</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? [...Array(3)].map((_, i) => <NewsSkeleton key={i} />)
            : news && Array.isArray(news) && news.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Card className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                    <div className="md:col-span-1 h-48 md:h-full bg-muted">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                          loading="lazy"
                          onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Info className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 p-6 flex flex-col">
                      <CardTitle className="mb-2">{item.title}</CardTitle>
                      <CardDescription className="mb-4 flex-grow">
                        {item.content}
                      </CardDescription>
                      <div className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}

// Admin Staff Tab
export function AdminStaffTab(): JSX.Element {
  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ["staffMembers"],
    queryFn: apiClient.getStaffMembers
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Наша команда</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {isLoading
            ? [...Array(3)].map((_, i) => <StaffSkeleton key={i} />)
            : Array.isArray(staffMembers) && staffMembers.map((staff) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Card>
                  <CardHeader>
                    <div className="w-full h-48 rounded-full overflow-hidden mx-auto mb-4 max-w-[200px]">
                      {staff.imageUrl ? (
                        <img
                          src={staff.imageUrl}
                          alt={staff.name}
                          className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                          loading="lazy"
                          onLoad={e => e.currentTarget.classList.remove('opacity-0')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <User className="h-24 w-24 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-center">{staff.name}</CardTitle>
                    <CardDescription className="text-center">
                      {staff.position}
                    </CardDescription>
                    {staff.description && (
                      <p className="text-center text-muted-foreground mt-2">
                        {staff.description}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          {(!isLoading && (!staffMembers || !Array.isArray(staffMembers) || staffMembers.length === 0)) && (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">
                Информация о команде будет добавлена в ближайшее время.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Admin About Tab
export function AdminAboutTab(): JSX.Element {
  interface AboutContentType {
    title?: string;
    content?: string;
    advantages?: string;
  }
  const { data: aboutContent = {} as AboutContentType, isLoading } = useQuery({
    queryKey: ["aboutContent"],
    queryFn: apiClient.getAboutContent
  });
  const advantages =
    aboutContent && aboutContent.advantages
      ? (JSON.parse(aboutContent.advantages as string || '[]') as {
          title: string;
          description: string;
        }[])
      : ([] as { title: string; description: string }[]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {aboutContent?.title || "О нас"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Бар-да-бар</h2>
            <div
              className="text-muted-foreground mb-6"
              dangerouslySetInnerHTML={{ __html: aboutContent?.content || "" }}
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              alt="Интерьер ресторана"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Наши преимущества
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {isLoading
              ? [...Array(3)].map((_, i) => <NewsSkeleton key={i} />)
              : advantages.map((advantage, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{advantage.description}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Наша команда</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {isLoading
              ? [...Array(3)].map((_, i) => <StaffSkeleton key={i} />)
              : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Admin Contacts Tab
export function AdminContactsTab(): JSX.Element {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    type: "table", // table, banquet
  });

  // Имитация асинхронной загрузки (заменить на реальный флаг при необходимости)
  const isLoading = false;

  const contactMutation = useMutation({
    mutationFn: (data: typeof formData) => apiClient.submitContactRequest(data),
    onSuccess: () => {
      toast.success("Заявка отправлена. Мы свяжемся с вами в ближайшее время");
      setFormData({
        name: "",
        phone: "",
        message: "",
        type: "table",
      });
    },
    onError: () => {
      toast.error("Не удалось отправить заявку. Пожалуйста, попробуйте позже.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Контакты</h1>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <ContactSkeleton />
            <ContactSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* ...основная разметка формы и контактов... */}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Admin Login Form
function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [login, setLogin] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Заглушка: всегда успех
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 500);
  };

  return (
    <div className="container py-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Вход в панель администратора</CardTitle>
          <CardDescription>Введите логин и пароль администратора</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
              <Label htmlFor="login">Логин</Label>
          <Input
                id="login"
                value={login}
                onChange={e => setLogin(e.target.value)}
                autoComplete="username"
            required
          />
        </div>
        <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
                  <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                    required
                  />
                </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Вход...</>) : 'Войти'}
        </Button>
      </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: adminStatus, refetch: refetchAdminStatus } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["adminStatus"],
    queryFn: apiClient.getAdminStatus,
  });
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  const verifyMutation = useMutation({
    mutationFn: (data: { password: string }) => apiClient.verifyAdminPassword({ password: data.password }),
    onSuccess: (data) => {
      if (data.success) {
        setIsVerified(true);
        toast.success("Вход выполнен успешно");
      } else {
        setError("Неверный пароль. Пожалуйста, попробуйте снова.");
      }
    },
    onError: () => {
      setError("Ошибка при проверке пароля. Пожалуйста, попробуйте снова.");
    },
  });

  const setPasswordMutation = useMutation({
    mutationFn: (data: { password: string }) => apiClient.setAdminPassword({ password: data.password }) as any,
    onSuccess: () => {
      toast.success("Пароль администратора успешно обновлен");
    },
  });

  useEffect(() => {
    if (adminStatus && !adminStatus.isAdmin) {
      navigate("/");
    }
  }, [adminStatus, navigate]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate({ password });
  };

  // Добавляем logout
  const handleLogout = async () => {
    setIsVerified(false);
    setPassword("");
    refetchAdminStatus();
    toast.success("Вы вышли из админки");
  };

  if (!adminStatus?.isAdmin) {
    return <AdminLoginForm onSuccess={() => { refetchAdminStatus(); }} />;
  }

  if (!isVerified) {
  return (
      <div className="container py-8 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Вход в панель администратора</CardTitle>
            <CardDescription>
              Введите пароль для доступа к панели администратора
            </CardDescription>
            </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full"
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Проверка...
                  </>
                ) : (
                  "Войти"
                )}
              </Button>
          </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Настройки
                </Button>
              </DialogTrigger>
              <DialogContent>
          <DialogHeader>
                  <DialogTitle>Настройки администратора</DialogTitle>
          </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="admin-password">
                      Изменить пароль администратора
                    </Label>
                  <Input
                      id="admin-password"
                      type="password"
                      placeholder="Новый пароль"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                    onClick={() => {
                      if (password) {
                        setPasswordMutation.mutate({ password });
                        setPassword("");
                      }
                    }}
                    disabled={!password || setPasswordMutation.isPending}
                  >
                    {setPasswordMutation.isPending
                    ? "Сохранение..."
                      : "Сохранить пароль"}
                </Button>
              </DialogFooter>
        </DialogContent>
      </Dialog>
            <Button variant="destructive" onClick={handleLogout}>
              Выйти
            </Button>
    </div>
        </div>

        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="menu">Меню</TabsTrigger>
            <TabsTrigger value="events">Мероприятия</TabsTrigger>
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="staff">Персонал</TabsTrigger>
            <TabsTrigger value="about">О нас</TabsTrigger>
            <TabsTrigger value="contacts">Заявки</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <AdminMenuTab />
          </TabsContent>

          <TabsContent value="events">
            <AdminEventsTab />
          </TabsContent>

          <TabsContent value="news">
            <AdminNewsTab />
          </TabsContent>

          <TabsContent value="staff">
            <AdminStaffTab />
          </TabsContent>

          <TabsContent value="about">
            <AdminAboutTab />
          </TabsContent>

          <TabsContent value="contacts">
            <AdminContactsTab />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}

// Типы для DragDropContext
interface DraggableStateSnapshot {
  isDragging: boolean;
  isDropAnimating: boolean;
  dropAnimation?: any;
  draggingOver?: string;
  combineWith?: string;
  combineTargetFor?: string;
  mode?: string;
}

interface DraggableProvided {
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: Record<string, any>;
  dragHandleProps: Record<string, any> | null;
}

interface DroppableProvided {
  innerRef: (element: HTMLElement | null) => void;
  droppableProps: Record<string, any>;
  placeholder?: React.ReactElement;
}

const SafeDragDropContext = DragDropContext as unknown as React.ComponentType<any>;
const SafeDroppable = Droppable as unknown as React.ComponentType<any>;
const SafeDraggable = Draggable as unknown as React.ComponentType<any>;
const SafeToaster = Toaster as unknown as React.ComponentType<any>;

// Добавляю zod-схему для категории
const categorySchema = z.object({
  name: z.string().min(1, "Введите название"),
  order: z.number().min(0, "Порядок должен быть 0 или больше"),
});

function validateCategoryZod(cat: { name: string; order: number }) {
  const res = categorySchema.safeParse({ ...cat, order: Number(cat.order) });
  if (!res.success) {
    const errs: { name?: string } = {};
    for (const e of res.error.errors) {
      if (e.path[0]) errs[e.path[0] as keyof typeof errs] = e.message;
    }
    return errs;
  }
  return {};
}

function App() {
  return (
    <ThemeProvider>
    <Router>
        <SafeToaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
    </ThemeProvider>
  );
}

export default App;

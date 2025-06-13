import React, { useState, useEffect } from "react";
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
import { apiClient } from "~/client/api";
import { useToast } from "~/client/utils";
import { encodeFileAsBase64DataURL } from "~/client/utils";
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
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/ui";

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

// Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { data: adminStatus } = useQuery(
    ["adminStatus"],
    apiClient.getAdminStatus,
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Contact Button (Desktop) */}
          <div className="hidden md:flex">
            <a
              href="tel:+78452650140"
              className="flex items-center gap-2 text-foreground hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              <span>+7 (8452) 650-140</span>
            </a>
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
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-8">
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
  const { data: events } = useQuery(["events"], apiClient.getEvents);
  const { data: news } = useQuery(["news"], apiClient.getNews);
  const { data: menuCategories } = useQuery(
    ["menuCategories"],
    apiClient.getMenuCategories,
  );
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section relative h-[500px] flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-black/50 z-0"
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
      <section className="py-16 bg-background">
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
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Наше меню</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menuCategories?.map((category) => (
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
            <Button size="lg" onClick={() => navigate("/menu")}>
              Все меню
            </Button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      {events && events.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Ближайшие мероприятия
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => (
                <Card key={event.id} className="event-card overflow-hidden">
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
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button onClick={() => navigate("/events")}>
                Все мероприятия
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* News Section */}
      {news && news.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Новости</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.slice(0, 2).map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                    <div className="md:col-span-1 h-48 md:h-full bg-muted">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reservation Section */}
      <section className="py-16 bg-background">
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
  );
}

// Menu Page
function MenuPage() {
  const { data: categories } = useQuery(
    ["menuCategories"],
    apiClient.getMenuCategories,
  );
  const { data: menuItems } = useQuery(["menuItems"], () =>
    apiClient.getMenuItems(),
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("category");
    if (categoryId) {
      setActiveCategory(categoryId);
    } else if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]?.id ?? null);
    }
  }, [categories, location.search, activeCategory]);

  const filteredItems =
    activeCategory && Array.isArray(menuItems)
      ? menuItems.filter((item) => item.categoryId === activeCategory)
      : menuItems && Array.isArray(menuItems)
        ? menuItems
        : [];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Меню</h1>

      {/* Categories Tabs */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems?.map((item) => (
                <Card key={item.id} className="menu-item-card overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="h-48 bg-muted">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
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
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Events Page
function EventsPage() {
  const { data: events } = useQuery(["events"], apiClient.getEvents);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Мероприятия</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <Card key={event.id} className="event-card overflow-hidden">
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
        ))}
      </div>

      {(!events || events.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            В настоящее время нет запланированных мероприятий.
          </p>
        </div>
      )}
    </div>
  );
}

// About Page
function AboutPage() {
  const { data: staffMembers } = useQuery(
    ["staffMembers"],
    apiClient.getStaffMembers,
  );
  const { data: aboutContent } = useQuery(
    ["aboutContent"],
    apiClient.getAboutContent,
  );

  // Parse advantages from JSON string
  const advantages =
    aboutContent && aboutContent.advantages
      ? (JSON.parse(aboutContent.advantages) as {
          title: string;
          description: string;
        }[])
      : ([] as { title: string; description: string }[]);

  return (
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
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{advantage.description}</p>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">Наша команда</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {staffMembers?.map((staff) => (
            <Card key={staff.id}>
              <CardHeader>
                <div className="w-full h-48 rounded-full overflow-hidden mx-auto mb-4 max-w-[200px]">
                  {staff.imageUrl ? (
                    <img
                      src={staff.imageUrl}
                      alt={staff.name}
                      className="w-full h-full object-cover"
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
          ))}
          {(!staffMembers || staffMembers.length === 0) && (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">
                Информация о команде будет добавлена в ближайшее время.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Contacts Page
function ContactsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    type: "table", // table, banquet
  });

  const contactMutation = useMutation(apiClient.submitContactRequest, {
    onSuccess: () => {
      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      setFormData({
        name: "",
        phone: "",
        message: "",
        type: "table",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description:
          "Не удалось отправить заявку. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Контакты</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Наш адрес</h2>
          <p className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Днепропетровская улица, 2/33, Саратов</span>
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-8">Режим работы</h2>
          <div className="space-y-2 mb-8">
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

          <h2 className="text-2xl font-bold mb-4">Связаться с нами</h2>
          <div className="space-y-2">
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
          <Card>
            <CardHeader>
              <CardTitle>Забронировать стол или банкет</CardTitle>
              <CardDescription>
                Заполните форму, и мы свяжемся с вами для уточнения деталей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Тип бронирования</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип бронирования" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">Стол</SelectItem>
                      <SelectItem value="banquet">Банкет</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={contactMutation.isLoading}
                >
                  {contactMutation.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    "Отправить"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Как нас найти</h2>
        <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2182.3461286090635!2d46.03372687680372!3d51.53687330964048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4114c7b706144a11%3A0xd6f3c0b517b28a2c!2z0JHQsNGA0LTQsNCx0LDRgCwg0LrQsNGE0LUt0LHQsNGA!5e0!3m2!1sru!2sru!4v1684932111167!5m2!1sru!2sru"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const navigate = useNavigate();
  const { data: adminStatus } = useQuery(
    ["adminStatus"],
    apiClient.getAdminStatus,
  );
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const verifyMutation = useMutation(apiClient.verifyAdminPassword, {
    onSuccess: (data) => {
      if (data.verified) {
        setIsVerified(true);
        toast({ title: "Вход выполнен успешно" });
      } else {
        setError("Неверный пароль. Пожалуйста, попробуйте снова.");
      }
    },
    onError: () => {
      setError("Ошибка при проверке пароля. Пожалуйста, попробуйте снова.");
    },
  });

  const setPasswordMutation = useMutation(apiClient.setAdminPassword, {
    onSuccess: () => {
      toast({ title: "Пароль администратора успешно обновлен" });
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

  if (!adminStatus?.isAdmin) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Доступ запрещен</h1>
        <p className="mb-4">У вас нет прав для доступа к этой странице.</p>
        <Button onClick={() => navigate("/")}>Вернуться на главную</Button>
      </div>
    );
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full"
                disabled={verifyMutation.isLoading}
              >
                {verifyMutation.isLoading ? (
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
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
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
                  onChange={(e) => setPassword(e.target.value)}
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
                disabled={!password || setPasswordMutation.isLoading}
              >
                {setPasswordMutation.isLoading
                  ? "Сохранение..."
                  : "Сохранить пароль"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
  );
}

// Admin Menu Tab
function AdminMenuTab() {
  const queryClient = useQueryClient();
  const { data: categories } = useQuery(
    ["menuCategories"],
    apiClient.getMenuCategories,
  );
  const { data: menuItems } = useQuery(["menuItems"], () =>
    apiClient.getMenuItems(),
  );
  const { toast } = useToast();
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

  // Category mutations
  const createCategoryMutation = useMutation(apiClient.createMenuCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["menuCategories"]);
      setIsAddingCategory(false);
      setNewCategory({ name: "", order: 0 });
      toast({ title: "Категория добавлена" });
    },
  });

  const updateCategoryMutation = useMutation(apiClient.updateMenuCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["menuCategories"]);
      setEditingCategory(null);
      toast({ title: "Категория обновлена" });
    },
  });

  const deleteCategoryMutation = useMutation(apiClient.deleteMenuCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["menuCategories"]);
      queryClient.invalidateQueries(["menuItems"]);
      toast({ title: "Категория удалена" });
    },
  });

  // Menu item mutations
  const createMenuItemMutation = useMutation(apiClient.createMenuItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(["menuItems"]);
      setIsAddingMenuItem(false);
      setNewMenuItem({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        articleCode: "",
        imageFile: null,
      });
      toast({ title: "Блюдо добавлено" });
    },
  });

  const updateMenuItemMutation = useMutation(apiClient.updateMenuItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(["menuItems"]);
      setEditingMenuItem(null);
      toast({ title: "Блюдо обновлено" });
    },
  });

  const deleteMenuItemMutation = useMutation(apiClient.deleteMenuItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(["menuItems"]);
      toast({ title: "Блюдо удалено" });
    },
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(newCategory);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        name: editingCategory.name,
        order: editingCategory.order,
      });
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

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMenuItem.imageFile) {
      const imageBase64 = await encodeFileAsBase64DataURL(
        newMenuItem.imageFile,
      );
      createMenuItemMutation.mutate({
        ...newMenuItem,
        imageBase64,
      });
    } else {
      createMenuItemMutation.mutate({
        ...newMenuItem,
      });
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
        updateData.imageBase64 = await encodeFileAsBase64DataURL(
          editingMenuItem.imageFile,
        );
      }

      updateMenuItemMutation.mutate(updateData);
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить это блюдо?")) {
      deleteMenuItemMutation.mutate({ id });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление меню</h2>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Категории</h3>
          <Button onClick={() => setIsAddingCategory(true)}>
            Добавить категорию
          </Button>
        </div>

        <div className="bg-card rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Порядок</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!categories || categories.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Нет категорий
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Category Dialog */}
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить категорию</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCategory}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Порядок</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newCategory.order}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        order: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingCategory(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isLoading}
                >
                  {createCategoryMutation.isLoading
                    ? "Добавление..."
                    : "Добавить"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать категорию</DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <form onSubmit={handleUpdateCategory}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Название</Label>
                    <Input
                      id="edit-name"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-order">Порядок</Label>
                    <Input
                      id="edit-order"
                      type="number"
                      value={editingCategory.order}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          order: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingCategory(null)}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateCategoryMutation.isLoading}
                  >
                    {updateCategoryMutation.isLoading
                      ? "Сохранение..."
                      : "Сохранить"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Блюда</h3>
          <Button onClick={() => setIsAddingMenuItem(true)}>
            Добавить блюдо
          </Button>
        </div>

        <div className="bg-card rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Артикул</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(menuItems) &&
                menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category.name}</TableCell>
                    <TableCell>{item.price} ₽</TableCell>
                    <TableCell>{item.articleCode || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditingMenuItem({
                              ...item,
                              imageFile: null,
                            } as any)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteMenuItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              {(!Array.isArray(menuItems) || menuItems.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Нет блюд
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Menu Item Dialog */}
        <Dialog open={isAddingMenuItem} onOpenChange={setIsAddingMenuItem}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Добавить блюдо</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMenuItem}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Название</Label>
                  <Input
                    id="item-name"
                    value={newMenuItem.name}
                    onChange={(e) =>
                      setNewMenuItem({ ...newMenuItem, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-description">Описание</Label>
                  <Textarea
                    id="item-description"
                    value={newMenuItem.description}
                    onChange={(e) =>
                      setNewMenuItem({
                        ...newMenuItem,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-price">Цена (₽)</Label>
                  <Input
                    id="item-price"
                    type="number"
                    value={newMenuItem.price}
                    onChange={(e) =>
                      setNewMenuItem({
                        ...newMenuItem,
                        price: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-category">Категория</Label>
                  <Select
                    value={newMenuItem.categoryId}
                    onValueChange={(value) =>
                      setNewMenuItem({ ...newMenuItem, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-article">Артикул</Label>
                  <Input
                    id="item-article"
                    value={newMenuItem.articleCode}
                    onChange={(e) =>
                      setNewMenuItem({
                        ...newMenuItem,
                        articleCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-image">Изображение</Label>
                  <Input
                    id="item-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewMenuItem({
                        ...newMenuItem,
                        imageFile: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingMenuItem(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={createMenuItemMutation.isLoading}
                >
                  {createMenuItemMutation.isLoading
                    ? "Добавление..."
                    : "Добавить"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Menu Item Dialog */}
        <Dialog
          open={!!editingMenuItem}
          onOpenChange={(open) => !open && setEditingMenuItem(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Редактировать блюдо</DialogTitle>
            </DialogHeader>
            {editingMenuItem && (
              <form onSubmit={handleUpdateMenuItem}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-item-name">Название</Label>
                    <Input
                      id="edit-item-name"
                      value={editingMenuItem.name}
                      onChange={(e) =>
                        setEditingMenuItem({
                          ...editingMenuItem,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-item-description">Описание</Label>
                    <Textarea
                      id="edit-item-description"
                      value={editingMenuItem.description || ""}
                      onChange={(e) =>
                        setEditingMenuItem({
                          ...editingMenuItem,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-item-price">Цена (₽)</Label>
                    <Input
                      id="edit-item-price"
                      type="number"
                      value={editingMenuItem.price}
                      onChange={(e) =>
                        setEditingMenuItem({
                          ...editingMenuItem,
                          price: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-item-category">Категория</Label>
                    <Select
                      value={editingMenuItem.categoryId}
                      onValueChange={(value) =>
                        setEditingMenuItem({
                          ...editingMenuItem,
                          categoryId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-item-article">Артикул</Label>
                    <Input
                      id="edit-item-article"
                      value={editingMenuItem.articleCode || ""}
                      onChange={(e) =>
                        setEditingMenuItem({
                          ...editingMenuItem,
                          articleCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-item-image">Изображение</Label>
                    {editingMenuItem.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={editingMenuItem.imageUrl}
                          alt={editingMenuItem.name}
                          className="h-24 w-auto object-cover rounded-md"
                        />
                      </div>
                    )}
                    <Input
                      id="edit-item-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditingMenuItem({
                          ...editingMenuItem,
                          imageFile: e.target.files?.[0] || null,
                        } as any)
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingMenuItem(null)}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMenuItemMutation.isLoading}
                  >
                    {updateMenuItemMutation.isLoading
                      ? "Сохранение..."
                      : "Сохранить"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Admin Events Tab
function AdminEventsTab() {
  const queryClient = useQueryClient();
  const { data: events } = useQuery(["events"], apiClient.getEvents);
  const { toast } = useToast();
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    imageFile: null as File | null,
  });

  const createEventMutation = useMutation(apiClient.createEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      setIsAddingEvent(false);
      setNewEvent({
        title: "",
        description: "",
        date: "",
        imageFile: null,
      });
      toast({ title: "Мероприятие добавлено" });
    },
  });

  const updateEventMutation = useMutation(apiClient.updateEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      setEditingEvent(null);
      toast({ title: "Мероприятие обновлено" });
    },
  });

  const deleteEventMutation = useMutation(apiClient.deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      toast({ title: "Мероприятие удалено" });
    },
  });

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData: any = {
      title: newEvent.title,
      description: newEvent.description,
      date: new Date(newEvent.date),
    };

    if (newEvent.imageFile) {
      eventData.imageBase64 = await encodeFileAsBase64DataURL(
        newEvent.imageFile,
      );
    }

    createEventMutation.mutate(eventData);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      const updateData: any = {
        id: editingEvent.id,
        title: editingEvent.title,
        description: editingEvent.description,
        date: new Date(editingEvent.date),
      };

      if (editingEvent.imageFile) {
        updateData.imageBase64 = await encodeFileAsBase64DataURL(
          editingEvent.imageFile,
        );
      }

      updateEventMutation.mutate(updateData);
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить это мероприятие?")) {
      deleteEventMutation.mutate({ id });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление мероприятиями</h2>
        <Button onClick={() => setIsAddingEvent(true)}>
          Добавить мероприятие
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events?.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {event.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingEvent({ ...event, imageFile: null } as any)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!events || events.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Нет мероприятий
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить мероприятие</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEvent}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Название</Label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description">Описание</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-date">Дата</Label>
                <Input
                  id="event-date"
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-image">Изображение</Label>
                <Input
                  id="event-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      imageFile: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingEvent(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={createEventMutation.isLoading}>
                {createEventMutation.isLoading ? "Добавление..." : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog
        open={!!editingEvent}
        onOpenChange={(open) => !open && setEditingEvent(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать мероприятие</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <form onSubmit={handleUpdateEvent}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-event-title">Название</Label>
                  <Input
                    id="edit-event-title"
                    value={editingEvent.title}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-description">Описание</Label>
                  <Textarea
                    id="edit-event-description"
                    value={editingEvent.description || ""}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-date">Дата</Label>
                  <Input
                    id="edit-event-date"
                    type="datetime-local"
                    value={new Date(editingEvent.date)
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-image">Изображение</Label>
                  {editingEvent.imageUrl && (
                    <div className="mb-2">
                      <img
                        src={editingEvent.imageUrl}
                        alt={editingEvent.title}
                        className="h-24 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                  <Input
                    id="edit-event-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        imageFile: e.target.files?.[0] || null,
                      } as any)
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingEvent(null)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={updateEventMutation.isLoading}>
                  {updateEventMutation.isLoading
                    ? "Сохранение..."
                    : "Сохранить"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Admin News Tab
function AdminNewsTab() {
  const queryClient = useQueryClient();
  const { data: news } = useQuery(["news"], apiClient.getNews);
  const { toast } = useToast();
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [newNewsItem, setNewNewsItem] = useState({
    title: "",
    content: "",
    imageFile: null as File | null,
  });

  const createNewsMutation = useMutation(apiClient.createNews, {
    onSuccess: () => {
      queryClient.invalidateQueries(["news"]);
      setIsAddingNews(false);
      setNewNewsItem({
        title: "",
        content: "",
        imageFile: null,
      });
      toast({ title: "Новость добавлена" });
    },
  });

  const updateNewsMutation = useMutation(apiClient.updateNews, {
    onSuccess: () => {
      queryClient.invalidateQueries(["news"]);
      setEditingNews(null);
      toast({ title: "Новость обновлена" });
    },
  });

  const deleteNewsMutation = useMutation(apiClient.deleteNews, {
    onSuccess: () => {
      queryClient.invalidateQueries(["news"]);
      toast({ title: "Новость удалена" });
    },
  });

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();

    const newsData: any = {
      title: newNewsItem.title,
      content: newNewsItem.content,
    };

    if (newNewsItem.imageFile) {
      newsData.imageBase64 = await encodeFileAsBase64DataURL(
        newNewsItem.imageFile,
      );
    }

    createNewsMutation.mutate(newsData);
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNews) {
      const updateData: any = {
        id: editingNews.id,
        title: editingNews.title,
        content: editingNews.content,
      };

      if (editingNews.imageFile) {
        updateData.imageBase64 = await encodeFileAsBase64DataURL(
          editingNews.imageFile,
        );
      }

      updateNewsMutation.mutate(updateData);
    }
  };

  const handleDeleteNews = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту новость?")) {
      deleteNewsMutation.mutate({ id });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление новостями</h2>
        <Button onClick={() => setIsAddingNews(true)}>Добавить новость</Button>
      </div>

      <div className="bg-card rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Заголовок</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Содержание</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {item.content}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingNews({ ...item, imageFile: null } as any)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteNews(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!news || news.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Нет новостей
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add News Dialog */}
      <Dialog open={isAddingNews} onOpenChange={setIsAddingNews}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить новость</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddNews}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="news-title">Заголовок</Label>
                <Input
                  id="news-title"
                  value={newNewsItem.title}
                  onChange={(e) =>
                    setNewNewsItem({ ...newNewsItem, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-content">Содержание</Label>
                <Textarea
                  id="news-content"
                  value={newNewsItem.content}
                  onChange={(e) =>
                    setNewNewsItem({ ...newNewsItem, content: e.target.value })
                  }
                  rows={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-image">Изображение</Label>
                <Input
                  id="news-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewNewsItem({
                      ...newNewsItem,
                      imageFile: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingNews(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={createNewsMutation.isLoading}>
                {createNewsMutation.isLoading ? "Добавление..." : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit News Dialog */}
      <Dialog
        open={!!editingNews}
        onOpenChange={(open) => !open && setEditingNews(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать новость</DialogTitle>
          </DialogHeader>
          {editingNews && (
            <form onSubmit={handleUpdateNews}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-news-title">Заголовок</Label>
                  <Input
                    id="edit-news-title"
                    value={editingNews.title}
                    onChange={(e) =>
                      setEditingNews({ ...editingNews, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-news-content">Содержание</Label>
                  <Textarea
                    id="edit-news-content"
                    value={editingNews.content}
                    onChange={(e) =>
                      setEditingNews({
                        ...editingNews,
                        content: e.target.value,
                      })
                    }
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-news-image">Изображение</Label>
                  {editingNews.imageUrl && (
                    <div className="mb-2">
                      <img
                        src={editingNews.imageUrl}
                        alt={editingNews.title}
                        className="h-24 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                  <Input
                    id="edit-news-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditingNews({
                        ...editingNews,
                        imageFile: e.target.files?.[0] || null,
                      } as any)
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingNews(null)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={updateNewsMutation.isLoading}>
                  {updateNewsMutation.isLoading ? "Сохранение..." : "Сохранить"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Admin Contacts Tab
function AdminContactsTab() {
  const { data: contactRequests } = useQuery(
    ["contactRequests"],
    apiClient.getContactRequests,
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Заявки на бронирование</h2>
      </div>

      <div className="bg-card rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Сообщение</TableHead>
              <TableHead>Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactRequests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.phone}</TableCell>
                <TableCell>
                  {request.type === "table"
                    ? "Стол"
                    : request.type === "banquet"
                      ? "Банкет"
                      : request.type}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {request.message || "-"}
                </TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString("ru-RU")}
                </TableCell>
              </TableRow>
            ))}
            {(!contactRequests || contactRequests.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Нет заявок
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Admin About Tab
function AdminAboutTab() {
  const queryClient = useQueryClient();
  const { data: aboutContent } = useQuery(
    ["aboutContent"],
    apiClient.getAboutContent,
  );
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    advantages: [] as { title: string; description: string }[],
  });

  // Initialize form data when aboutContent is loaded
  useEffect(() => {
    if (aboutContent) {
      setFormData({
        title: aboutContent.title || "О нас",
        content: aboutContent.content || "",
        advantages: aboutContent.advantages
          ? (JSON.parse(aboutContent.advantages) as {
              title: string;
              description: string;
            }[])
          : ([] as { title: string; description: string }[]),
      });
    }
  }, [aboutContent]);

  const updateAboutMutation = useMutation(apiClient.updateAboutContent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["aboutContent"]);
      toast({ title: "Информация обновлена" });
    },
    onError: () => {
      toast({ title: "Ошибка при обновлении", variant: "destructive" });
    },
  });

  const handleAddAdvantage = () => {
    setFormData({
      ...formData,
      advantages: [...formData.advantages, { title: "", description: "" }],
    });
  };

  const handleRemoveAdvantage = (index: number) => {
    const newAdvantages = [...formData.advantages];
    newAdvantages.splice(index, 1);
    setFormData({ ...formData, advantages: newAdvantages });
  };

  const handleAdvantageChange = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    const newAdvantages = [...formData.advantages];
    const advantage = newAdvantages[index];
    if (!advantage) return;
    advantage[field] = value;
    setFormData({ ...formData, advantages: newAdvantages });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutMutation.mutate({
      title: formData.title,
      content: formData.content,
      advantages: JSON.stringify(formData.advantages),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Редактирование раздела "О нас"</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Заголовок</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Основной текст (поддерживает HTML)</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={10}
            required
          />
          <div className="text-sm text-muted-foreground">
            Вы можете использовать HTML-теги для форматирования текста.
            Например, &lt;p&gt; для абзацев, &lt;ul&gt; и &lt;li&gt; для
            списков.
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Наши преимущества</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAdvantage}
            >
              <Plus className="h-4 w-4 mr-2" /> Добавить преимущество
            </Button>
          </div>

          {formData.advantages.map((advantage, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">
                  Преимущество {index + 1}
                </h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveAdvantage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`advantage-title-${index}`}>Заголовок</Label>
                  <Input
                    id={`advantage-title-${index}`}
                    value={advantage.title}
                    onChange={(e) =>
                      handleAdvantageChange(index, "title", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`advantage-description-${index}`}>
                    Описание
                  </Label>
                  <Textarea
                    id={`advantage-description-${index}`}
                    value={advantage.description}
                    onChange={(e) =>
                      handleAdvantageChange(
                        index,
                        "description",
                        e.target.value,
                      )
                    }
                    rows={3}
                    required
                  />
                </div>
              </div>
            </Card>
          ))}

          {formData.advantages.length === 0 && (
            <div className="text-center py-8 bg-muted rounded-lg">
              <p className="text-muted-foreground">
                Нет добавленных преимуществ
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleAddAdvantage}
              >
                <Plus className="h-4 w-4 mr-2" /> Добавить преимущество
              </Button>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={updateAboutMutation.isLoading}
        >
          {updateAboutMutation.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            "Сохранить изменения"
          )}
        </Button>
      </form>
    </div>
  );
}

// Admin Staff Tab
function AdminStaffTab() {
  const queryClient = useQueryClient();
  const { data: staffMembers } = useQuery(
    ["staffMembers"],
    apiClient.getStaffMembers,
  );
  const { toast } = useToast();
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [newStaffMember, setNewStaffMember] = useState({
    name: "",
    position: "",
    description: "",
    order: 0,
    imageFile: null as File | null,
  });

  const createStaffMutation = useMutation(apiClient.createStaffMember, {
    onSuccess: () => {
      queryClient.invalidateQueries(["staffMembers"]);
      setIsAddingStaff(false);
      setNewStaffMember({
        name: "",
        position: "",
        description: "",
        order: 0,
        imageFile: null,
      });
      toast({ title: "Сотрудник добавлен" });
    },
  });

  const updateStaffMutation = useMutation(apiClient.updateStaffMember, {
    onSuccess: () => {
      queryClient.invalidateQueries(["staffMembers"]);
      setEditingStaff(null);
      toast({ title: "Информация о сотруднике обновлена" });
    },
  });

  const deleteStaffMutation = useMutation(apiClient.deleteStaffMember, {
    onSuccess: () => {
      queryClient.invalidateQueries(["staffMembers"]);
      toast({ title: "Сотрудник удален" });
    },
  });

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    const staffData: any = {
      name: newStaffMember.name,
      position: newStaffMember.position,
      description: newStaffMember.description,
      order: newStaffMember.order,
    };

    if (newStaffMember.imageFile) {
      staffData.imageBase64 = await encodeFileAsBase64DataURL(
        newStaffMember.imageFile,
      );
    }

    createStaffMutation.mutate(staffData);
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      const updateData: any = {
        id: editingStaff.id,
        name: editingStaff.name,
        position: editingStaff.position,
        description: editingStaff.description,
        order: editingStaff.order,
      };

      if (editingStaff.imageFile) {
        updateData.imageBase64 = await encodeFileAsBase64DataURL(
          editingStaff.imageFile,
        );
      }

      updateStaffMutation.mutate(updateData);
    }
  };

  const handleDeleteStaff = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этого сотрудника?")) {
      deleteStaffMutation.mutate({ id });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление персоналом</h2>
        <Button onClick={() => setIsAddingStaff(true)}>
          Добавить сотрудника
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staffMembers?.map((staff) => (
          <Card key={staff.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="h-48 bg-muted">
                {staff.imageUrl ? (
                  <img
                    src={staff.imageUrl}
                    alt={staff.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="mb-2">{staff.name}</CardTitle>
              <div className="text-sm text-muted-foreground mb-2">
                {staff.position}
              </div>
              <CardDescription>{staff.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingStaff({ ...staff, imageFile: null })}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteStaff(staff.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {(!staffMembers || staffMembers.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Нет добавленных сотрудников</p>
        </div>
      )}

      {/* Add Staff Dialog */}
      <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить сотрудника</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStaff}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="staff-name">Имя</Label>
                <Input
                  id="staff-name"
                  value={newStaffMember.name}
                  onChange={(e) =>
                    setNewStaffMember({
                      ...newStaffMember,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-position">Должность</Label>
                <Input
                  id="staff-position"
                  value={newStaffMember.position}
                  onChange={(e) =>
                    setNewStaffMember({
                      ...newStaffMember,
                      position: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-description">Описание</Label>
                <Textarea
                  id="staff-description"
                  value={newStaffMember.description}
                  onChange={(e) =>
                    setNewStaffMember({
                      ...newStaffMember,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-order">Порядок</Label>
                <Input
                  id="staff-order"
                  type="number"
                  value={newStaffMember.order}
                  onChange={(e) =>
                    setNewStaffMember({
                      ...newStaffMember,
                      order: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-image">Фото</Label>
                <Input
                  id="staff-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewStaffMember({
                      ...newStaffMember,
                      imageFile: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingStaff(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={createStaffMutation.isLoading}>
                {createStaffMutation.isLoading ? "Добавление..." : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog
        open={!!editingStaff}
        onOpenChange={(open) => !open && setEditingStaff(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать информацию о сотруднике</DialogTitle>
          </DialogHeader>
          {editingStaff && (
            <form onSubmit={handleUpdateStaff}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-staff-name">Имя</Label>
                  <Input
                    id="edit-staff-name"
                    value={editingStaff.name}
                    onChange={(e) =>
                      setEditingStaff({ ...editingStaff, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-staff-position">Должность</Label>
                  <Input
                    id="edit-staff-position"
                    value={editingStaff.position}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        position: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-staff-description">Описание</Label>
                  <Textarea
                    id="edit-staff-description"
                    value={editingStaff.description || ""}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-staff-order">Порядок</Label>
                  <Input
                    id="edit-staff-order"
                    type="number"
                    value={editingStaff.order}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        order: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-staff-image">Фото</Label>
                  {editingStaff.imageUrl && (
                    <div className="mb-2">
                      <img
                        src={editingStaff.imageUrl}
                        alt={editingStaff.name}
                        className="h-24 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                  <Input
                    id="edit-staff-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        imageFile: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingStaff(null)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={updateStaffMutation.isLoading}>
                  {updateStaffMutation.isLoading
                    ? "Сохранение..."
                    : "Сохранить"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <Router>
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
  );
}

import { db } from './db';
import { getAuth, upload } from './actions';
import { z } from 'zod';

// Admin functions
export async function _resetAdminPassword() {
  // Find existing credentials or create new ones
  const credentials = await db.adminCredentials.findFirst();

  if (credentials) {
    // Update existing credentials
    await db.adminCredentials.update({
      where: { id: credentials.id },
      data: { password: "admin123" },
    });
  } else {
    // Create new credentials
    await db.adminCredentials.create({
      data: { password: "admin123" },
    });
  }

  return { success: true, message: "Admin password reset to 'admin123'" };
}

export async function _makeUserAdmin() {
  const { userId } = await getAuth({ required: true });
  if (!userId) throw new Error("Unauthorized");

  // Set default admin password if it doesn't exist
  const credentials = await db.adminCredentials.findFirst();
  if (!credentials) {
    await db.adminCredentials.create({
      data: { password: "admin123" }, // Default password
    });
  }

  return await db.user.upsert({
    where: { id: userId },
    update: { isAdmin: true },
    create: { id: userId, isAdmin: true },
  });
}

export async function getAdminStatus() {
  const { userId, status } = await getAuth({ required: false });
  if (status !== "authenticated" || !userId) return { isAdmin: false };

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  return { isAdmin: user?.isAdmin || false };
}

export async function ensureAdminAccess() {
  const { userId } = await getAuth({ required: true });
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user?.isAdmin) throw new Error("Unauthorized: Admin access required");
  return { success: true };
}

// Menu Categories
export async function getMenuCategories() {
  return await db.menuCategory.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createMenuCategory(input: {
  name: string;
  order?: number;
}) {
  await ensureAdminAccess();
  return await db.menuCategory.create({
    data: input,
  });
}

export async function updateMenuCategory(input: {
  id: string;
  name?: string;
  order?: number;
}) {
  await ensureAdminAccess();
  const { id, ...data } = input;
  return await db.menuCategory.update({
    where: { id },
    data,
  });
}

export async function deleteMenuCategory(input: { id: string }) {
  await ensureAdminAccess();
  return await db.menuCategory.delete({
    where: { id: input.id },
  });
}

// Menu Items
export async function getMenuItems(input?: { categoryId?: string }) {
  if (input?.categoryId) {
    return await db.menuItem.findMany({
      where: { categoryId: input.categoryId },
      orderBy: { name: "asc" },
      include: { category: true },
    });
  }
  return await db.menuItem.findMany({
    orderBy: { name: "asc" },
    include: { category: true },
  });
}

export async function createMenuItem(input: {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  articleCode?: string;
  imageBase64?: string;
}) {
  await ensureAdminAccess();

  const { imageBase64, ...data } = input;

  let imageUrl;
  if (imageBase64) {
    imageUrl = await upload({
      bufferOrBase64: imageBase64,
      fileName: `menu-items/${Date.now()}-${input.name.replace(/\s+/g, "-").toLowerCase()}.jpg`,
    });
  }

  return await db.menuItem.create({
    data: {
      ...data,
      imageUrl,
    },
  });
}

export async function updateMenuItem(input: {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  articleCode?: string;
  imageBase64?: string;
}) {
  await ensureAdminAccess();

  const { id, imageBase64, ...data } = input;

  let imageUrl;
  if (imageBase64) {
    imageUrl = await upload({
      bufferOrBase64: imageBase64,
      fileName: `menu-items/${Date.now()}-${input.name || "item"}.jpg`,
    });
    (data as any).imageUrl = imageUrl;
  }

  return await db.menuItem.update({
    where: { id },
    data,
  });
}

export async function deleteMenuItem(input: { id: string }) {
  await ensureAdminAccess();
  return await db.menuItem.delete({
    where: { id: input.id },
  });
}

// Events
export async function getEvents() {
  return await db.event.findMany({
    orderBy: { date: "asc" },
  });
}

export async function createEvent(input: {
  title: string;
  description?: string;
  date: Date;
  imageBase64?: string;
}) {
  await ensureAdminAccess();

  const { imageBase64, ...data } = input;

  let imageUrl;
  if (imageBase64) {
    imageUrl = await upload({
      bufferOrBase64: imageBase64,
      fileName: `events/${Date.now()}-${input.title.replace(/\s+/g, "-").toLowerCase()}.jpg`,
    });
  }

  return await db.event.create({
    data: {
      ...data,
      imageUrl,
    },
  });
}

export async function updateEvent(input: {
  id: string;
  title?: string;
  description?: string;
  date?: Date;
  imageBase64?: string;
}) {
  await ensureAdminAccess();

  const { id, imageBase64, ...data } = input;

  let imageUrl;
  if (imageBase64) {
    imageUrl = await upload({
      bufferOrBase64: imageBase64,
      fileName: `events/${Date.now()}-${input.title || "event"}.jpg`,
    });
    (data as any).imageUrl = imageUrl;
  }

  return await db.event.update({
    where: { id },
    data,
  });
}

export async function deleteEvent(input: { id: string }) {
  await ensureAdminAccess();
  return await db.event.delete({
    where: { id: input.id },
  });
}

// News
export async function getNews() {
  return await db.news.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createNews(input: {
  title: string;
  content: string;
  imageBase64?: string;
}) {
  await ensureAdminAccess();

  const { imageBase64, ...data } = input;

  let imageUrl;
  if (imageBase64) {
    imageUrl = await upload({
      bufferOrBase64: imageBase64,
      fileName: `news/${Date.now()}-${input.title.replace(/\s+/g, "-").toLowerCase()}.jpg`,
    });
  }

  return await db.news.create({
    data: {
      ...data,
      imageUrl,
    },
  });
}

export async function updateNews(input: {
  id: string;
  title?: string;
  content?: string;
  imageBase64?: string;
}) {
  await ensureAdminAccess();

  const { id, imageBase64, ...data } = input;

  let imageUrl;
  if (imageBase64) {
    imageUrl = await upload({
      bufferOrBase64: imageBase64,
      fileName: `news/${Date.now()}-${input.title || "news"}.jpg`,
    });
    (data as any).imageUrl = imageUrl;
  }

  return await db.news.update({
    where: { id },
    data,
  });
}

export async function deleteNews(input: { id: string }) {
  await ensureAdminAccess();
  return await db.news.delete({
    where: { id: input.id },
  });
}

// Contact Requests
export async function submitContactRequest(input: {
  name: string;
  phone: string;
  message?: string;
  type: string;
}) {
  return await db.contactRequest.create({
    data: input,
  });
}

export async function getContactRequests() {
  await ensureAdminAccess();
  return await db.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Staff
export async function getStaffMembers() {
  return await db.staff.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createStaffMember(input: {
  name: string;
  position: string;
  description?: string;
  order?: number;
  imageBase64?: string;
}) {
  await ensureAdminAccess();

  const { imageBase64, ...data } = input;

  let imageUrl;
  if (imageBase64) {
    imageUrl = await upload({
      bufferOrBase64: imageBase64,
      fileName: `staff/${Date.now()}-${input.name.replace(/\s+/g, "-").toLowerCase()}.jpg`,
    });
  }

  return await db.staff.create({
    data: {
      ...data,
      imageUrl,
    },
  });
}

export async function updateStaffMember(input: {
  id: string;
  name?: string;
  position?: string;
  description?: string;
  order?: number;
  imageBase64?: string;
}) {
  await ensureAdminAccess();

  const { id, imageBase64, ...data } = input;

  let imageUrl;
  if (imageBase64) {
    imageUrl = await upload({
      bufferOrBase64: imageBase64,
      fileName: `staff/${Date.now()}-${input.name || "staff"}.jpg`,
    });
    (data as any).imageUrl = imageUrl;
  }

  return await db.staff.update({
    where: { id },
    data,
  });
}

export async function deleteStaffMember(input: { id: string }) {
  await ensureAdminAccess();
  return await db.staff.delete({
    where: { id: input.id },
  });
}

// Admin Password
export async function setAdminPassword(input: { password: string }) {
  await ensureAdminAccess();

  // Find existing credentials or create new ones
  const credentials = await db.adminCredentials.findFirst();

  if (credentials) {
    // Update existing credentials
    return await db.adminCredentials.update({
      where: { id: credentials.id },
      data: { password: input.password },
    });
  } else {
    // Create new credentials
    return await db.adminCredentials.create({
      data: { password: input.password },
    });
  }
}

export async function verifyAdminPassword(input: { password: string }) {
  const credentials = await db.adminCredentials.findFirst();
  if (!credentials) {
    throw new Error("Admin credentials not found");
  }

  return { success: credentials.password === input.password };
}

// About Content
export async function getAboutContent() {
  // Try to find existing content
  const content = await db.aboutContent.findUnique({
    where: { id: "about" },
  });

  if (content) {
    // Parse advantages JSON
    try {
      const advantages = JSON.parse(content.advantages);
      return {
        ...content,
        advantages,
      };
    } catch (e) {
      // If JSON parsing fails, return empty array
      return {
        ...content,
        advantages: [],
      };
    }
  }

  // If no content found, create default content
  const defaultContent = await db.aboutContent.create({
    data: {
      title: "О нас",
      content: "Добро пожаловать в кафе Бар-да-бар!",
      advantages: "[]",
    },
  });

  return {
    ...defaultContent,
    advantages: [],
  };
}

export async function updateAboutContent(input: {
  title?: string;
  content: string;
  advantages: string; // JSON string of advantages array
}) {
  await ensureAdminAccess();

  // Try to parse advantages to validate JSON
  try {
    JSON.parse(input.advantages);
  } catch (e) {
    throw new Error("Invalid advantages JSON");
  }

  // Update or create about content
  return await db.aboutContent.upsert({
    where: { id: "about" },
    update: input,
    create: {
      id: "about",
      ...input,
    },
  });
}

// Seed functions for development
export async function _seedAboutContent() {
  await ensureAdminAccess();

  const advantages = [
    {
      title: "Уютная атмосфера",
      description: "Наше кафе создано для комфортного отдыха. Приятный интерьер, мягкие диваны и приглушенный свет создают особую атмосферу уюта.",
    },
    {
      title: "Вкусная еда",
      description: "Мы готовим из свежих продуктов высокого качества. Наше меню разнообразно и удовлетворит даже самых требовательных гурманов.",
    },
    {
      title: "Отличное обслуживание",
      description: "Наши официанты внимательны и дружелюбны. Мы стремимся сделать ваше пребывание в нашем кафе максимально комфортным.",
    },
    {
      title: "Живая музыка",
      description: "По выходным у нас выступают музыканты, создающие неповторимую атмосферу. Приходите насладиться хорошей музыкой и вкусной едой.",
    },
  ];

  return await db.aboutContent.upsert({
    where: { id: "about" },
    update: {
      title: "О кафе Бар-да-бар",
      content: `
# Добро пожаловать в кафе Бар-да-бар!

Мы рады приветствовать вас в нашем уютном заведении, где каждый гость становится частью нашей дружной семьи.

## Наша история

Кафе Бар-да-бар открылось в 2020 году и быстро завоевало популярность среди местных жителей и гостей города. Мы создали место, где можно вкусно поесть, выпить хороший кофе или коктейль, и просто хорошо провести время.

## Наша кухня

Мы предлагаем разнообразное меню, включающее как классические блюда русской кухни, так и популярные европейские блюда. Особое внимание мы уделяем качеству ингредиентов и мастерству приготовления.

## Мероприятия

В нашем кафе регулярно проводятся различные мероприятия: живая музыка, тематические вечера, мастер-классы и многое другое. Следите за нашей афишей, чтобы не пропустить интересные события!
      `,
      advantages: JSON.stringify(advantages),
    },
    create: {
      id: "about",
      title: "О кафе Бар-да-бар",
      content: `
# Добро пожаловать в кафе Бар-да-бар!

Мы рады приветствовать вас в нашем уютном заведении, где каждый гость становится частью нашей дружной семьи.

## Наша история

Кафе Бар-да-бар открылось в 2020 году и быстро завоевало популярность среди местных жителей и гостей города. Мы создали место, где можно вкусно поесть, выпить хороший кофе или коктейль, и просто хорошо провести время.

## Наша кухня

Мы предлагаем разнообразное меню, включающее как классические блюда русской кухни, так и популярные европейские блюда. Особое внимание мы уделяем качеству ингредиентов и мастерству приготовления.

## Мероприятия

В нашем кафе регулярно проводятся различные мероприятия: живая музыка, тематические вечера, мастер-классы и многое другое. Следите за нашей афишей, чтобы не пропустить интересные события!
      `,
      advantages: JSON.stringify(advantages),
    },
  });
}

export async function _seedStaffData() {
  await ensureAdminAccess();

  // Delete existing staff
  await db.staff.deleteMany({});

  // Create new staff members
  await db.staff.createMany({
    data: [
      {
        name: "Иван Петров",
        position: "Шеф-повар",
        description: "Опыт работы более 15 лет. Специализируется на европейской и русской кухне.",
        order: 1,
      },
      {
        name: "Мария Иванова",
        position: "Администратор",
        description: "Всегда поможет с выбором блюд и организацией мероприятий.",
        order: 2,
      },
      {
        name: "Алексей Сидоров",
        position: "Бармен",
        description: "Мастер коктейлей с опытом работы в лучших барах города.",
        order: 3,
      },
      {
        name: "Екатерина Смирнова",
        position: "Кондитер",
        description: "Создает неповторимые десерты, которые стали визитной карточкой нашего кафе.",
        order: 4,
      },
    ],
  });

  return { success: true, message: "Staff data seeded successfully" };
}

export async function _seedNewsData() {
  await ensureAdminAccess();

  // Delete existing news
  await db.news.deleteMany({});

  // Create new news items
  await db.news.createMany({
    data: [
      {
        title: "Новое летнее меню",
        content: `
# Встречайте наше новое летнее меню!

Мы рады представить вам наше обновленное меню, в котором появились легкие салаты, освежающие напитки и сезонные десерты.

## Новинки:

- Салат с арбузом и фетой
- Окрошка на квасе
- Холодный суп гаспачо
- Лимонады с сезонными ягодами
- Фруктовые сорбеты

Приходите пробовать!
        `,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        title: "Живая музыка по пятницам",
        content: `
# Живая музыка каждую пятницу!

Мы запускаем новый формат вечеров - живая музыка каждую пятницу с 19:00 до 22:00.

Приходите насладиться прекрасной музыкой в исполнении талантливых музыкантов нашего города.

Вход свободный, но рекомендуем бронировать столики заранее.
        `,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      },
      {
        title: "Мастер-класс по приготовлению пиццы",
        content: `
# Мастер-класс по приготовлению пиццы

В это воскресенье наш шеф-повар проведет мастер-класс по приготовлению настоящей итальянской пиццы.

Вы узнаете секреты приготовления идеального теста и соуса, а также сможете приготовить свою собственную пиццу.

Стоимость участия: 1500 рублей.
Количество мест ограничено, записывайтесь по телефону.
        `,
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      },
    ],
  });

  return { success: true, message: "News data seeded successfully" };
}

export async function _seedInitialData() {
  await ensureAdminAccess();

  // Create menu categories
  const categories = await db.menuCategory.createMany({
    data: [
      { name: "Закуски", order: 1 },
      { name: "Салаты", order: 2 },
      { name: "Супы", order: 3 },
      { name: "Горячие блюда", order: 4 },
      { name: "Пицца", order: 5 },
      { name: "Десерты", order: 6 },
      { name: "Напитки", order: 7 },
    ],
    skipDuplicates: true,
  });

  // Get category IDs
  const categoryMap = await db.menuCategory.findMany().then((cats) =>
    cats.reduce((acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {} as Record<string, string>)
  );

  // Create menu items
  await db.menuItem.createMany({
    data: [
      {
        name: "Брускетта с томатами",
        description: "Хрустящий багет с томатами, базиликом и оливковым маслом",
        price: 350,
        categoryId: categoryMap["Закуски"],
        articleCode: "Z001",
      },
      {
        name: "Сырная тарелка",
        description: "Ассорти из 5 видов сыра с медом и орехами",
        price: 650,
        categoryId: categoryMap["Закуски"],
        articleCode: "Z002",
      },
      {
        name: "Цезарь с курицей",
        description: "Классический салат с куриной грудкой, сыром пармезан и соусом цезарь",
        price: 450,
        categoryId: categoryMap["Салаты"],
        articleCode: "S001",
      },
      {
        name: "Греческий салат",
        description: "Свежие овощи, оливки и сыр фета с оливковым маслом",
        price: 420,
        categoryId: categoryMap["Салаты"],
        articleCode: "S002",
      },
      {
        name: "Борщ",
        description: "Традиционный борщ со сметаной и чесночными пампушками",
        price: 380,
        categoryId: categoryMap["Супы"],
        articleCode: "SP001",
      },
      {
        name: "Грибной крем-суп",
        description: "Нежный суп-пюре из белых грибов и шампиньонов",
        price: 420,
        categoryId: categoryMap["Супы"],
        articleCode: "SP002",
      },
      {
        name: "Стейк из говядины",
        description: "Стейк из мраморной говядины с овощами гриль",
        price: 950,
        categoryId: categoryMap["Горячие блюда"],
        articleCode: "G001",
      },
      {
        name: "Паста Карбонара",
        description: "Классическая итальянская паста с беконом и сыром пармезан",
        price: 520,
        categoryId: categoryMap["Горячие блюда"],
        articleCode: "G002",
      },
      {
        name: "Пицца Маргарита",
        description: "Томатный соус, моцарелла, базилик",
        price: 450,
        categoryId: categoryMap["Пицца"],
        articleCode: "P001",
      },
      {
        name: "Пицца Пепперони",
        description: "Томатный соус, моцарелла, пепперони",
        price: 520,
        categoryId: categoryMap["Пицца"],
        articleCode: "P002",
      },
      {
        name: "Тирамису",
        description: "Классический итальянский десерт с маскарпоне и кофе",
        price: 350,
        categoryId: categoryMap["Десерты"],
        articleCode: "D001",
      },
      {
        name: "Чизкейк",
        description: "Нежный чизкейк с ягодным соусом",
        price: 380,
        categoryId: categoryMap["Десерты"],
        articleCode: "D002",
      },
      {
        name: "Латте",
        description: "Кофе с молоком",
        price: 180,
        categoryId: categoryMap["Напитки"],
        articleCode: "N001",
      },
      {
        name: "Свежевыжатый апельсиновый сок",
        description: "200 мл",
        price: 250,
        categoryId: categoryMap["Напитки"],
        articleCode: "N002",
      },
    ],
    skipDuplicates: true,
  });

  // Create events
  await db.event.createMany({
    data: [
      {
        title: "Живая музыка",
        description: "Выступление джазового квартета. Начало в 19:00",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        title: "Дегустация вин",
        description: "Дегустация итальянских вин с сомелье. Начало в 18:00",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
      {
        title: "Мастер-класс по приготовлению пиццы",
        description: "Научитесь готовить настоящую итальянскую пиццу. Начало в 15:00",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      },
    ],
    skipDuplicates: true,
  });

  // Seed staff data
  await _seedStaffData();

  // Seed news data
  await _seedNewsData();

  // Seed about content
  await _seedAboutContent();

  return { success: true, message: "Initial data seeded successfully" };
} 
import { db } from "~/server/db";
import { getAuth, upload, requestMultimodalModel } from "~/server/actions";
import { z } from "zod";

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

// Staff Management
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

// Admin Authentication
export async function setAdminPassword(input: { password: string }) {
  await ensureAdminAccess();

  // Get the first admin credentials record or create one if it doesn't exist
  const credentials = await db.adminCredentials.findFirst();

  if (credentials) {
    return await db.adminCredentials.update({
      where: { id: credentials.id },
      data: { password: input.password },
    });
  } else {
    return await db.adminCredentials.create({
      data: { password: input.password },
    });
  }
}

export async function verifyAdminPassword(input: { password: string }) {
  const credentials = await db.adminCredentials.findFirst();

  if (!credentials) {
    // If no password has been set, deny access
    return { verified: false };
  }

  return { verified: credentials.password === input.password };
}

// About Content Management
export async function getAboutContent() {
  // Get the first about content record or return default content
  const aboutContent = await db.aboutContent.findFirst();

  if (!aboutContent) {
    return {
      title: "О нас",
      content:
        "Бар-да-бар - это многозонный развлекательный комплекс, включающий в себя семейное кафе с детской площадкой, караоке-бар с ночной дискотекой, пивной ресторан/банкетный зал и VIP-зал на 15-20 человек.",
      advantages: JSON.stringify([
        {
          title: "Кухня",
          description:
            "Мы предлагаем блюда европейской и итальянской кухни, включая пиццу, суши, роллы и бургеры. Также у нас есть специальное детское меню.",
        },
        {
          title: "Развлечения",
          description:
            "У нас регулярно проходят живые выступления, караоке-вечера, дискотеки и трансляции спортивных событий на большом экране.",
        },
        {
          title: "Комфорт",
          description:
            "Мы создали уютную атмосферу для отдыха с друзьями и семьей. Летняя терраса, детская площадка и VIP-зал для особых случаев.",
        },
      ]),
    };
  }

  return {
    id: aboutContent.id,
    title: aboutContent.title,
    content: aboutContent.content,
    advantages: aboutContent.advantages,
  };
}

export async function updateAboutContent(input: {
  title?: string;
  content: string;
  advantages: string; // JSON string of advantages array
}) {
  await ensureAdminAccess();

  const aboutContent = await db.aboutContent.findFirst();

  if (aboutContent) {
    return await db.aboutContent.update({
      where: { id: aboutContent.id },
      data: input,
    });
  } else {
    return await db.aboutContent.create({
      data: input,
    });
  }
}

// Seed about content
export async function _seedAboutContent() {
  // Check if about content already exists to avoid duplicates
  const existingContent = await db.aboutContent.findFirst();
  if (existingContent) {
    return {
      success: true,
      message: "About content already exists",
    };
  }

  // Create default about content
  await db.aboutContent.create({
    data: {
      title: "О нас",
      content: `<p>Бар-да-бар - это многозонный развлекательный комплекс, включающий в себя:</p>
      <ul class="space-y-2 mb-6">
        <li class="flex items-center gap-2">
          <span class="text-primary">•</span>
          <span>Семейное кафе с детской площадкой</span>
        </li>
        <li class="flex items-center gap-2">
          <span class="text-primary">•</span>
          <span>Караоке-бар с ночной дискотекой</span>
        </li>
        <li class="flex items-center gap-2">
          <span class="text-primary">•</span>
          <span>Пивной ресторан/банкетный зал</span>
        </li>
        <li class="flex items-center gap-2">
          <span class="text-primary">•</span>
          <span>VIP-зал на 15-20 человек</span>
        </li>
      </ul>
      <p>Основной зал вмещает до 110 человек и подходит для различных мероприятий, включая свадьбы, юбилеи и корпоративные вечеринки.</p>`,
      advantages: JSON.stringify([
        {
          title: "Кухня",
          description:
            "Мы предлагаем блюда европейской и итальянской кухни, включая пиццу, суши, роллы и бургеры. Также у нас есть специальное детское меню.",
        },
        {
          title: "Развлечения",
          description:
            "У нас регулярно проходят живые выступления, караоке-вечера, дискотеки и трансляции спортивных событий на большом экране.",
        },
        {
          title: "Комфорт",
          description:
            "Мы создали уютную атмосферу для отдыха с друзьями и семьей. Летняя терраса, детская площадка и VIP-зал для особых случаев.",
        },
      ]),
    },
  });

  return {
    success: true,
    message: "About content seeded successfully",
  };
}

// Seed staff data
export async function _seedStaffData() {
  // Check if staff already exists to avoid duplicates
  const existingStaff = await db.staff.findFirst();
  if (existingStaff) {
    return {
      success: true,
      message: "Staff data already exists",
    };
  }

  // Create sample staff members
  const staffMembers = [
    {
      name: "Алексей Петров",
      position: "Шеф-повар",
      description:
        "Опытный шеф-повар с более чем 15-летним стажем работы в ресторанах высокой кухни.",
      order: 1,
    },
    {
      name: "Елена Смирнова",
      position: "Управляющий",
      description:
        "Профессиональный управляющий с опытом работы в ресторанном бизнесе более 10 лет.",
      order: 2,
    },
    {
      name: "Иван Козлов",
      position: "Администратор",
      description:
        "Внимательный и дружелюбный администратор, создающий теплую атмосферу для каждого гостя.",
      order: 3,
    },
  ];

  for (const staff of staffMembers) {
    // Generate image for each staff member
    const staffImage = await requestMultimodalModel({
      system:
        "You are a helpful assistant that generates images using your image generation tool.",
      messages: [
        {
          role: "user",
          content: `Generate a professional headshot portrait of a restaurant ${staff.position.toLowerCase()} named ${staff.name}. Make it look professional and friendly.`,
        },
      ],
      returnType: z.object({
        imageUrl: z.string(),
      }),
    });

    await db.staff.create({
      data: {
        ...staff,
        imageUrl: staffImage.imageUrl,
      },
    });
  }

  return {
    success: true,
    message: "Staff data seeded successfully",
  };
}

// Seed news data
export async function _seedNewsData() {
  // Check if news already exists to avoid duplicates
  const existingNews = await db.news.findFirst();
  if (existingNews) {
    return {
      success: true,
      message: "News data already exists",
    };
  }

  // Create sample news
  const newsItems = [
    {
      title: "Обновление меню",
      content:
        "Мы рады представить вам наше обновленное меню с новыми блюдами от шеф-повара.",
    },
    {
      title: "Летняя терраса",
      content:
        "С наступлением теплых дней открывается наша уютная летняя терраса.",
    },
    {
      title: "Новые мероприятия",
      content:
        "Каждые выходные у нас проходят живые выступления музыкантов и тематические вечеринки.",
    },
  ];

  for (const news of newsItems) {
    // Generate image for each news item
    const newsImage = await requestMultimodalModel({
      system:
        "You are a helpful assistant that generates images using your image generation tool.",
      messages: [
        {
          role: "user",
          content: `Generate a high-quality image for a restaurant news post: ${news.title} - ${news.content}`,
        },
      ],
      returnType: z.object({
        imageUrl: z.string(),
      }),
    });

    await db.news.create({
      data: {
        ...news,
        imageUrl: newsImage.imageUrl,
      },
    });
  }

  return {
    success: true,
    message: "News data seeded successfully",
  };
}

// Seed data
export async function _seedInitialData() {
  // Check if categories already exist to avoid duplicates
  const existingCategories = await db.menuCategory.findFirst();
  if (existingCategories) {
    return {
      success: true,
      message: "Initial data already exists",
    };
  }

  // Generate placeholder images
  const heroImage = await requestMultimodalModel({
    system:
      "You are a helpful assistant that generates images using your image generation tool.",
    messages: [
      {
        role: "user",
        content:
          "Generate a high-quality image of a modern restaurant interior with warm lighting, wooden tables, and a bar counter. The style should be cozy yet elegant.",
      },
    ],
    returnType: z.object({
      imageUrl: z.string(),
    }),
  });

  // Create menu categories
  const categories = [
    { name: "Европейская кухня", order: 1 },
    { name: "Пицца", order: 2 },
    { name: "Суши и роллы", order: 3 },
    { name: "Бургеры", order: 4 },
    { name: "Детское меню", order: 5 },
    { name: "Напитки", order: 6 },
  ];

  for (const category of categories) {
    await db.menuCategory.create({ data: category });
  }

  // Get created categories
  const createdCategories = await db.menuCategory.findMany();

  // Create sample menu items
  const menuItems = [
    {
      name: "Цезарь с курицей",
      description:
        "Классический салат с куриной грудкой, сыром пармезан, гренками и соусом цезарь",
      price: 450,
      categoryId:
        createdCategories.find((c) => c.name === "Европейская кухня")?.id || "",
      articleCode: "01001",
    },
    {
      name: "Маргарита",
      description:
        "Классическая пицца с томатным соусом, моцареллой и базиликом",
      price: 550,
      categoryId: createdCategories.find((c) => c.name === "Пицца")?.id || "",
      articleCode: "02001",
    },
    {
      name: "Филадельфия",
      description: "Ролл с лососем, сливочным сыром и огурцом",
      price: 650,
      categoryId:
        createdCategories.find((c) => c.name === "Суши и роллы")?.id || "",
      articleCode: "03001",
    },
    {
      name: "Классический бургер",
      description: "Сочная говяжья котлета, сыр чеддер, салат, томаты, соус",
      price: 550,
      categoryId: createdCategories.find((c) => c.name === "Бургеры")?.id || "",
      articleCode: "04001",
    },
  ];

  for (const item of menuItems) {
    // Generate image for each menu item
    const menuItemImage = await requestMultimodalModel({
      system:
        "You are a helpful assistant that generates images using your image generation tool.",
      messages: [
        {
          role: "user",
          content: `Generate a high-quality image of ${item.name} - ${item.description}. Make it look appetizing and professional.`,
        },
      ],
      returnType: z.object({
        imageUrl: z.string(),
      }),
    });

    await db.menuItem.create({
      data: {
        ...item,
        imageUrl: menuItemImage.imageUrl,
      },
    });
  }

  // Create sample events
  const events = [
    {
      title: "Живая музыка",
      description: "Выступление кавер-группы с хитами всех времен",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    },
    {
      title: "Дегустация крафтового пива",
      description: "Презентация новых сортов пива нашей пивоварни",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    },
  ];

  for (const event of events) {
    // Generate image for each event
    const eventImage = await requestMultimodalModel({
      system:
        "You are a helpful assistant that generates images using your image generation tool.",
      messages: [
        {
          role: "user",
          content: `Generate a high-quality promotional image for a restaurant event: ${event.title} - ${event.description}`,
        },
      ],
      returnType: z.object({
        imageUrl: z.string(),
      }),
    });

    await db.event.create({
      data: {
        ...event,
        imageUrl: eventImage.imageUrl,
      },
    });
  }

  // Create sample news
  const newsItems = [
    {
      title: "Обновление меню",
      content:
        "Мы рады представить вам наше обновленное меню с новыми блюдами от шеф-повара.",
    },
    {
      title: "Летняя терраса",
      content:
        "С наступлением теплых дней открывается наша уютная летняя терраса.",
    },
  ];

  for (const news of newsItems) {
    // Generate image for each news item
    const newsImage = await requestMultimodalModel({
      system:
        "You are a helpful assistant that generates images using your image generation tool.",
      messages: [
        {
          role: "user",
          content: `Generate a high-quality image for a restaurant news post: ${news.title} - ${news.content}`,
        },
      ],
      returnType: z.object({
        imageUrl: z.string(),
      }),
    });

    await db.news.create({
      data: {
        ...news,
        imageUrl: newsImage.imageUrl,
      },
    });
  }

  return {
    success: true,
    message: "Initial data seeded successfully",
    heroImageUrl: heroImage.imageUrl,
  };
}

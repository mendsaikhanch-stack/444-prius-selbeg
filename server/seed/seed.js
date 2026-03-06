import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import prisma from '../config/prisma.js';

const products = [
  {name:{mn:"Hybrid батерей",en:"Hybrid Battery"},price:850000,model:"Prius 20",cat:"Батерей",rating:4.9,stock:2,cond:"used",img:"https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=400&fit=crop",emoji:"🔋",desc:{mn:"Япон задаргааны hybrid батерей",en:"Japanese hybrid battery"}},
  {name:{mn:"Hybrid батерей",en:"Hybrid Battery"},price:950000,model:"Prius 30",cat:"Батерей",rating:4.8,stock:3,cond:"used",img:"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop",emoji:"🔋",desc:{mn:"Prius 30 hybrid батерей",en:"Prius 30 hybrid battery"}},
  {name:{mn:"Инвертор",en:"Inverter"},price:450000,model:"Prius 20",cat:"Цахилгаан",rating:4.7,stock:4,cond:"used",img:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",emoji:"⚡",desc:{mn:"Инвертор, баталгаа 6 сар",en:"Inverter, 6mo warranty"}},
  {name:{mn:"Урд гупер",en:"Front Bumper"},price:120000,model:"Prius 20",cat:"Гадна детал",rating:4.5,stock:8,cond:"used",img:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop",emoji:"🚗",desc:{mn:"Урд гупер, өнгө сонголттой",en:"Front bumper, color options"}},
  {name:{mn:"Хойд гупер",en:"Rear Bumper"},price:110000,model:"Prius 30",cat:"Гадна детал",rating:4.4,stock:1,cond:"used",img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop",emoji:"🚗",desc:{mn:"Хойд гупер",en:"Rear bumper"}},
  {name:{mn:"Рулын аппарат",en:"Steering Rack"},price:280000,model:"Prius 10/11",cat:"Явах эд анги",rating:4.6,stock:3,cond:"used",img:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop",emoji:"🔧",desc:{mn:"Рулын аппарат засварласан",en:"Repaired steering rack"}},
  {name:{mn:"Амортизатор урд",en:"Front Shocks"},price:65000,model:"Prius 20",cat:"Явах эд анги",rating:4.3,stock:12,cond:"new",img:"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop",emoji:"🔩",desc:{mn:"Шинэ амортизатор, хос",en:"New shock absorbers, pair"}},
  {name:{mn:"Мотор 1NZ-FXE",en:"Engine 1NZ-FXE"},price:1200000,model:"Prius 20",cat:"Мотор",rating:4.9,stock:2,cond:"used",img:"https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&h=400&fit=crop",emoji:"⚙️",desc:{mn:"Япон мотор, 80,000км",en:"Japanese engine, 80K km"}},
  {name:{mn:"Мотор 2ZR-FXE",en:"Engine 2ZR-FXE"},price:1500000,model:"Prius 30",cat:"Мотор",rating:4.8,stock:1,cond:"used",img:"https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400&h=400&fit=crop",emoji:"⚙️",desc:{mn:"Prius 30 мотор",en:"Prius 30 engine"}},
  {name:{mn:"Агаар шүүгч",en:"Air Filter"},price:15000,model:"Prius 20",cat:"Тос/Шингэн",rating:4.2,stock:30,cond:"new",img:"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",emoji:"💨",desc:{mn:"Шинэ агаар шүүгч",en:"New air filter"}},
  {name:{mn:"Тоормосны наклад",en:"Brake Pads"},price:45000,model:"Prius 30",cat:"Явах эд анги",rating:4.5,stock:20,cond:"new",img:"https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=400&h=400&fit=crop",emoji:"🛞",desc:{mn:"Шинэ тоормосны наклад",en:"New brake pads"}},
  {name:{mn:"Толь хажуу",en:"Side Mirror"},price:55000,model:"Prius 20",cat:"Гадна детал",rating:4.3,stock:10,cond:"used",img:"https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=400&fit=crop",emoji:"🪞",desc:{mn:"Хажуу толь, цахилгаан",en:"Electric side mirror"}},
  {name:{mn:"Hybrid батерей",en:"Hybrid Battery"},price:750000,model:"Aqua",cat:"Батерей",rating:4.7,stock:2,cond:"used",img:"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop",emoji:"🔋",desc:{mn:"Aqua hybrid батерей",en:"Aqua hybrid battery"}},
  {name:{mn:"Урд фара LED",en:"LED Headlight"},price:85000,model:"Prius 30",cat:"Цахилгаан",rating:4.4,stock:6,cond:"used",img:"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop",emoji:"💡",desc:{mn:"Урд фара LED",en:"LED headlight"}},
  {name:{mn:"Мотор масло 5W-30",en:"Engine Oil 5W-30"},price:35000,model:"Prius 20",cat:"Тос/Шингэн",rating:4.6,stock:50,cond:"new",img:"https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=400&h=400&fit=crop",emoji:"🛢️",desc:{mn:"Toyota genuine 4л",en:"Toyota genuine 4L"}},
  {name:{mn:"Хаалга урд",en:"Front Door"},price:180000,model:"Prius 40/41",cat:"Гадна детал",rating:4.5,stock:2,cond:"used",img:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop",emoji:"🚪",desc:{mn:"Prius 40 хаалга",en:"Prius 40 door"}},
];

const bizSettings = {
  name:"444 Prius Сэлбэг Засвар",
  phone:"8911-2722",
  phone2:"9444-4444",
  address:"УБ хот, Энх тайваны өргөн чөлөө",
  branches:[{name:"Төв салбар",phone:"8911-2722",address:"УБ хот, Энх тайваны өргөн чөлөө"}],
  facebook:"https://www.facebook.com/444.prius.selbeg",
  instagram:"https://www.instagram.com/444.prius.selbeg",
  tiktok:"https://www.tiktok.com/@444prius",
  youtube:"https://www.youtube.com/@444prius",
  fbPixelId:"",
  fbPageId:"",
  workHours:"Даваа-Бямба: 09:00-19:00",
  bankName:"Хаан банк",
  accountNo:"5012345678",
  accountHolder:"444 Prius ХХК",
  mapEmbed:"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.5!2d106.9177!3d47.9184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96925be2b18cfb%3A0x9cfcd30e2f9c346e!2z0K3QvdGFINGC0LDQudCy0LDQvdGLINOp0YDQs9Op0L0g0YfTqdC70LnTqdOp!5e0!3m2!1smn!2smn!4v1709000000000!5m2!1smn!2smn",
  mapUrl:"https://www.google.com/maps/search/444+Prius+%D0%A1%D1%8D%D0%BB%D0%B1%D1%8D%D0%B3+%D0%97%D0%B0%D1%81%D0%B2%D0%B0%D1%80+%D0%AD%D0%BD%D1%85+%D1%82%D0%B0%D0%B9%D0%B2%D0%B0%D0%BD%D1%8B+%D3%A9%D1%80%D0%B3%D3%A9%D0%BD+%D1%87%D3%A9%D0%BB%D3%A9%D3%A9",
};

const services = [
  {key:"computerDiag",icon:"Cpu",price:"30,000₮~"},
  {key:"batteryService",icon:"Battery",price:"50,000₮~"},
  {key:"engineRepair",icon:"Wrench",price:"Үнэ тохирно"},
  {key:"suspensionRepair",icon:"Car",price:"40,000₮~"},
  {key:"acService",icon:"Filter",price:"25,000₮~"},
  {key:"oilChange",icon:"Package",price:"15,000₮~"},
  {key:"callout",icon:"Truck",price:"20,000₮~"},
  {key:"bodyRepair",icon:"Shield",price:"Үнэ тохирно"},
];

async function seed() {
  try {
    console.log('Connected to database via Prisma');

    // Clear existing data (delete dependent records first)
    await prisma.scheduledPost.deleteMany();
    await prisma.order.deleteMany();
    await Promise.all([
      prisma.user.deleteMany(),
      prisma.product.deleteMany(),
      prisma.businessSettings.deleteMany(),
      prisma.service.deleteMany(),
    ]);
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@shop.mn',
        password: hashedPassword,
        isAdmin: true,
      },
    });
    console.log('Admin user created:', admin.email);

    // Create products
    const createdProducts = [];
    for (const p of products) {
      const product = await prisma.product.create({ data: p });
      createdProducts.push(product);
    }
    console.log(`${createdProducts.length} products created`);

    // Create mock orders referencing the created products
    const mockOrders = [
      {orderId:"ORD-001",customer:"Батбаяр",phone:"9911-2233",items:[{product:createdProducts[0].id,name:createdProducts[0].name,emoji:createdProducts[0].emoji,price:createdProducts[0].price,qty:1},{product:createdProducts[2].id,name:createdProducts[2].name,emoji:createdProducts[2].emoji,price:createdProducts[2].price,qty:1}],total:900000,status:"new",date:"2026-02-25",pay:"qpay"},
      {orderId:"ORD-002",customer:"Ганбаатар",phone:"8800-1122",items:[{product:createdProducts[7].id,name:createdProducts[7].name,emoji:createdProducts[7].emoji,price:createdProducts[7].price,qty:1}],total:1200000,status:"processing",date:"2026-02-24",pay:"bank"},
      {orderId:"ORD-003",customer:"Сарангэрэл",phone:"9900-3344",items:[{product:createdProducts[9].id,name:createdProducts[9].name,emoji:createdProducts[9].emoji,price:createdProducts[9].price,qty:3}],total:245000,status:"delivered",date:"2026-02-23",pay:"cash"},
    ];
    for (const o of mockOrders) {
      await prisma.order.create({ data: o });
    }
    console.log(`${mockOrders.length} orders created`);

    // Create business settings
    await prisma.businessSettings.create({ data: bizSettings });
    console.log('Business settings created');

    // Create scheduled posts
    const scheduledPosts = [
      {productId:createdProducts[0].id,time:"09:00",status:"posted",platforms:["facebook","instagram"],date:"2026-02-27"},
      {productId:createdProducts[7].id,time:"13:00",status:"scheduled",platforms:["facebook","tiktok"],date:"2026-02-27"},
      {productId:createdProducts[1].id,time:"18:00",status:"pending",platforms:["facebook","instagram","tiktok","youtube"],date:"2026-02-27"},
      {productId:createdProducts[12].id,time:"09:00",status:"pending",platforms:["facebook","instagram"],date:"2026-02-28"},
    ];
    for (const sp of scheduledPosts) {
      await prisma.scheduledPost.create({ data: sp });
    }
    console.log(`${scheduledPosts.length} scheduled posts created`);

    // Create services
    for (const s of services) {
      await prisma.service.create({ data: s });
    }
    console.log(`${services.length} services created`);

    console.log('\nSeed completed successfully!');
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();

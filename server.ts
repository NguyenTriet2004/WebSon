import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Set up Gemini AI Client - lazy initialized
let ai: GoogleGenAI | null = null;
const initGemini = () => {
  if (!ai && process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Initialized GoogleGenAI successfully");
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
    }
  }
  return ai;
};

// Memory databases
let leads: any[] = [
  {
    id: "lead_1",
    name: "Nguyên Văn Hùng",
    phone: "0912345678",
    email: "hung.nv@gmail.com",
    service: "Sơn ngoại thất biệt thự",
    message: "Tôi có biệt thự 3 tầng tại Tp. HCM cần tư vấn sơn phủ chống thấm loại tốt và phối màu xám trắng.",
    status: "new",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "lead_2",
    name: "Lê Thị Lan",
    phone: "0987654321",
    email: "lan.le@gmail.com",
    service: "Sơn nội thất căn hộ",
    message: "Cần sơn mịn, không mùi, an toàn tuyệt đối cho trẻ nhỏ cho phòng khách và 2 phòng ngủ.",
    status: "contacted",
    createdAt: new Date(Date.now() - 3600000 * 25).toISOString()
  }
];

let orders: any[] = [
  {
    id: "ORD-9512",
    name: "Trần Anh Quốc",
    phone: "0909555111",
    email: "anhquoc@gmail.com",
    address: "Căn hộ Vinhomes Grand Park, Quận 9, TP. Thủ Đức",
    items: [
      { productId: "prod_2", productName: "Sơn ngoại thất Max Shield", quantity: 3, price: 1850000 }
    ],
    totalAmount: 5550000,
    discountAmount: 0,
    coinsUsed: 0,
    status: "processing",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "ORD-3074",
    name: "Vũ Minh Quân",
    phone: "0916777888",
    email: "minhquan@gmail.com",
    address: "Khu dân cư Him Lam, Quận 7, TP. HCM",
    items: [
      { productId: "prod_1", productName: "Sơn nội thất Pure White", quantity: 2, price: 1250000 },
      { productId: "prod_5", productName: "Sơn lót kháng kiềm Colora Primer", quantity: 1, price: 950000 }
    ],
    totalAmount: 3350000,
    discountAmount: 100000,
    coinsUsed: 0,
    couponCode: "COLORA10",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

// Colora catalog & palette details
let ColoraProducts: any[] = [
  {
    id: "prod_1",
    name: "Sơn nội thất Pure White",
    code: "CL-PW01",
    category: "interior",
    description: "Sơn nội thất siêu mịn, trắng tinh khiết, mang lại không gian sáng bóng tươi mới, độ phủ cao và dễ dàng lau chùi.",
    price: 1250000,
    unit: "Thùng 15L",
    stars: 5,
    reviews: 128,
    features: ["Không mùi", "Dễ lau chùi", "Kháng khuẩn cao"],
    badge: "Mới"
  },
  {
    id: "prod_2",
    name: "Sơn ngoại thất Max Shield",
    code: "CL-MS02",
    category: "exterior",
    description: "Sơn ngoại thất cao cấp chống thấm tuyệt đối, giảm nhiệt bề mặt tới 5 độ C, chống tia UV và bền bỉ trong 15 năm.",
    price: 1850000,
    unit: "Thùng 15L",
    stars: 5,
    reviews: 256,
    features: ["Chống thấm nước", "Chống rêu mốc", "Giảm nhiệt 5°C"],
    badge: "Bán chạy"
  },
  {
    id: "prod_3",
    name: "Sơn nội thất Super Satin",
    code: "CL-SS03",
    category: "interior",
    description: "Sơn siêu bóng ngọc trai quý phái đem đến chiều sâu phản chiếu lung linh, màng sơn mịn sờ sướng tay, kháng nước hoàn mỹ.",
    price: 1650000,
    unit: "Thùng 15L",
    stars: 5,
    reviews: 96,
    features: ["Bóng ánh ngọc trai", "Kháng bám bụi", "Màu sắc sống động"],
    badge: "Cao cấp"
  },
  {
    id: "prod_4",
    name: "Sơn sàn Epoxy Floor",
    code: "CL-EF04",
    category: "specialty",
    description: "Sơn phủ sàn công nghiệp tính năng cao chống mài mòn hóa chất, va đập mạnh, tạo độ bóng gương sang xịn mịn cho sàn xưởng.",
    price: 2350000,
    unit: "Bộ 20kg",
    stars: 5,
    reviews: 64,
    features: ["Kháng mài mòn tốt", "Bóng gương tinh tế", "Chịu tải trọng lớn"],
    badge: "Chuyên dụng"
  },
  {
    id: "prod_5",
    name: "Sơn lót kháng kiềm Colora Primer",
    code: "CL-PR05",
    category: "primer",
    description: "Sơn lót đặc dụng kháng kiềm hóa và chống muối hóa của hồ vữa tơi xốp, nâng đỡ độ bám hoàn hảo cho mọi dòng phủ.",
    price: 950000,
    unit: "Thùng 18L",
    stars: 5,
    reviews: 112,
    features: ["Kháng kiềm & muối", "Tăng độ bám 200%", "Tiết kiệm sơn phủ"]
  }
];

const ColoraColors = [
  { hex: "#FDFBF7", name: "Trắng Sữa Gió", code: "CL-1011", category: "classic", description: "Trắng mịn màng dịu ngọt, dễ phối mọi nội thất cổ điển." },
  { hex: "#F3E5D8", name: "Cát Vàng Sông Trẻ", code: "CL-1024", category: "classic", description: "Mang màu cát vàng phù sa êm đềm ấm áp, sang trọng." },
  { hex: "#CAB097", name: "Nâu Đất Sét", code: "CL-1088", category: "classic", description: "Đất sét gốm trầm, tạo sự vững vàng tin cậy cao sơn nhấn." },
  { hex: "#F4F4F5", name: "Xám Sợi Khói", code: "CL-2012", category: "modern", description: "Xám bạc nhạt như khói sớm, mang chuẩn tinh thần scandinavian." },
  { hex: "#D4D4D8", name: "Xám Sương Sớm", code: "CL-2035", category: "modern", description: "Xám trung tính thời thượng, rất sạch sẽ và hiện đại." },
  { hex: "#A1A1AA", name: "Xám Bê Tông", code: "CL-2055", category: "modern", description: "Tinh hoa tối giản bê tông xám thanh nhã, thô mộc xịn mịn." },
  { hex: "#E0F2FE", name: "Xanh Băng Tuyết", code: "CL-3012", category: "pastel", description: "Màu xanh da trời sương mờ trong vắt tạo sự thư giãn vô cực ngủ ngon." },
  { hex: "#E0F7FA", name: "Xanh Bạc Hà", code: "CL-3025", category: "pastel", description: "Bạc hà sảng khoái kích thích tư duy sáng tạo căng tràn sinh khí." },
  { hex: "#FCE7F3", name: "Hồng Pháo Hoa", code: "CL-3044", category: "pastel", description: "Hồng ngọt dịu cho bé yêu thích mộng mơ cổ tích màng bảo vệ tốt." },
  { hex: "#FEF3C7", name: "Vàng Nắng Mai", code: "CL-3066", category: "pastel", description: "Màu nắng sớm nhẹ nhàng sưởi ấm căn bếp gia đình sum vầy." },
  { hex: "#B45309", name: "Cam Đất Nung", code: "CL-4015", category: "earthy", description: "Màu gạch gốm nóng ấm kiến tạo không gian sống nhiệt đới đậm đà." },
  { hex: "#854D0E", name: "Nâu Gỗ Sồi", code: "CL-4045", category: "earthy", description: "Mang năng lượng rừng già kiêu hãnh của dòng gỗ cao cấp đắt tiền." },
  { hex: "#15803D", name: "Xanh Lá Thông", code: "CL-4068", category: "earthy", description: "Không gian chữa lành với sắc lục thông yên bình thanh tịnh màng phủ." },
  { hex: "#1E3A8A", name: "Xanh Đại Dương", code: "CL-4099", category: "earthy", description: "Sâu thẳm như đại dương bao la, nâng niu sức khỏe gia can." }
];

// Helper to provide prompt context
const SYSTEM_PROMPT = `Bạn là Chuyên gia Tư vấn Phối màu và Chăm sóc Công trình cao cấp của thương hiệu sơn nổi tiếng COLORA PAINT.
Nhiệm vụ của bạn là lắng nghe nhu cầu của khách hàng về việc sơn sửa nhà cửa, công trình, dự án và đưa ra những tư vấn chuyên nghiệp, tận tâm, mang tính thẩm mỹ và kỹ thuật cao bằng TIẾNG VIỆT.

Dưới đây là một số thông tin sản phẩm chính chủ đạo của Colora Paint mà bạn có thể gợi ý khi tư vấn:
1. Sơn nội thất Pure White (Mã CL-PW01) - Giá 1.250.000đ/Thùng 15L. Siêu mịn, trắng tinh khết, không mùi, kháng khuẩn, lau chùi dễ.
2. Sơn ngoại thất Max Shield (Mã CL-MS02) - Giá 1.850.000đ/Thùng 15L. Chống thấm tuyệt hảo, chống tia UV, phản xạ bức xạ nhiệt hạ nhiệt nhà 5 độ C, bền bỉ đến 15 năm.
3. Sơn nội thất Super Satin (Mã CL-SS03) - Giá 1.650.000đ/Thùng 15L. Siêu bóng quý phái ngọc trai, chống bám bẩn trôi cực tốt.
4. Sơn sàn Epoxy Floor (Mã CL-EF04) - Giá 2.350.000đ/Bộ 20kg. Sơn nền xưởng, garage ô tô, chống mài mòn dầu mỡ, hóa chất, bóng đẹp chịu lực.
5. Sơn lót kháng kiềm Colora Primer (Mã CL-PR05) - Giá 950.000đ/Thùng 18L. Sơn lót vô cùng quan trọng chống kiềm hóa muối hóa hồ vữa màng phủ hoàn hảo bám dính.

Dưới đây là bảng mã màu chính của Colora Paint mà bạn có thể gợi ý mã màu cụ thể:
- CL-1011 (Trắng Sữa Gió - Classic Warm, hex #FDFBF7)
- CL-1024 (Cát Vàng Sông Trẻ - Classic Warm, hex #F3E5D8)
- CL-1088 (Nâu Đất Sét - Classic Warm, hex #CAB097)
- CL-2012 (Xám Sợi Khói - Modern Neutral, hex #F4F4F5)
- CL-2035 (Xám Sương Sớm - Modern Neutral, hex #D4D4D8)
- CL-2055 (Xám Bê Tông - Modern Neutral, hex #A1A1AA)
- CL-3012 (Xanh Băng Tuyết - Peaceful Pastel, hex #E0F2FE)
- CL-3025 (Xanh Bạc Hà - Peaceful Pastel, hex #E0F7FA)
- CL-3044 (Hồng Pháo Hoa - Peaceful Pastel, hex #FCE7F3)
- CL-3066 (Vàng Nắng Mai - Peaceful Pastel, hex #FEF3C7)
- CL-4015 (Cam Đất Nung - Earthy Warmth, hex #B45309)
- CL-4045 (Nâu Gỗ Sồi - Earthy Warmth, hex #854D0E)
- CL-4068 (Xanh Lá Thông - Earthy Warmth, hex #15803D)
- CL-4099 (Xanh Đại Dương - Earthy Warmth, hex #1E3A8A)

Hãy trả lời thật súc tích, lịch lãm, dễ hiểu, sắp xếp định dạng Markdown rõ ràng, luôn dẫn chiếu đến mã sơn, mã màu Colora phù hợp và khuyên họ đăng ký thông tin tư vấn gửi form liên hệ trên website Colora Paint để nhận bản test thực địa màng sơn hoặc chiết khấu ưu đãi từ 15% - 25% cho công trình thực tế.`;

// API route 1: GET products and colors config
app.get("/api/paint-config", (req, res) => {
  res.json({
    products: ColoraProducts,
    colors: ColoraColors
  });
});

// API route 2: Contact form submission (Lead generator)
app.post("/api/contact", (req, res) => {
  const { name, phone, email, service, message, source } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: "Họ và tên và Số điện thoại là bắt buộc!" });
  }

  const newLead = {
    id: `lead_${Date.now()}`,
    name,
    phone,
    email: email || "",
    service: service || "Tư vấn chung Colora",
    message: message || "Khách yêu cầu gửi catalog màu sơn.",
    status: "new",
    source: source || "contact_form",
    createdAt: new Date().toISOString()
  };

  leads.unshift(newLead);
  res.json({ success: true, message: "Nhận yêu cầu thành công!", data: newLead });
});

// API route 3: Admin list leads for complete CRM cycle
app.get("/api/admin/leads", (req, res) => {
  res.json({ leads });
});

app.post("/api/admin/leads/update-status", (req, res) => {
  const { id, status } = req.body;
  const lead = leads.find(l => l.id === id);
  if (lead) {
    lead.status = status;
    return res.json({ success: true, lead });
  }
  res.status(404).json({ error: "Lead not found" });
});

// Admin delete a lead
app.delete("/api/admin/leads/:id", (req, res) => {
  const { id } = req.params;
  leads = leads.filter(l => l.id !== id);
  res.json({ success: true, leads });
});

// Admin list checkout orders
app.get("/api/admin/orders", (req, res) => {
  res.json({ orders });
});

// Update order flow status
app.post("/api/admin/orders/update-status", (req, res) => {
  const { id, status } = req.body;
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    return res.json({ success: true, order });
  }
  res.status(404).json({ error: "Order not found" });
});

// Admin delete an order
app.delete("/api/admin/orders/:id", (req, res) => {
  const { id } = req.params;
  orders = orders.filter(o => o.id !== id);
  res.json({ success: true, orders });
});

// Submit a new order from checkout
app.post("/api/orders", (req, res) => {
  const { name, phone, email, address, items, totalAmount, discountAmount, coinsUsed, couponCode } = req.body;
  if (!name || !phone || !address || !items || items.length === 0) {
    return res.status(400).json({ error: "Thiếu thông tin người nhận hoặc giỏ hàng hàng!" });
  }

  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    phone,
    email: email || "",
    address,
    items,
    totalAmount,
    discountAmount: discountAmount || 0,
    coinsUsed: coinsUsed || 0,
    couponCode: couponCode || undefined,
    status: "pending" as const,
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  res.json({ success: true, message: "Đặt đơn mua sơn thành công rực rỡ!", order: newOrder });
});

// CREATE a new product
app.post("/api/admin/products", (req, res) => {
  const { name, code, category, description, price, unit, features, badge, image } = req.body;
  if (!name || !code || !price) {
    return res.status(400).json({ error: "Tên, mã và giá là bắt buộc!" });
  }

  const newProd = {
    id: `prod_${Date.now()}`,
    name,
    code,
    category: category || "interior",
    description: description || "",
    price: Number(price),
    unit: unit || "Thùng 15L",
    stars: 5,
    reviews: 0,
    features: features || [],
    badge: badge || undefined,
    image: image || undefined
  };

  ColoraProducts.push(newProd);
  res.json({ success: true, products: ColoraProducts });
});

// UPDATE a product
app.put("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, code, category, description, price, unit, features, badge, image } = req.body;
  
  const prodIndex = ColoraProducts.findIndex(p => p.id === id);
  if (prodIndex !== -1) {
    ColoraProducts[prodIndex] = {
      ...ColoraProducts[prodIndex],
      name: name || ColoraProducts[prodIndex].name,
      code: code || ColoraProducts[prodIndex].code,
      category: category || ColoraProducts[prodIndex].category,
      description: description || ColoraProducts[prodIndex].description,
      price: price !== undefined ? Number(price) : ColoraProducts[prodIndex].price,
      unit: unit || ColoraProducts[prodIndex].unit,
      features: features || ColoraProducts[prodIndex].features,
      badge: badge !== undefined ? badge : ColoraProducts[prodIndex].badge,
      image: image !== undefined ? image : ColoraProducts[prodIndex].image
    };
    return res.json({ success: true, products: ColoraProducts });
  }
  res.status(404).json({ error: "Product not found" });
});

// DELETE a product
app.delete("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  ColoraProducts = ColoraProducts.filter(p => p.id !== id);
  res.json({ success: true, products: ColoraProducts });
});

// API Route 4: Paint Consultation via Google Gemini
app.post("/api/consult", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Vui lòng nhập nội dung câu hỏi!" });
  }

  const client = initGemini();
  if (!client) {
    return res.json({
       text: `**[CHẾ ĐỘ OFFLINE - CHƯA CONFIG API KEY]**\n\nChào anh/chị! Hiện tại hệ thống Trí Tuệ Nhân Tạo Colora Paint AI Consultant đang chạy ngoại tuyến (Thiếu \`GEMINI_API_KEY\` trong cấu hình panel). \n\n**Gợi ý nhanh từ chuyên gia Colora:**\n- Đối với phòng khách hiện đại: Nên chọn màu phối **CL-2012 (Xám Sợi Khói)** phối viền **CL-2035 (Xám Sương Sớm)** sẽ cực kì đón sáng sang trọng.\n- Đối với nhà hướng Tây nắng nóng: Nên sơn ngoại thất dòng **CL-MS02 Max Shield** với các gam màu sáng mát mẻ để cản nhiệt tối đa 5°C.\n- Để được giải đáp cá nhân hóa cao nhất cùng tư vấn kĩ thuật tại công trình, anh/chị đừng ngần ngại để lại thông tin tại **Form liên hệ phía dưới** hoặc nhắn điện thoại hotline Colora để chuyên viên kỹ thuật gọi hỗ trợ trong 5 phút!`
    });
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "Xin lỗi, tôi gặp chút sự cố xử lý câu hỏi. Vui lòng thử lại sau.";
    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.json({
      text: `Chào anh/chị! Colora consultant đang gặp sự cố kết nối tới màng não robot, tuy nhiên anh/chị hoàn toàn có thể tính nhanh dung lượng sơn bằng Calculator phía dưới hoặc để lại số điện thoại tại Form tư vấn để chuyên viên gọi điện trực tiếp hướng dẫn chu đáo nhất!`
    });
  }
});

// Start routing for Vite template integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();

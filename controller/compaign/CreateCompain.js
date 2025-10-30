const axios = require("axios");
const Campaign = require("../../model/campgain");

const DEVICE_ID = "7cc5f83a-dc0c-4caf-b158-363dbf1aa5cd";
const BASE_URL = "https://noti-fire.com/api";
const MAX_DAILY = 400;
const BATCH_SIZE = 20;
const DELAY = 4000;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// ⬅️ الخطوة 1: إنشاء حملة جديدة
exports.createCampaign = async (req, res) => {
  try {
    const { title,customerType , user, message, link, imageUrl } = req.body;
    
    const campaign = await Campaign.create({
      title,
      user :req.token.id,
      customerType
    //   message,
    //   link,
    //   imageUrl,
    });
    res.status(201).json({ campaignId: campaign._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⬅️ الخطوة 2: رفع العملاء
exports.addCustomers = async (req, res) => {
  try {
    const { campaignId, customers } = req.body;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    campaign.customers = customers;
    console.log("customers" , customers);
    
    campaign.totalCount = customers.length;
    await campaign.save();

    res.json({ message: "Customers added", count: customers.length  , customers:campaign.customers});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⬅️ الخطوة 3: إرسال الحملة
exports.sendCampaign = async (req, res, next) => {
  try {
    const { campaignId, message, link, imageUrl } = req.body;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // ضبط حالة الحملة
    campaign.status = "sending";
    campaign.message = message || "";
    campaign.link = link || "";
    campaign.imageUrl = imageUrl || "";
    await campaign.save();

    // نجمع الأرقام (و نطبق حد الإرسال اليومي)
    const allNumbers = campaign.customers
      .map((c) => c.phoneNumber?.toString().trim())
      .filter(Boolean)
      .slice(0, MAX_DAILY); // نطبق الحد اليومي

    console.log("📞 Total numbers to send:", allNumbers.length);

    let sentCount = 0;
    const failedNumbers = [];

    // نرسل رقم-واحد-وراء-الآخر مع DELAY بين كل رسالة
    for (let idx = 0; idx < allNumbers.length; idx++) {
      const raw = allNumbers[idx];
      // تأكد من الشكل +XXXXXXXX
      const to = raw.startsWith("+") ? raw : `+${raw}`;

      // validate basic format (يمكن تعديله حسب حاجتك)
      if (!/^\+\d{8,15}$/.test(to)) {
        console.warn(`⚠️ Skipping invalid number format: ${to}`);
        failedNumbers.push({ number: to, reason: "Invalid format" });
        // ننتظر DELAY حتى لو تخطيناه عشان ما نضغطش على API فجأة
        await sleep(DELAY);
        continue;
      }

      try {
        // حالة: صورة + لينك (نستخدم link/preview مع thumbnail = imageUrl ليظهر clickable preview)
        if (link && imageUrl) {
          await axios.post(`${BASE_URL}/send/link/preview`, {
           device_id: DEVICE_ID,
            to,
            message: message || "",
            linkPreview: {
              title: "شركة الراية للتسويق العقاري",
              body: (message || "").slice(0, 255),
              sourceUrl: link,
              thumbnailUrl: imageUrl,
              renderLargerThumbnail: true,
            },
          });
        }
        // حالة: صورة فقط
        else if (imageUrl) {
          await axios.post(`${BASE_URL}/send/media`, {
           device_id: DEVICE_ID,
            to,
            type: "image",
            mediaUrl: imageUrl,
            caption: message || "",
          });
        }
        // حالة: لينك فقط (نستخدم link/preview)
        else if (link) {
          await axios.post(`${BASE_URL}/send/link/preview`, {
            device_id: DEVICE_ID,
            to,
            message: message || "",
            linkPreview: {
              title: "عرض الرابط",
              body: (message || "").slice(0, 255),
              sourceUrl: link,
              thumbnailUrl: "https://i.postimg.cc/g0KvYfbB/Screenshot-2025-10-20-174821.png",
              renderLargerThumbnail: true,
            },
          });
        }
        // حالة: نص فقط
        else {
          await axios.post(`${BASE_URL}/send/message`, {
            device_id: DEVICE_ID,
            to,
            message: message || "",
          });
        }

        sentCount++;
        console.log(`✅ Message sent to ${to} (index ${idx + 1}/${allNumbers.length})`);
      } catch (err) {
        // سجل فشل هذا الرقم واستمر
        const status = err.response?.status;
        const errorMsg = err.response?.data?.message || err.message || "Unknown error";
        console.warn(`❌ Failed to send to ${to} (${status}): ${errorMsg}`);

        failedNumbers.push({
          number: to,
          reason: errorMsg,
          status: status || null,
        });
      }

      // دائمًا ننتظر DELAY حتى لو نجح أو فشل (حتى لا نتجاوز rate limits)
      await sleep(DELAY);
    }

    // بعد الانتهاء حدث الحملة
    campaign.sentCount = sentCount;
    campaign.failedCount = failedNumbers.length;
    campaign.failedNumbers = failedNumbers;
    campaign.status = sentCount > 0 ? "sent" : (failedNumbers.length > 0 ? "failed" : "sent");
    await campaign.save();

    return res.json({
      message: "Campaign finished",
      sentCount,
      failedCount: failedNumbers.length,
      failedNumbers,
    });
  } catch (err) {
    console.error("🔥 Campaign error:", err);
    return res.status(500).json({ error: err.message });
  }
};
exports.getAllcompain = async (req , res , next) => {
    try {
        const compains = await Campaign.find({}).sort({ createdAt: -1 }).populate("user")
        res.status(200).json({data:compains})
    } catch (error) {
        next(error)
    }
}
exports.SendWatssaoNotvcation = async (to , message) => {
  try {
    axios.post(`${BASE_URL}/send/message` , {
       device_id: DEVICE_ID,
       to ,
      message,
    })
  } catch (error) {
        console.error(error);
  }
}

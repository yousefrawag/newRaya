const axios = require("axios");
const Campaign = require("../../model/campgain");

const DEVICE_ID = "ce2cb0ab-43d1-4a20-bd6c-d67b39cb7fc3";
const BASE_URL = "https://noti-fire.com/api";
const MAX_DAILY = 400;
const BATCH_SIZE = 20;
const DELAY = 1200;

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
exports.sendCampaign = async (req, res , next) => {
  try {
    const { campaignId, message, link, imageUrl } = req.body;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    campaign.status = "sending";
    campaign.message = message
    campaign.link = link || ""
    campaign.imageUrl = imageUrl || ""
    await campaign.save();

    const allNumbers = campaign.customers.map((c) => c.phoneNumber).slice(0, MAX_DAILY);
    console.log("numbers" , allNumbers);
    
    let sentCount = 0;

    for (let i = 0; i < allNumbers.length; i += BATCH_SIZE) {
      const batch = allNumbers.slice(i, i + BATCH_SIZE);

      try {
        if (imageUrl) {
          // 🔹 حالة: صورة + نص + لينك
          for (const to of batch) {
            await axios.post(`${BASE_URL}/send/media`, {
              device_id: DEVICE_ID,
              to,
              type: "image",
              mediaUrl: imageUrl,
              caption: `${message}${link ? "\n" + link : ""}`,
            });
            sentCount++;
            await sleep(DELAY);
          }
        } else if (link) {
            console.log("link" , link);
            
          // 🔹 حالة: نص + لينك
          for (const to of batch) {
            await axios.post(`${BASE_URL}/send/link/preview`, {
              device_id: DEVICE_ID,
              to,
              message:message,
              linkPreview: {
                title: "عرض الرابط",
                body: message.slice(0, 100),
                sourceUrl: link,
                thumbnailUrl: "https://i.postimg.cc/g0KvYfbB/Screenshot-2025-10-20-174821.png",
                renderLargerThumbnail: true,
              },
            });
            sentCount++;
            await sleep(DELAY);
          }
        } else {
          // 🔹 حالة: نص فقط
          await axios.post(`${BASE_URL}/send/bulk/message`, {
            device_id: DEVICE_ID,
            message,
            numbers: batch,
          });
          sentCount += batch.length;
        }
      } catch (err) {
        console.error("❌ خطأ في batch:", err.response?.status, err.response?.data || err.message);
      }

      await sleep(DELAY);
    }

    campaign.sentCount = sentCount;
    campaign.status = "sent";
    await campaign.save();

    res.json({ message: "Campaign sent successfully ✅", sentCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.getAllcompain = async (req , res) => {
    try {
        const compains = await Campaign.find({}).sort({ createdAt: -1 }).populate("user")
        res.status(200).json({data:compains})
    } catch (error) {
        next(error)
    }
}

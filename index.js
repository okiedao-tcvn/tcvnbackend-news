const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

const token = '7168193063:AAEsdQzBqXfHh-qo4oE4YYLEI1YgV48EKzw';

const bot = new TelegramBot(token, {polling: false});

const URLNewsfeedDetails = `https://testnet.tczk.com/newsfeed/newsfeed-detail/`
// Hàm gửi tin nhắn qua Telegram
async function sendTelegramMessage(message) {
    bot.sendMessage("-1002012951362", message, {
        disable_web_page_preview: false,
        parse_mode: 'HTML'
    });
}

// Hàm lấy tin tức mới nhất từ API
async function getLatestNews() {
    const apiUrl = 'https://api.tcvn.net/api/v2/newsfeed';

    try {
        const response = await axios.get(apiUrl);
        const latestNews = response.data.data[0]; // Giả sử tin tức mới nhất nằm ở vị trí đầu tiên trong mảng
        return latestNews;
    } catch (error) {
        console.error("Error fetching latest news:", error.response.data);
        return null;
    }
}

// Hàm kiểm tra và gửi thông báo mới nhất mỗi 15 giây
async function checkAndSendNews() {
    let lastid = (await getLatestNews()).id;
    console.log("START WITH", lastid);
    setInterval(async () => {
        const latestNews = await getLatestNews();
        if (latestNews) {
            console.log(`lastnews(${new Date()})`, latestNews.id);
            if(latestNews.id != lastid){
                console.log("found lastnews", latestNews.id);
                lastid = latestNews.id;

                let message = "";

                message += `🔥 <b>Tin mới nhất</b>: ${URLNewsfeedDetails}${latestNews.slug}\n`;

                if (latestNews.tags && latestNews.tags.length > 0) {
                    const tagNames = latestNews.tags.map(tag => tag.name).join(', ');
                    message += `<b>Tags</b>: ${tagNames}`;
                }
                
                
                await sendTelegramMessage(message);
            }
        }
    }, 15000); // 15 giây
}

sendTelegramMessage("🔥 <b>Tin mới nhất</b>: : https://tradecoinvn.com/newsfeed/newsfeed-detail/bitcoin-dang-lap-lai-chu-ky-nam-2016-chuyen-gia-dat-muc-tieu-350000-usd-cho-btc")
// Gọi hàm checkAndSendNews để bắt đầu quá trình kiểm tra và gửi thông báo
checkAndSendNews().catch(error => {
    console.error("Error:", error);
});
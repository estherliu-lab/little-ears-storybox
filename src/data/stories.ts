import { assetPath } from "../utils/assets";

export type StoryMode = "bedtime" | "brave" | "meal" | "hug";

export type CharacterId = "lamb" | "bunny" | "cat" | "dog" | "bear" | "duck";

export type Story = {
  id: string;
  character: CharacterId;
  mode: StoryMode;
  title: {
    zh: string;
    en: string;
  };
  text: {
    zh: string;
    en: string;
  };
  moral: {
    zh: string;
    en: string;
  };
  audio: Record<Language, string>;
  durationSeconds: number;
};

export type Language = "zh" | "en";

export const characters: Record<
  CharacterId,
  {
    zh: string;
    en: string;
    emoji: string;
    color: string;
    image: string;
  }
> = {
  lamb: { zh: "小羊", en: "Little Lamb", emoji: "🐑", color: "#c9c0f2", image: assetPath("assets/optimized/characters/lamb.jpg") },
  bunny: { zh: "小兔", en: "Little Bunny", emoji: "🐰", color: "#f5a9a9", image: assetPath("assets/optimized/characters/bunny.jpg") },
  cat: { zh: "小猫", en: "Little Cat", emoji: "🐱", color: "#c9a7e8", image: assetPath("assets/optimized/characters/cat.jpg") },
  dog: { zh: "小狗", en: "Little Puppy", emoji: "🐶", color: "#f6d28b", image: assetPath("assets/optimized/characters/dog.jpg") },
  bear: { zh: "小熊", en: "Little Bear", emoji: "🐻", color: "#cfe1ba", image: assetPath("assets/optimized/characters/bear.jpg") },
  duck: { zh: "小鸭", en: "Little Duck", emoji: "🐥", color: "#a8d7e8", image: assetPath("assets/optimized/characters/duck.jpg") },
};

export const modeLabels: Record<StoryMode | "all", { zh: string; en: string; icon: string }> = {
  all: { zh: "全部", en: "All", icon: "✨" },
  bedtime: { zh: "睡前", en: "Bedtime", icon: "🌙" },
  brave: { zh: "勇敢", en: "Brave", icon: "⭐" },
  meal: { zh: "吃饭", en: "Mealtime", icon: "🥣" },
  hug: { zh: "抱抱", en: "Hug", icon: "🤗" },
};

export const stories: Story[] = [
  {
    id: "lamb-bedtime-moon",
    character: "lamb",
    mode: "bedtime",
    title: { zh: "小羊和月亮被子", en: "Lamb and the Moon Blanket" },
    text: {
      zh: "小羊把一朵软云铺在床边。月亮轻轻照进窗子，像一条暖暖的小被子。小羊抱着蓝色小枕头，听风说晚安。星星眨呀眨，小羊也眨呀眨。很快，它在甜甜的草香里睡着了。",
      en: "Little Lamb placed a soft cloud beside the bed. The moon shone through the window like a warm blanket. Lamb hugged a blue pillow and listened as the wind whispered good night. The stars blinked slowly. Lamb blinked slowly too. Soon, in the sweet smell of grass, Lamb fell asleep.",
    },
    moral: { zh: "慢慢安静下来，夜晚会抱住你。", en: "When you grow quiet, nighttime can hold you softly." },
    audio: { zh: assetPath("assets/audio/zh/lamb-bedtime-moon.mp3"), en: assetPath("assets/audio/en/lamb-bedtime-moon.mp3") },
    durationSeconds: 45,
  },
  {
    id: "lamb-share-bells",
    character: "lamb",
    mode: "hug",
    title: { zh: "小羊的铃铛抱抱", en: "Lamb's Bell Hug" },
    text: {
      zh: "小羊有一只叮当响的小铃铛。小兔听见了，眼睛亮亮的。小羊把铃铛放到小兔手里，两个人一起摇，叮当，叮当。声音像小星星落在草地上。最后，小羊和小兔抱了一下，铃铛也轻轻响了一下。",
      en: "Little Lamb had a tiny bell that rang ding-ding. Little Bunny heard it and smiled with bright eyes. Lamb put the bell in Bunny's paws. Together they shook it gently, ding-ding, ding-ding. The sound felt like small stars landing in the grass. At the end, Lamb and Bunny shared a hug, and the bell rang softly too.",
    },
    moral: { zh: "一起听见快乐，快乐会更暖。", en: "Shared joy feels even warmer." },
    audio: { zh: assetPath("assets/audio/zh/lamb-share-bells.mp3"), en: assetPath("assets/audio/en/lamb-share-bells.mp3") },
    durationSeconds: 50,
  },
  {
    id: "bunny-brave-puddle",
    character: "bunny",
    mode: "brave",
    title: { zh: "小兔跨过小水洼", en: "Bunny Steps Over the Puddle" },
    text: {
      zh: "雨停了，路上有一个亮亮的小水洼。小兔停下来，看见水里有云朵。它先伸出一只脚，轻轻点了点。水洼笑出小圆圈。小兔深吸一口气，跳了过去。啪嗒！它回头看，原来自己已经很勇敢了。",
      en: "The rain stopped, and a shiny puddle sat on the path. Little Bunny stopped and saw a cloud inside the water. Bunny stretched out one paw and tapped it softly. The puddle made little round smiles. Bunny took a quiet breath and hopped across. Plip-plop! Bunny looked back and found a brave feeling waiting there.",
    },
    moral: { zh: "小小一步，也可以很勇敢。", en: "One tiny step can be brave." },
    audio: { zh: assetPath("assets/audio/zh/bunny-brave-puddle.mp3"), en: assetPath("assets/audio/en/bunny-brave-puddle.mp3") },
    durationSeconds: 48,
  },
  {
    id: "bunny-cleanup-basket",
    character: "bunny",
    mode: "bedtime",
    title: { zh: "小兔的玩具篮", en: "Bunny's Toy Basket" },
    text: {
      zh: "睡觉前，小兔的积木还在地毯上排队。红色积木跳进篮子，黄色积木跟着进去。小兔一边哼歌，一边把小车和小球送回家。篮子变得圆鼓鼓，房间变得软软静静。小兔拍拍手，说，晚安玩具们。",
      en: "Before bedtime, Bunny's blocks were still lined up on the rug. The red block jumped into the basket, and the yellow block followed. Bunny hummed a tiny song and helped the car and the ball go home. The basket became round and full. The room became soft and quiet. Bunny clapped gently and said, good night, toys.",
    },
    moral: { zh: "东西回到家，房间也会安心。", en: "When things go home, the room feels peaceful." },
    audio: { zh: assetPath("assets/audio/zh/bunny-cleanup-basket.mp3"), en: assetPath("assets/audio/en/bunny-cleanup-basket.mp3") },
    durationSeconds: 52,
  },
  {
    id: "cat-meal-soup",
    character: "cat",
    mode: "meal",
    title: { zh: "小猫的南瓜汤", en: "Cat's Pumpkin Soup" },
    text: {
      zh: "小猫闻到一碗香香的南瓜汤。汤面上有一颗小小的星星葱花。小猫先吹一吹，再喝一小口。哇，暖暖的味道跑进肚子里。它又吃了一块软面包，尾巴慢慢摇起来，像在说，真舒服呀。",
      en: "Little Cat smelled a bowl of pumpkin soup. A tiny green onion star floated on top. Cat blew gently, then took one small sip. Ahh, warm flavor went all the way to the tummy. Cat nibbled a soft piece of bread too. The little tail began to sway, as if it was saying, this feels very cozy.",
    },
    moral: { zh: "慢慢尝一口，肚子会知道喜欢。", en: "Try one small taste and let your tummy listen." },
    audio: { zh: assetPath("assets/audio/zh/cat-meal-soup.mp3"), en: assetPath("assets/audio/en/cat-meal-soup.mp3") },
    durationSeconds: 46,
  },
  {
    id: "cat-brave-brush",
    character: "cat",
    mode: "brave",
    title: { zh: "小猫刷牙泡泡", en: "Cat and the Tooth Bubbles" },
    text: {
      zh: "小猫看着牙刷上的白色泡泡，有一点点犹豫。妈妈说，泡泡很轻，像小云朵。小猫张开嘴，刷刷前面，刷刷里面。泡泡变成小雪花，轻轻飞走。小猫照照镜子，牙齿亮亮的，笑容也亮亮的。",
      en: "Little Cat looked at the white bubbles on the toothbrush and felt a little unsure. Mama said the bubbles were light, like tiny clouds. Cat opened wide. Brush-brush in front. Brush-brush inside. The bubbles became little snowflakes and floated away. Cat looked in the mirror. The teeth were shiny, and the smile was shiny too.",
    },
    moral: { zh: "新事情可以慢慢试。", en: "A new thing can be tried slowly." },
    audio: { zh: assetPath("assets/audio/zh/cat-brave-brush.mp3"), en: assetPath("assets/audio/en/cat-brave-brush.mp3") },
    durationSeconds: 50,
  },
  {
    id: "dog-hug-window",
    character: "dog",
    mode: "hug",
    title: { zh: "小狗等一个抱抱", en: "Puppy Waits for a Hug" },
    text: {
      zh: "小狗坐在窗边，尾巴轻轻扫着垫子。外面有风，屋里有灯。它想要一个抱抱，就把小毯子叼到爸爸脚边。爸爸蹲下来，张开手臂。小狗钻进怀里，听见心跳咚咚，像一面温柔的小鼓。",
      en: "Little Puppy sat by the window, sweeping the cushion with a soft tail. Outside, the wind moved. Inside, the lamp glowed. Puppy wanted a hug, so it carried a small blanket to Papa's feet. Papa knelt down and opened his arms. Puppy curled into the hug and heard a heartbeat, thump-thump, like a gentle little drum.",
    },
    moral: { zh: "想被抱抱时，可以轻轻告诉爱你的人。", en: "When you need a hug, you can gently ask someone who loves you." },
    audio: { zh: assetPath("assets/audio/zh/dog-hug-window.mp3"), en: assetPath("assets/audio/en/dog-hug-window.mp3") },
    durationSeconds: 50,
  },
  {
    id: "dog-brave-slide",
    character: "dog",
    mode: "brave",
    title: { zh: "小狗第一次滑滑梯", en: "Puppy's First Slide" },
    text: {
      zh: "公园里的小滑梯亮亮的。小狗爬到第二级，又停了一下。小熊在下面挥挥手，说我在这里。小狗坐好，抓住两边，呼地滑下来。风亲了一下它的耳朵。小狗笑了，说，我还想再来一次。",
      en: "The small slide in the park looked shiny. Puppy climbed to the second step and paused. Little Bear waved from below and said, I am right here. Puppy sat down, held both sides, and whoosh, slid down. The wind kissed one ear. Puppy laughed and said, I would like to try again.",
    },
    moral: { zh: "有人陪着，第一次会更轻。", en: "First tries feel softer with someone nearby." },
    audio: { zh: assetPath("assets/audio/zh/dog-brave-slide.mp3"), en: assetPath("assets/audio/en/dog-brave-slide.mp3") },
    durationSeconds: 47,
  },
  {
    id: "bear-bedtime-lamp",
    character: "bear",
    mode: "bedtime",
    title: { zh: "小熊的小夜灯", en: "Bear's Little Night Light" },
    text: {
      zh: "小熊把小夜灯打开，墙上出现一颗暖黄色的星星。它给星星盖上想象中的小被子，又给枕头拍了三下。屋子里安安静静，只有灯光像蜂蜜一样流着。小熊闭上眼睛，梦见自己坐在云朵船上。",
      en: "Little Bear turned on the night light, and a warm yellow star appeared on the wall. Bear tucked an imaginary blanket around the star and patted the pillow three times. The room was quiet. The light flowed like honey. Bear closed both eyes and dreamed of riding in a little cloud boat.",
    },
    moral: { zh: "柔柔的光，会陪你进入梦里。", en: "A gentle light can walk with you into dreams." },
    audio: { zh: assetPath("assets/audio/zh/bear-bedtime-lamp.mp3"), en: assetPath("assets/audio/en/bear-bedtime-lamp.mp3") },
    durationSeconds: 49,
  },
  {
    id: "bear-meal-berries",
    character: "bear",
    mode: "meal",
    title: { zh: "小熊的蓝莓碗", en: "Bear's Blueberry Bowl" },
    text: {
      zh: "早餐桌上有一个小碗，里面躺着圆圆的蓝莓。小熊数一颗，吃一颗。酸酸甜甜的味道让它眯起眼睛。它把最后一颗留给小鸭。小鸭说谢谢，小熊笑了。碗空了，早晨也变得亮亮的。",
      en: "On the breakfast table sat a small bowl of round blueberries. Little Bear counted one berry and ate one berry. The sweet-tart taste made Bear's eyes smile. Bear saved the last berry for Little Duck. Duck said thank you, and Bear smiled back. The bowl was empty, and the morning felt bright.",
    },
    moral: { zh: "留一点给朋友，心里会甜甜的。", en: "Saving a little for a friend can feel sweet." },
    audio: { zh: assetPath("assets/audio/zh/bear-meal-berries.mp3"), en: assetPath("assets/audio/en/bear-meal-berries.mp3") },
    durationSeconds: 46,
  },
  {
    id: "duck-meal-noodles",
    character: "duck",
    mode: "meal",
    title: { zh: "小鸭的细面条", en: "Duck's Tiny Noodles" },
    text: {
      zh: "小鸭看见碗里的细面条，像一条条小小的河。它用勺子卷起一点点，吹了吹，啊呜吃下去。面条滑进肚子，带着胡萝卜的香味。小鸭拍拍肚皮，嘎嘎笑，碗里还剩一座小小面条山。",
      en: "Little Duck looked at the thin noodles in the bowl. They were like tiny rivers. Duck rolled a little bit onto the spoon, blew softly, and took a bite. The noodles slid into the tummy with a carrot smell. Duck patted the belly and giggled, quack-quack. A small noodle mountain still waited in the bowl.",
    },
    moral: { zh: "一小口一小口，饭饭会变少。", en: "Tiny bites can make the meal mountain smaller." },
    audio: { zh: assetPath("assets/audio/zh/duck-meal-noodles.mp3"), en: assetPath("assets/audio/en/duck-meal-noodles.mp3") },
    durationSeconds: 48,
  },
  {
    id: "duck-hug-raincoat",
    character: "duck",
    mode: "hug",
    title: { zh: "小鸭的雨衣抱抱", en: "Duck's Raincoat Hug" },
    text: {
      zh: "小鸭穿上黄色雨衣，听见屋檐滴答滴答。它有点想妈妈，就摇摇摆摆走过去。妈妈把毛巾展开，像一片暖云。小鸭钻进去，雨衣也被抱住了。窗外雨声小了，心里的声音也软了。",
      en: "Little Duck put on a yellow raincoat and heard drip-drop from the roof. Duck missed Mama a little, so it waddled over. Mama opened a towel like a warm cloud. Duck tucked inside, and even the raincoat got a hug. Outside, the rain sounded smaller. Inside, Duck's feelings became soft.",
    },
    moral: { zh: "抱一抱，心里的雨会小一点。", en: "A hug can make the rain inside feel smaller." },
    audio: { zh: assetPath("assets/audio/zh/duck-hug-raincoat.mp3"), en: assetPath("assets/audio/en/duck-hug-raincoat.mp3") },
    durationSeconds: 50,
  },
];

export function pickStory(character: CharacterId, mode: StoryMode | "all", offset = 0) {
  const pool = stories.filter((story) => story.character === character && (mode === "all" || story.mode === mode));
  const fallback = stories.filter((story) => story.character === character);
  const list = pool.length > 0 ? pool : fallback;
  return list[Math.abs(offset) % list.length];
}

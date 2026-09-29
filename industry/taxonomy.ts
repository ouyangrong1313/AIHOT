// 安防行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉模型怎么归类。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 */
export const CATEGORIES = [
  { key: "product", label: "产品", section: "产品与方案发布", guide: "摄像机、NVR、门禁、报警、对讲、雷达、音频、热成像、云台、AI 盒子、平台软件、客户端 App 与固件的新品发布、重大功能更新、停产与型号迭代" },
  { key: "technology", label: "技术", section: "技术方向", guide: "端侧 AI 算法、图像与视频处理、编解码、低照度与宽动态、周界检测、识别与结构化、协议与互联、芯片与模组、低功耗与电池、云边协同等技术进展" },
  { key: "standard", label: "标准", section: "标准与检测认证", guide: "国标 GB、行标 GA/GY、团标、地方标准、国际标准（IEC/ISO/EN/UL/ONVIF）的发布、征求意见、修订，以及检测认证、合规要求与测试规范" },
  { key: "industry", label: "行业", section: "行业动态", guide: "公司经营、财报、融资并购、人事变动、战略合作、诉讼处罚、招投标与中标、产能与工厂、市场数据与研究报告" },
  { key: "policy", label: "政策", section: "政策与监管", guide: "法律法规、部委政策与通知、行业准入、数据安全与个人信息保护要求、专项整治、地方监管措施与执法动态" },
  { key: "project", label: "应用", section: "场景与项目落地", guide: "平安城市、雪亮工程、智慧交通、智慧园区、社区、工厂、校园、医院、零售、金融、能源等场景的落地案例、项目进展与实效数据" },
  { key: "opinion", label: "观点", section: "观点与研究", guide: "行业趋势判断、专家访谈、展会观察、技术评测、复盘与分析，以及对行业现象的评论" },
] as const;

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = [
  "product_release", "technology_advance", "standard_certification", "regulation_policy",
  "business_event", "project_case", "opinion_analysis",
] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "产品发布", "固件/软件更新", "技术进展", "标准发布", "检测认证", "政策/监管",
  "行业动态", "招投标/项目", "应用场景", "展会/活动", "观点/分析", "评测/对比",
  "数据安全", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "视频监控", "端侧AI", "图像算法", "低照度", "周界防范", "门禁对讲", "报警探测",
  "热成像", "毫米波雷达", "音频拾取", "车牌识别", "人脸识别", "行为分析", "视频结构化",
  "编解码", "云存储", "边缘计算", "物联网协议", "ONVIF/GB28181", "低功耗/电池",
  "家用消费级", "商用企业级", "工业/防爆", "交通", "零售", "园区社区",
] as const;

/** 可选的实体标签（公司、机构）。 */
export const ENTITY_TAGS = [
  "海康威视", "大华股份", "宇视科技", "华为机器视觉", "天地伟业", "萤石网络",
  "乐橙", "Axis", "Bosch", "Hanwha", "Milestone", "Genetec", "Lorex", "Longse",
  "公安部", "市场监管总局", "网信办", "工信部", "中国安防协会",
] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  新品: "产品发布", 发布: "产品发布", 上市: "产品发布", 推出: "产品发布", 产品: "产品发布",
  固件: "固件/软件更新", 升级: "固件/软件更新", 软件更新: "固件/软件更新", 版本更新: "固件/软件更新",
  技术: "技术进展", 算法: "技术进展", 研发: "技术进展", 突破: "技术进展", 专利: "技术进展",
  标准: "标准发布", 国标: "标准发布", 行标: "标准发布", 团标: "标准发布", 征求意见: "标准发布",
  认证: "检测认证", 检测: "检测认证", 测评认证: "检测认证", 合规认证: "检测认证",
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管", 通知: "政策/监管", 处罚: "政策/监管", 整治: "政策/监管",
  融资: "行业动态", 并购: "行业动态", 收购: "行业动态", 财报: "行业动态", 业绩: "行业动态",
  人事: "行业动态", 合作: "行业动态", 签约: "行业动态", 中标: "招投标/项目", 招标: "招投标/项目", 项目: "招投标/项目",
  案例: "应用场景", 落地: "应用场景", 方案: "应用场景", 部署: "应用场景", 工程: "应用场景",
  展会: "展会/活动", 论坛: "展会/活动", 峰会: "展会/活动", 发布会: "展会/活动", 培训: "展会/活动",
  观点: "观点/分析", 评论: "观点/分析", 趋势: "观点/分析", 分析: "观点/分析", 访谈: "观点/分析",
  评测: "评测/对比", 对比: "评测/对比", 横评: "评测/对比", 实测: "评测/对比",
  数据安全: "数据安全", 隐私: "数据安全", 个人信息保护: "数据安全", 网络安全: "数据安全",
  监控: "视频监控", 摄像机: "视频监控", 摄像头: "视频监控", ipc: "视频监控",
  ai: "端侧AI", 智能分析: "端侧AI", 边缘智能: "端侧AI", 算法芯片: "端侧AI",
  门禁: "门禁对讲", 对讲: "门禁对讲", 可视对讲: "门禁对讲",
  报警: "报警探测", 探测器: "报警探测", 入侵探测: "报警探测",
  周界: "周界防范", 电子围栏: "周界防范",
  云台: "视频监控", ptz: "视频监控", nvr: "视频监控", dvr: "视频监控", 存储: "云存储",
  行业: "行业动态", 动态: "行业动态", 市场: "行业动态",
};

/** 模型漏了分类标签时，按内容类型补一个。 */
export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string, string>> = {
  product_release: "产品发布",
  technology_advance: "技术进展",
  standard_certification: "标准发布",
  regulation_policy: "政策/监管",
  business_event: "行业动态",
  project_case: "应用场景",
  opinion_analysis: "观点/分析",
};

/** 行业里的主要公司或机构，用于“公司”类主题页。displayTag 是页面上显示的名字。 */
export const ENTITIES: Readonly<Record<string, { name: string; displayTag: string | null; aliases: readonly string[] }>> = {
  hikvision: { name: "海康威视", displayTag: "海康威视", aliases: ["海康威视", "海康", "HIKVISION", "Hikvision"] },
  dahua: { name: "大华股份", displayTag: "大华股份", aliases: ["大华股份", "大华技术", "大华", "Dahua", "DAHUA"] },
  uniview: { name: "宇视科技", displayTag: "宇视科技", aliases: ["宇视科技", "宇视", "Uniview", "UNV"] },
  huawei: { name: "华为机器视觉", displayTag: "华为机器视觉", aliases: ["华为机器视觉", "华为好望", "HoloSens", "华为"] },
  tiandy: { name: "天地伟业", displayTag: "天地伟业", aliases: ["天地伟业", "Tiandy"] },
  ezviz: { name: "萤石网络", displayTag: "萤石网络", aliases: ["萤石网络", "萤石", "EZVIZ", "Ezviz"] },
  imou: { name: "乐橙", displayTag: "乐橙", aliases: ["乐橙", "Imou", "IMOU"] },
  axis: { name: "Axis", displayTag: "Axis", aliases: ["Axis", "安讯士", "AXIS"] },
  lorex: { name: "Lorex", displayTag: "Lorex", aliases: ["Lorex", "乐瑞"] },
  longse: { name: "龙视科技 Longse", displayTag: "Longse", aliases: ["Longse", "龙视科技", "龙视", "深圳龙视"] },
  bosch: { name: "Bosch", displayTag: "Bosch", aliases: ["Bosch", "博世"] },
  hanwha: { name: "Hanwha Vision", displayTag: "Hanwha", aliases: ["Hanwha", "Hanwha Vision", "韩华", "Hanwha Techwin"] },
  milestone: { name: "Milestone", displayTag: "Milestone", aliases: ["Milestone", "Milestone Systems"] },
  genetec: { name: "Genetec", displayTag: "Genetec", aliases: ["Genetec"] },
  mps: { name: "公安部", displayTag: "公安部", aliases: ["公安部", "MPS"] },
  samr: { name: "市场监管总局", displayTag: "市场监管总局", aliases: ["市场监管总局", "国家市场监督管理总局", "SAMR", "国家认监委"] },
  cac: { name: "网信办", displayTag: "网信办", aliases: ["网信办", "中央网信办", "国家互联网信息办公室"] },
  miit: { name: "工信部", displayTag: "工信部", aliases: ["工信部", "工业和信息化部", "MIIT"] },
  csppi: { name: "中国安全防范产品行业协会", displayTag: "中国安防协会", aliases: ["中国安防协会", "中国安全防范产品行业协会", "中安协"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 安防行业里厂商名极易混淆（海康/大华/宇视经常同时出现在一篇行业综述里），保留这个机制。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "hikvision", name: "海康威视", patterns: [/海康威视|海康|\bhikvision\b/i] },
  { id: "dahua", name: "大华股份", patterns: [/大华股份|大华技术|\b(?:浙江)?大华\b|\bdahua\b/i] },
  { id: "uniview", name: "宇视科技", patterns: [/宇视科技|宇视|\buniview\b|\bunv\b/i] },
  { id: "huawei", name: "华为机器视觉", patterns: [/华为机器视觉|华为好望|\bholosens\b|华为/i] },
  { id: "tiandy", name: "天地伟业", patterns: [/天地伟业|\btiandy\b/i] },
  { id: "ezviz", name: "萤石网络", patterns: [/萤石网络|萤石|\bezviz\b/i] },
  { id: "imou", name: "乐橙", patterns: [/乐橙|\bimou\b/i] },
  { id: "axis", name: "Axis", patterns: [/\baxis\b|安讯士/i] },
  { id: "lorex", name: "Lorex", patterns: [/\blorex\b/i] },
  { id: "longse", name: "龙视科技 Longse", patterns: [/\blongse\b|龙视科技|深圳龙视/i] },
  { id: "bosch", name: "Bosch", patterns: [/\bbosch\b|博世/i] },
  { id: "hanwha", name: "Hanwha Vision", patterns: [/hanwha|韩华/i] },
  { id: "milestone", name: "Milestone", patterns: [/milestone/i] },
  { id: "genetec", name: "Genetec", patterns: [/genetec/i] },
  { id: "mps", name: "公安部", patterns: [/公安部|公安一所|公安三所/i] },
  { id: "samr", name: "市场监管总局", patterns: [/市场监管总局|市场监督管理总局|国家认监委/i] },
  { id: "cac", name: "网信办", patterns: [/网信办|互联网信息办公室/i] },
  { id: "miit", name: "工信部", patterns: [/工信部|工业和信息化部/i] },
  { id: "csppi", name: "中国安全防范产品行业协会", patterns: [/中国安防协会|安全防范产品行业协会|中安协/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（行业媒体不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "hikvision", domains: ["hikvision.com", "hikrobotics.com"] },
  { entityId: "dahua", domains: ["dahuasecurity.com", "dahuatech.com"] },
  { entityId: "uniview", domains: ["uniview.com"] },
  { entityId: "huawei", domains: ["huawei.com"] },
  { entityId: "tiandy", domains: ["tiandy.com"] },
  { entityId: "ezviz", domains: ["ezviz.com", "ys7.com"] },
  { entityId: "axis", domains: ["axis.com"] },
  { entityId: "bosch", domains: ["bosch.com", "boschsecurity.com"] },
  { entityId: "hanwha", domains: ["hanwhavision.com"] },
  { entityId: "milestone", domains: ["milestonesys.com"] },
  { entityId: "genetec", domains: ["genetec.com"] },
  { entityId: "csppi", domains: ["csppi.org"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "dahua", pattern: /浙江大华技术股份有限公司/ },
  { entityId: "hikvision", pattern: /杭州海康威视数字技术股份有限公司/ },
  { entityId: "ezviz", pattern: /杭州萤石网络股份有限公司/ },
];

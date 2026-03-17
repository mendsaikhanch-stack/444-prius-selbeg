import { FBIcon, IGIcon, TKIcon, YTIcon } from '../components/icons/SocialIcons';

export const DEFAULT_BIZ={
  name:"Манай СӨХ",
  phone:"7700-0000",
  phone2:"",
  address:"УБ хот",
  branches:[{name:"Төв оффис",phone:"7700-0000",address:"УБ хот"}],
  facebook:"",
  instagram:"",
  tiktok:"",
  youtube:"",
  fbPixelId:"",
  fbPageId:"",
  workHours:"Даваа-Баасан: 09:00-18:00",
  bankName:"Хаан банк",
  accountNo:"",
  accountHolder:"Манай СӨХ",
  mapEmbed:"",
  mapUrl:"",
};

export const getSOCIALS=(biz)=>[
  {key:"facebook",label:"Facebook",Icon:FBIcon,url:biz.facebook,color:"text-blue-600",bg:"bg-blue-600",followers:"2.4K"},
  {key:"instagram",label:"Instagram",Icon:IGIcon,url:biz.instagram,color:"text-pink-600",bg:"bg-gradient-to-r from-purple-600 to-pink-500",followers:"1.8K"},
  {key:"tiktok",label:"TikTok",Icon:TKIcon,url:biz.tiktok,color:"text-black dark:text-white",bg:"bg-black",followers:"3.1K"},
  {key:"youtube",label:"YouTube",Icon:YTIcon,url:biz.youtube,color:"text-red-600",bg:"bg-red-600",followers:"890"},
];

import mongoose from 'mongoose';

const businessSettingsSchema = new mongoose.Schema({
  name:          { type: String, default: 'Манай СӨХ' },
  phone:         { type: String, default: '7700-0000' },
  phone2:        { type: String, default: '' },
  address:       { type: String, default: 'УБ хот' },
  branches:      { type: [{ name: String, phone: String, address: String }], default: [] },
  facebook:      { type: String, default: '' },
  instagram:     { type: String, default: '' },
  tiktok:        { type: String, default: '' },
  youtube:       { type: String, default: '' },
  fbPixelId:     { type: String, default: '' },
  fbPageId:      { type: String, default: '' },
  workHours:     { type: String, default: 'Даваа-Бямба: 09:00-19:00' },
  bankName:      { type: String, default: 'Хаан банк' },
  accountNo:     { type: String, default: '' },
  accountHolder: { type: String, default: '' },
  mapEmbed:      { type: String, default: '' },
  mapUrl:        { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('BusinessSettings', businessSettingsSchema);
